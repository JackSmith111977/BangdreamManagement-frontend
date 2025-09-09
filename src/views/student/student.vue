<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { addApi, queryAllApi as queryAllDeptApi } from "@/api/dept";
import { queryAllApi as queryAllClazzApi } from "@/api/clazz";
import { queryPageApi, queryByIdApi, addApi as addStudentApi, updateApi, deleteApi, violationApi } from "@/api/student";


// 数据结构
    // 搜索表单对象
    const searchStudent = ref({
        name: '',
        degree: '',
        clazzId: '',
    });

    // 搜索表单选项
    const searchDegree = ref([
        { label: '初中', value: 1},
        { label: '高中', value: 2},
        { label: '大专', value: 3},
        { label: '本科', value: 4},
        { label: '硕士', value: 5},
        { label: '博士', value: 6},
    ]);

    // 为搜索表单选项添加计算属性
    const degreeMap = computed(() => {
        const map = new Map();
        searchDegree.value.forEach((degree) => {
            map.set(degree.value, degree.label);
        })
        return map;
    });

    // 班级列表
    const clazzList = ref([]);

    // 班级-id映射
    const clazzMap = computed(() => {
        const map = new Map();
        clazzList.value.forEach((clazz) => {
            map.set(clazz.id, clazz.name);
        })
        return map;
    })

    // 木柜子列表
    const studentList = ref([
        {
            name: '',
            no: '',
            clazzId: '',
            gender: '',
            phone: '',
            degree: '',
            updateTime: '',
            violationCount: '',
            violationScore: '',
            updateTime: '',
        },
    ]);

    // 木柜子
    const student = ref({
        id: '',
        name: '',
        no: '',
        phone: '',
        gender: '',
        degree: '',
        idCard: '',
        isCollege: '',
        address: '',
        graduationDate: '',
        violationCount: '',
        violationScore: '',
        clazzId: '',
        createTime: '',
        updateTime: '',
    });

    // 是否院校参数
    const isCollege = ref([
        {name: '是', value: 1},
        {name: '否', value: 0}
    ]);

    // 分页条参数
    const currentPage = ref(1);// 当前页码
    const pageSize = ref(5);// 每页条数
    const size = ref('default');// 尺寸
    const background = ref(false);// 背景色
    const disabled = ref(false);// 禁用
    const total = ref(0);

    // 对话框参数
    const dialogTableVisible = ref(false);
    const dialogTitle = ref();

    // 元数据

        // 性别列表数据
        const genders = ref([
            {name: '男',value: 1,},
            {name: '女',value: 2,},
        ]);

        // 学院列表数据，需查询学院数据返回
        const depts = ref([]);

    // 表单引用，用于校验表单
    const studentFormRef = ref();

    // 记录勾选的员工id
    const selectIds = ref([]);

    // 违纪扣分
    const score = ref();

    // 违纪处理对话框参数
    const dialogViolationVisible = ref(false);
    const violationId = ref();


// 函数
    // 查询员工列表
    const search = async () => {
        const result = await queryPageApi(searchStudent.value.name, 
                                        searchStudent.value.degree, 
                                        searchStudent.value.clazzId,
                                        currentPage.value,
                                        pageSize.value
                                    );
        if(result.code == 1){
            console.log(result.data);
            studentList.value = result.data.rows;
            total.value = result.data.total;
        }
    }

    // 查询部门列表
    const searchAllDept = async () => {
        const result = await queryAllDeptApi();
        if(result.code == 1){
            depts.value = result.data;
        }
    }

    // 查询班级列表
    const searchAllClazz = async () => {
        const result = await queryAllClazzApi();
        if(result.code == 1){
            clazzList.value = result.data;
        }
    }


    // 钩子函数查询员工列表,部门列表
    onMounted(() => {
        search();
        searchAllDept();
        searchAllClazz();
    })

    // 清空搜索栏
    const clear = () => {
        searchStudent.value = {};
    }

    // 每页展示数改变时触发
    const handleSizeChange = (val) => {
        search();
    }

    // 当前页改变时触发
    const handleCurrentChange = (val) => {
        search();
    }

    // 新增员工
    const addStudent = () => {
        // 打开对话框,更改标题
        dialogTableVisible.value = true;
        dialogTitle.value = '新增木柜子';
        // 表单数据清空
        student.value = {
            id: '',
            name: '',
            no: '',
            phone: '',
            gender: '',
            degree: '',
            idCard: '',
            isCollege: '',
            address: '',
            graduationDate: '',
            violationCount: '',
            violationScore: '',
            clazzId: '',
            createTime: '',
            updateTime: '',
        };
        // 校验信息清空
        if(studentFormRef.value){
            studentFormRef.value.resetFields();
        }
    }

    // 保存 添加 or 修改 员工
    const save = async () => {
            // 表单校验
            if(!studentFormRef.value)return;
            studentFormRef.value.validate(async (valid) => {
                if(valid){ // 通过校验
                    // 判断是新增员工还是修改员工
                    let result;
                    if(student.value.id){
                        result = await updateApi(student.value);
                    }else{
                        result = await addStudentApi(student.value);
                    }

                    
                    if (result.code == 1) {
                        // 提示信息
                        ElMessage({
                            message: '保存成功了~喵',
                            type: 'success',
                            duration: 5000
                        })

                        // 关闭对话框
                        dialogTableVisible.value = false;

                        // 数据回显
                        search();
                    } else { 
                        ElMessage({
                            message: '呜呜呜，保存失败了~喵' + result.msg,
                            type: 'error',
                            duration: 5000
                        })
                    }
                }else{ // 未通过校验
                    ElMessage({
                        message: '呜呜呜，请检查你的输入~喵',
                        type: 'error',
                        duration: 5000
                    });
                }
            })
    }

    // 取消保存
    const cancelSave = () => { 
            dialogTableVisible.value = false;
    }

    // 修改员工
    const updateStudent = async (id) => {
        // 显示对话框
        dialogTableVisible.value = true;
        dialogTitle.value = '修改木柜子信息';

        // 查询回显
        const result = await queryByIdApi(id);
        if (result.code == 1) { 
            student.value = result.data;
        }

    }

    // 删除单个员工
    const deleteStudent = async (id) => {
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

    // 批量删除员工
        // 多选框处理 --selection: 选中的数据的对象数组
        const handleSelectionChange = (selection) => {
            // Array.map(function(currentValue, index, arr), thisArg): 方法使用为每个数组元素调用函数的结果创建新数组。
            selectIds.value = selection.map((item) => {
                return item.id;
            })
        }

        // 批量删除
        const deleteByIds = async () => {
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
                if(selectIds.value.length == 0){
                    ElMessage({
                        type: 'warning',
                        message: '主人什么都没选~喵？！',
                        duration: 5000
                    });
                    return;
                }
                const result = await deleteApi(selectIds.value);
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

        // 点击违纪按钮事件
        const addViolationScore = (id) => {
            score.value = '';
            violationId.value = id;
            dialogViolationVisible.value = true;
        }

        const setViolation = async () => {
            const result = await violationApi(violationId.value, score.value);
            if(result.code == 1){
                dialogViolationVisible.value = false;
                search();
                ElMessage({
                    type: 'success',
                    message: '设置成功~喵',
                })
            }else{
                dialogViolationVisible.value = false;
                ElMessage({
                    type: 'error',
                    message: '出错了~喵' + result.msg,
                })
            }
        }

// 表单校验规则
const rules = ref({
    name: [
            //trigger: 校验触发方式
            { required: true, message: '请输入姓名~喵', trigger: 'blur' },// 必要性规则
            { min: 2, max: 20, message: '姓名长度必须在2-20之间~喵', trigger: 'blur' }// 长度规则
    ],
    no:[
            { required: true, message: '请输入学号~喵', trigger: 'blur' }
    ],
    gender: [
            { required: true, message: '请选择性别~喵', trigger: 'change' },
    ],
    phone: [
        { required: true, message: '请输入手机号~喵', trigger: 'blur' },
        /* 正则表达式 
        * 1. / ...... / 表示正则表达式的开头和结尾
        * 2. ^ 表示字符串的开头
        * 3. $ 表示字符串的结尾 
        * 4. [3-9] 表示数字的范围 
        * 5. \d 表示数字
        * 6. {9} 表示前面规则出现的次数
        */
        { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确~喵', trigger: 'blur' }// 正则表达式
    ],
    degree: [
        { required: true, message: '请输入学历~喵', trigger: 'blur' }
    ],
    clazzId: [
        { required: true, message: '请选择班级~喵', trigger: 'blur' }
    ]
});



</script>

<template>
    <h1>木柜子管理</h1>

    <!-- 搜索栏 表单展示 -->
    <div class="container">
        <!-- {{ searchEmp }} -->
        <el-form :inline="true" :model="searchStudent" class="demo-form-inline">
            <!-- 表单项1 -->
            <el-form-item label="姓名">
                <el-input v-model="searchStudent.name" placeholder="请输入要搜索的姓名~喵" clearable />
            </el-form-item>

            <!-- 表单项2 -->
            <el-form-item label="最高学历">
                <el-select v-model="searchStudent.degree" placeholder="请选择最高学历~喵" clearable>
                    <el-option v-for="searchDegree in searchDegree" :label="searchDegree.label"
                        :value="searchDegree.value" :key="searchDegree.value" />
                </el-select>
            </el-form-item>

            <!-- 表单项3 -->
            <el-form-item label="所属乐队">
                <el-select v-model="searchStudent.clazzId" placeholder="请选择所属乐队~喵" clearable>
                    <el-option v-for="[id,name] in clazzMap" :label="name" :value="id" :key="id" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="info" @click="clear">清空</el-button>
            </el-form-item>
        </el-form>
    </div>

    <!-- 功能按钮 -->
    <div class="container">
        <el-button type="primary" @click="addStudent">+ 新增木柜子</el-button>
        <el-button type="danger" @click="deleteByIds">批量删除</el-button>
    </div>


    <!-- 多选框赋值功能测试 -->
    <!-- {{ selectIds }} -->

    <!-- 数据展示 -->
    <div class="container">
        <el-table :data="studentList" border style="width: 100%" @selection-change="handleSelectionChange">
            <!-- 多选框 -->
            <el-table-column type="selection" :selectable="selectable" width="55" align="center" />

            <el-table-column prop="name" label="姓名" width="80" align="center" />
            <el-table-column prop="no" label="学号" width="100" align="center" />
            <el-table-column prop="clazzId" label="班级" width="160" align="center">
                <template #default="scope">
                    {{ clazzMap.get(scope.row.clazzId) }}
                </template>
            </el-table-column>

            <el-table-column prop="gender" label="性别" width="60" align="center">
                <template #default="scope">
                    <el-tag v-if="scope.row.gender == 1" type="success">男</el-tag>
                    <el-tag v-else type="danger">女</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="phone" label="手机号" width="100" align="center" />

            <el-table-column prop="degree" label="最高学历" width="80" align="center">
                <template #default="scope">
                    <el-tag>{{ degreeMap.get(scope.row.degree) }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="violationCount" label="违纪次数" width="40" align="center" />
            <el-table-column prop="violationScore" label="违纪扣分" width="60" align="center" />
            <el-table-column prop="updateTime" label="最后操作时间" width="200" align="center" />
            <el-table-column label="操作" align="center" width="180">
                <template #default="scope">
                    <div class="mb-4">
                        <el-button key="修改" type="primary" text @click="updateStudent(scope.row.id)"
                            class="el-button-text">
                            修改
                        </el-button>
                        <el-button key="违纪" type="warning" text @click="addViolationScore(scope.row.id)"
                            class="el-button-text">
                            违纪
                        </el-button>
                        <el-button key="删除" type="danger" text @click="deleteStudent(scope.row.id)"
                            class="el-button-text">
                            删除
                        </el-button>
                    </div>
                </template>
            </el-table-column>

        </el-table>
    </div>

    <!-- 分页条 -->
    <div class="container">
        <div class="demo-pagination-block">
            <!-- v-model具有双向绑定的功能，
            只需在handleSizeChange函数和handleCurrentChange函数中，
            执行search函数即可绑定当前值 -->
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                :page-sizes="[5, 10, 20, 30, 50, 75, 100, 200, 500, 1000]" :size="size" :disabled="disabled"
                :background="background" layout="total, sizes, prev, pager, next, jumper" :total="total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </div>

    <!-- 新增/修改员工信息的对话框 -->
    <el-dialog v-model="dialogTableVisible" :title="dialogTitle" width="650" :rules="rules">

        <!-- 员工赋值功能测试 -->
        <!-- {{ employee }} -->
        <!-- 表单项 -->
        <el-form style="max-width: 600px" :model="student" :rules="rules" label-width="auto" ref="studentFormRef">

            <!-- 第一行 -->
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="姓名" prop="name">
                        <el-input placeholder="喵~请输入姓名" v-model="student.name" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="学号" prop="no">
                        <el-input placeholder="喵~请输入学号" v-model="student.no" />
                    </el-form-item>
                </el-col>
            </el-row>


            <!-- 第二行 -->
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="性别" prop="gender">
                        <el-select v-model="student.gender" placeholder="喵~请选择性别">
                            <!-- 动态绑定列表
                                v-for: 指定循环的元素
                                :key: 循环的元素的唯一标识
                                :label: 显示的文本
                                :value: 循环的元素的值
                            -->
                            <el-option v-for="item in genders" :key="item.value" :label="item.name"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="手机号" prop="phone">
                        <el-input placeholder="喵~请输入手机号" v-model="student.phone" />
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 第三行 -->
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="身份证号">
                        <el-input placeholder="喵~请输入身份证号" v-model="student.idCard" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="是否院校">
                        <el-select v-model="student.isCollege" placeholder="喵~请选择喵">
                            <el-option v-for="item in isCollege" :key="item.value" :label="item.name"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 第四行 -->
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="联系地址">
                        <el-input placeholder="喵~请输入联系地址" v-model="student.address" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="最高学历" prop="degree">
                        <el-select v-model="student.degree" placeholder="喵~请选择喵">
                            <el-option v-for="item in searchDegree" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 第五行 -->
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="毕业时间">
                        <el-date-picker v-model="student.graduationDate" type="date" placeholder="喵~请选择毕业时间"
                            :size="default" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="所属班级" prop="clazzId">
                        <el-select v-model="student.clazzId" placeholder="喵~请选择所属班级喵">
                            <el-option v-for="[id, name] in clazzMap" :key="id" :label="name" :value="id" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>



            <!-- 按钮 -->
            <el-row>
                <el-col :span="24" align="right" class="button-group">
                    <el-button type="primary" @click="save" class="button">保存</el-button>
                    <el-button type="info" @click="cancelSave">取消</el-button>
                </el-col>
            </el-row>


        </el-form>
    </el-dialog>

    <!-- 违纪处理对话框 -->
    <el-dialog v-model="dialogViolationVisible" title="请输入违纪扣分" width="800">
        <el-form :model="student">
            <el-form-item label="扣分">
                <el-input v-model="score"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogViolationVisible = false">取消</el-button>
                <el-button type="primary" @click="setViolation()">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>




</template>

<style scoped>
.demo-form-inline .el-input {
    --el-input-width: 220px;
}

.demo-form-inline .el-select {
    --el-select-width: 220px;
}

.demo-pagination-block+.demo-pagination-block {
    margin-top: 10px;
}

.demo-pagination-block .demonstration {
    margin-bottom: 16px;
}

.el-button-text{
    margin: 5px;
    padding: 1px;
}

.container {
    margin: 5px 0px;
}

/* 布局样式 */
.el-row {
    margin-bottom: 5px;
}

.el-row:last-child {
    margin-bottom: 0;
}

.el-col {
    border-radius: 4px;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}

.button-group{
    padding-top: 20px;
}

.button{
    margin-left: 5px;
}

/* el-col {
    margin-left: 10px;
    padding: 5px;
} */

/* 图片上传样式 */
.avatar-uploader .avatar {
    width: 80px;
    height: 80px;
    display: block;
}
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #215fb7;
    background-color: rgba(0, 0, 0, 0.1);
    width: 80px;
    height: 80px;
    text-align: center;
}
</style>
