<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { queryAllApi, addApi, queryByIdApi, updateApi, deleteByIdApi } from '@/api/dept';
import { ElMessage, ElMessageBox } from 'element-plus';


// 基于axios查询
// const search = async () => {
//     const result = await axios.get('https://m1.apifoxmock.com/m1/6765794-6477776-default/depts');
//     if(result.data.code == 1){
//         deptList.value = result.data.data;
//     }
// }

// 基于 requestUtils-api 查询
const search = async () => {
    const result = await queryAllApi();
    if (result.code == 1) {
        deptList.value = result.data;
    }
}

// 钩子函数
onMounted(() => {
    search();
})

// 函数
// 点击保存按钮触发事件
const save = async () => {
    // 表单校验
    if (!deptFormRef.value) return;// 表单是否存在
    deptFormRef.value.validate(async (valid) => {// valid: 是否通过校验
        if (valid) {// 通过校验

            let result;
            // 判断该执行新增还是修改操作
            if (dept.value.id) {// id有值，执行修改操作
                result = await updateApi(dept.value);
            } else {// id无值，执行新增操作
                result = await addApi(dept.value);
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

// 点击新增学院按钮事件
const addDept = () => {
    // 对话框可视化
    dialogFormVisible.value = true;
    // 修改对话框标题
    formTitle.value = '新增学院';
    // 表单数据清空
    dept.value = {};
    // 校验信息清空
    if (deptFormRef.value) {
        deptFormRef.value.resetFields();
    }
}

// 点击修改学院按钮事件
const updateDept = async (id) => {
    // 查询回显
    const result = await queryByIdApi(id);
    if (result.code == 1) {
        // 对话框可视化
        dialogFormVisible.value = true;
        // 修改对话框名称
        formTitle.value = "修改学院信息";
        // 赋值
        dept.value = result.data;
        // 清空校验信息
        if (deptFormRef.value) {
            deptFormRef.value.resetFields();
        }
    }
}

// 点击删除按钮事件
const deleteDept = async (id) => {
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
            const result = await deleteByIdApi(id);
            if (result.code == 1) {
                ElMessage({
                    type: 'success',
                    message: '喵喵喵~删除成功！',
                });
                search();
            }else{
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


// 数据
// 学院列表
const deptList = ref([]);
// 对话框是否可见
const dialogFormVisible = ref(false);
// 单个学院数据
const dept = ref({
    name: ''
});
// 对话框标题
const formTitle = ref('');


// 表单校验相关规则
const rules = ref({
    name: [
        // 必填规则
        // trigger: 触发方式 blur: 失去焦点时触发
        { required: true, message: '学院名称是必填项~喵', trigger: 'blur' },
        // 长度限制规则
        { min: 3, max: 20, message: '看清楚了~喵，请输入长度3~20的名字~喵', trigger: 'blur' },
    ]
})
const deptFormRef = ref();

</script>

<template>
    <h1>学院管理</h1>

    <div class="container">
        <el-button type="primary" @click="addDept"> + 新增学院</el-button>
    </div>

    <!-- 学院信息展示 -->
    <div class="container">
        <el-table :data="deptList" border style="width: 80%">
            <el-table-column type="index" width="50" />
            <el-table-column prop="name" label="学院名称" width="260" align="center" />
            <el-table-column prop="updateTime" label="最后操作时间" width="360" align="center" />
            <el-table-column prop="操作" label="操作" align="center">
                <template #default="scope">
                    <div class="mb-4">
                        <el-button key="修改" type="primary" text @click=updateDept(scope.row.id)>
                            修改
                        </el-button>
                        <el-button key="删除" type="danger" text @click=deleteDept(scope.row.id)>
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
        <!-- {{ dept }} -->
        <el-form :model="dept" :rules="rules" ref="deptFormRef">
            <el-form-item label="学院名称" label-width="80" prop="name">
                <el-input v-model="dept.name" placeholder="喵~请输入学院名称（3~20个字符）" />
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
