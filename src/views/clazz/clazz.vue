<script setup>
import { ref, onMounted, watch } from 'vue';
import { queryAllApi, addApi, updateApi, queryByIdApi, deleteApi } from '@/api/clazz';
import { queryAllApi as queryAllEmpApi } from '@/api/emp';
import { ElMessage, ElMessageBox } from 'element-plus';
import { computed } from 'vue';


// 数据
    // 学院列表
    const clazzList = ref([]);

    // 员工列表
    const empList = ref([]);

    // 对话框标题
    const formTitle = ref('');

    // 对话框是否可见
    const dialogFormVisible = ref(false);

    // 单个乐队
    const clazz = ref({
        name: '',
        room: '',
        beginDate: '',
        endDate: '',
        masterId: '',
        subject: '',
        date: [],
    })

    // 表单引用
    const clazzFormRef = ref();

    // 日期选择器参数
    const size = ref<'default' | 'large' | 'small'>('default');

    // 演奏风格参数
    const style = ref([
        { value: '1', label: '摇滚' },
        { value: '2', label: '民谣' },
        { value: '3', label: '爵士' },
        { value: '4', label: ' blues' },
        { value: '5', label: '其他' },
    ])



// 基于axios查询
// const search = async () => {
//     const result = await axios.get('https://m1.apifoxmock.com/m1/6765794-6477776-default/depts');
//     if(result.data.code == 1){
//         deptList.value = result.data.data;
//     }
// }

// 函数
    // 基于 requestUtils-api 查询
    const search = async () => {
        const result = await queryAllApi();
        if (result.code == 1) {
            clazzList.value = result.data;
        }
    }

    // 查询员工信息
    const searchAllEmp = async () => {
        const result = await queryAllEmpApi();
        if(result.code == 1){
            empList.value = result.data;
        }
    }

    // 根据id查询员工信息
        // 方法一：计算属性
            /** 计算属性定义
            *    接受一个 getter 函数，返回一个只读的响应式 ref 对象。
            *    该 ref 通过 .value 暴露 getter 函数的返回值。
            *    它也可以接受一个带有 get 和 set 函数的对象来创建一个可写的 ref 对象。
            // 只读
            function computed<T>(
                getter: (oldValue: T | undefined) => T,
                // 查看下方的 "计算属性调试" 链接
                debuggerOptions?: DebuggerOptions
            ): Readonly<Ref<Readonly<T>>>

            // 可写的
            function computed<T>(
                options: {
                    get: (oldValue: T | undefined) => T
                    set: (value: T) => void
                },
                debuggerOptions?: DebuggerOptions
            ): Ref<T>
            */
        const leaderMap = computed(() => { 
            const map = new Map();
            empList.value.forEach((masterId) => {
                map.set(masterId.id, masterId.name);
            })
            return map;
        })

        // 方法二：函数查找
        const getEmpNameById = (masterId) => {
            let empName = null;
            empList.value.forEach((emp) => {
                if(emp.id == masterId){
                    empName = emp.name;
                }
            })
            return empName ? empName : 'NULL';
        }

    // 钩子函数
    onMounted(() => {
        search();
        searchAllEmp();
    })

    // 点击新增乐队按钮事件
    const addClazz = () => {
        // 对话框可视化
        dialogFormVisible.value = true;
        // 修改对话框标题
        formTitle.value = '新增乐队';
        // 表单数据清空
        clazz.value = {
            name: '',
            room: '',
            beginDate: '',
            endDate: '',
            masterId: '',
            subject: '',
            date: [],
        }
        // 校验信息清空
        if (clazzFormRef.value) {
            clazzFormRef.value.resetFields();
        }
    }

    // 监听clazz中date变化
    watch(() => clazz.value.date, (newValue) => {
        if (Array.isArray(newValue) && newValue.length == 2) {
            clazz.value.beginDate = newValue[0];
            clazz.value.endDate = newValue[1];
        }
    });

    watch(()=>clazz.value.id ,(newVal) => {
        if(clazz.value.id){
            clazz.value.date = [clazz.value.beginDate, clazz.value.endDate];
        }
    },{deep: true})

    // 点击保存按钮触发事件
    const save = async () => {
        // 表单校验
        if (!clazzFormRef.value) return;// 表单是否存在
        clazzFormRef.value.validate(async (valid) => {// valid: 是否通过校验
            if (valid) {// 通过校验

                let result;
                // 判断该执行新增还是修改操作
                if (clazz.value.id) {// id有值，执行修改操作
                    result = await updateApi(clazz.value);
                } else {// id无值，执行新增操作
                    result = await addApi(clazz.value);
                }


                if (result.code == 1) {
                    // 提示信息
                    ElMessage.success('恭喜你，操作成功~喵');
                    // 关闭对话框
                    dialogFormVisible.value = false;
                    // 刷新数据
                    search();
                } else {
                    ElMessage({
                        message: '操作失败~喵' + result.msg,
                        duration: 5000,
                        type: 'error'
                    })
                }
            } else {// 未通过校验
                ElMessage({
                    message: '请填写正确的信息~喵',
                    duration: 5000,
                    type: 'warning'
                });
            }
        })
    }

    // 点击修改乐队按钮事件
    const updateClazz = async (id) => {
        // 查询回显
        const result = await queryByIdApi(id);
        if (result.code == 1) {
            // 对话框可视化
            dialogFormVisible.value = true;
            // 修改对话框名称
            formTitle.value = "修改乐队信息";
            // 赋值
            clazz.value = result.data;
            console.log(result);
            // 清空校验信息
            if (deptFormRef.value) {
                deptFormRef.value.resetFields();
            }
        }
    }
    // 点击删除按钮事件
    const deleteClazz = async (id) => {
        // 弹出确认框
        ElMessageBox.confirm(
            '主人确定要删除喵~啊？！',
            '喵喵喵？！',
            {
                confirmButtonText: '删他丫的',
                cancelButtonText: '按错了汪',
                type: 'warning',
            }
        ).then(async () => {// 点击确定按钮
            const result = await deleteApi(id);
            if (result.code == 1) {
                ElMessage({
                    type: 'success',
                    message: '喵喵喵~删除成功！',
                });
                search();
            } else {
                ElMessage({
                    type: 'error',
                    message: '操作失败了~喵' + result.message,
                });
            }
        }).catch(() => {// 点击取消按钮
            ElMessage({
                type: 'info',
                message: '什么都没发生~喵',
            })
        })
    }



// 函数




// 点击修改学院按钮事件


// 点击删除按钮事件





// 表单校验相关规则
const rules = ref({
    name: [
        // 必填规则
        // trigger: 触发方式 blur: 失去焦点时触发
        { required: true, message: '学院名称是必填项~喵', trigger: 'blur' },
        // 长度限制规则
        { min: 3, max: 20, message: '看清楚了~喵，请输入长度3~20的名字~喵', trigger: 'blur' },
    ],
    room: [
        { required: true, message: '训练室是必填项~喵', trigger: 'blur' },
        { min: 3, max: 20, message: '看清楚了~喵，请输入长度3~20的名字~喵', trigger: 'blur' },
    ],
    date: [
        { required: true, message: '活动时间是必填项~喵', trigger: 'blur' },
    ],
    subject: [
        { required: true, message: '演奏风格是必填项~喵', trigger: 'blur' },
    ]
})
const deptFormRef = ref();

</script>

<template>
    <h1>乐队管理</h1>

    <div class="container">
        <el-button type="primary" @click="addClazz"> + 新增班级</el-button>
    </div>

    <!-- 乐队信息展示 -->
    <div class="container">
        <el-table :data="clazzList" border style="width: 90%">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="name" label="乐队名称" width="150" align="center" />
            <el-table-column prop="room" label="乐队训练室" width="80" align="center" />
            <el-table-column prop="masterId" label="Leader" width="100" align="center">
                <template #default="scope">
                    <!-- 方法一：计算属性 -->
                    {{ leaderMap.get(scope.row.masterId) || 'NULL' }}
                    <!-- 方法二：函数查找 -->
                    <!-- {{ getEmpNameById(scope.row.masterId) }} -->
                </template>
            </el-table-column>
            <el-table-column prop="beginDate" label="乐队创立时间" width="150" align="center" />
            <el-table-column prop="endDate" label="乐队解散时间" width="150" align="center" />
            <el-table-column prop="status" label="状态" width="80" align="center">
                <template #default="scope">
                    <el-tag v-if="scope.row.status == 1" type="info">成立中</el-tag>
                    <el-tag v-else-if="scope.row.status == 2" type="success">在活动</el-tag>
                    <el-tag v-else type="danger">已解散</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="最后操作时间" width="200" align="center" />
            <el-table-column prop="操作" label="操作" align="center">
                <template #default="scope">
                    <div class="mb-4">
                        <el-button key="修改" type="primary" text @click="updateClazz(scope.row.id)">
                            修改
                        </el-button>
                        <el-button key="删除" type="danger" text @click="deleteClazz(scope.row.id)">
                            删除
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>


    <!-- 新增学院对话框 -->
    <el-dialog v-model="dialogFormVisible" :title="formTitle" width="500">
        <!-- 
        根据新增学院和修改学院的dept对象成员的不同，进行不同的处理。 
        dept只包含name成员，执行新增操作
        dept除name外包括其他成员，执行修改操作
        -->
        <!-- {{ clazz }} -->
        <el-form :model="clazz" :rules="rules" ref="clazzFormRef" label-width="100px">

            <el-form-item label="乐队名称"  prop="name">
                <el-input v-model="clazz.name" placeholder="喵~请输入学院名称（3~20个字符）" />
            </el-form-item>

            <el-form-item label="训练室"  prop="room">
                <el-input v-model="clazz.room" placeholder="喵~请输入乐队训练室（3~20个字符）" />
            </el-form-item>

            <el-form-item label="活动时间"  prop="date">
                <el-date-picker v-model="clazz.date" type="daterange" range-separator="到" start-placeholder="Start date"
                    end-placeholder="End date" :size="size"  format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
            </el-form-item>

            <el-form-item label="Leader"  >
                <el-select v-model="clazz.masterId" placeholder="请选择乐队的Leader~喵" style="width: 240px">
                    <el-option v-for="[id,name] in leaderMap" :key="id" :label="name" :value="id" />
                </el-select>
            </el-form-item>

            <el-form-item label="演奏风格"  prop="subject">
                <el-select v-model="clazz.subject" placeholder="请选择乐队的演奏风格~喵" style="width: 240px">
                    <el-option v-for="item in style" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>

        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="save">确定</el-button>
            </div>
        </template>
    </el-dialog>

</template>

<style scoped>
.container {
    margin: 10px 0px;
}
</style>
