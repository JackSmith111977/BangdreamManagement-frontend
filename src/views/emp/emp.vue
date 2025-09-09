<script setup>
import { ref, watch, onMounted } from "vue";
import { queryPageApi, addEmpApi, queryEmpByIdApi, updateEmpApi, deleteEmpByIdApi } from "@/api/emp";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { addApi, queryAllApi as queryAllDeptApi } from "@/api/dept";

// 数据结构
    // 搜索表单对象
    const searchEmp = ref({
        name: '',
        gender: '',
        date: [],
        begin: '',
        end: '',
    });

    // 员工列表
    const empList = ref([
        {
            name: '',
            gender: '',
            image: '',
            deptName: '',
            job: '',
            entryDate: '',
            updateTime: '',
        },
    ])

    // 分页条参数
    const currentPage = ref(1);// 当前页码
    const pageSize = ref(5);// 每页条数
    const size = ref('default');// 尺寸
    const background = ref(false);// 背景色
    const disabled = ref(false);// 禁用
    const total = ref(0);

    // 对话框参数
    const dialogTableVisible = ref(false);
    const dialogTitle = ref('新增员工');
    const employee = ref({
        username: '',
        name: '',
        gender: '',
        phone: '',
        job: '',
        salary: '',
        deptId: '',
        entryDate: '',
        image: '',
        exprList: []
    })
        // 图片上传参数
        const imageUrl = ref('');
        // 工作经历参数
        const workTime = ref('');

    // 元数据
        // 职位列表数据
        const jobs = ref([
            {name: '主唱',value: 1,},
            {name: '吉他手',value: 2,},
            {name: '贝斯手',value: 3,},
            {name: '键盘',value: 4,},
            {name: '鼓手',value: 5,},
            {name: 'DJ',value: 6,},
            {name: '小提琴',value: 7,}
        ]);

        // 性别列表数据
        const genders = ref([
            {name: '男',value: 1,},
            {name: '女',value: 2,},
        ]);

        // 学院列表数据，需查询学院数据返回
        const depts = ref([]);

    // 表单引用，用于校验表单
    const empFormRef = ref();

    // 记录勾选的员工id
    const selectIds = ref([]);

    // token
    const token = ref();


// 函数
    // 查询员工列表
    const search = async () => {
        const result = await queryPageApi(searchEmp.value.name, 
                                        searchEmp.value.gender, 
                                        searchEmp.value.begin, 
                                        searchEmp.value.end,
                                        currentPage.value,
                                        pageSize.value);
        if(result.code == 1){
            empList.value = result.data.rows;
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

    // 获取token
    const getToken = () => { 
        const loginUser = JSON.parse(localStorage.getItem('loginUser'));
        if(loginUser){
            token.value = loginUser.token;
        }
    }


    // 钩子函数查询员工列表,部门列表
    onMounted(() => {
        search();
        searchAllDept();
        getToken();
    })

    // 清空搜索栏
    const clear = () => {
        searchEmp.value = {};
    }

    /*
    watch侦听器 
        watch(
            响应式数据源(变量，对象，对象的部分属性[用箭头函数返回值表示]), 
            回调函数(新值，旧值)=>{}, 
            {配置项：
                deep        是否深度侦听(浅度侦听：对象内部属性值改变，不会触发回调函数)
                immediate   是否在侦听创建时立即触发回调函数}(可不写)
        )
    */
    // 使用侦听器监听date变化，将date值赋给begin和end
    watch(() => searchEmp.value.date, (newVal, oldVal) => {
        if (newVal.length == 2) {
            searchEmp.value.begin = newVal[0];
            searchEmp.value.end = newVal[1];
        } else {
            searchEmp.value.begin = '';
            searchEmp.value.end = '';
        }
    })

    // 侦听employee.exprList
    watch(() => employee.value.exprList, (newVal, oldVal) =>{
        // 有列表exprList且列表长度>0
        if (employee.value.exprList && employee.value.exprList.length > 0){
            // forEach:遍历列表
            employee.value.exprList.forEach((item) =>{
                item.begin = item.exprDate[0];
                item.end = item.exprDate[1];
            })
        }else{
            
        }
    }, {deep: true})

    // 每页展示数改变时触发
    const handleSizeChange = (val) => {
        search();
    }

    // 当前页改变时触发
    const handleCurrentChange = (val) => {
        search();
    }

    // 新增员工
    const addEmployee = () => {
        // 打开对话框,更改标题
        dialogTableVisible.value = true;
        dialogTitle.value = '新增员工';
        // 表单数据清空
        employee.value = {
            username: '',
            name: '',
            gender: '',
            phone: '',
            job: '',
            salary: '',
            deptId: '',
            entryDate: '',
            image: '',
            exprList: []
        };
        // 校验信息清空
        if(empFormRef.value){
            empFormRef.value.resetFields();
        }
    }

    // 图片上传处理
        // 上传成功后触发
        const handleAvatarSuccess = (response,uploadFile) => {
            // imageUrl.value = URL.createObjectURL(uploadFile.raw);
            employee.value.image = response.data;
            console.log(employee.value.image);
        }

        // 文件上传之前触发
        const beforeAvatarUpload = (rawFile) => {
            // 判断上传文件格式
            if (rawFile.type !== 'image/jpeg') {
                ElMessage.error('不是JPG格式~喵，请上传JPG格式的图片~喵')
                return false
            }
            // 校验上传文件大小
            else if (rawFile.size / 1024 / 1024 > 10) {
                ElMessage.error('太大了~喵，人家塞不下了~喵')
                return false
            }
            return true
        }

    // 添加工作经历
    const addExprItem = () => {
        // push: 添加元素
        employee.value.exprList.push({company: '', job: '', begin: '', end: '', exprDate: []});
    }

    // 删除工作经历
    const deleteExprItem = (index) => {
        // splice(index, howmany, item1, item2, ...): 从指定位置index开始，删除howmany个元素，并添加新的item1, item2, ...
        employee.value.exprList.splice(index, 1);
    }

    // 保存 添加 or 修改 员工
    const save = async () => {
            // 表单校验
            if(!empFormRef.value)return;
            empFormRef.value.validate(async (valid) => {
                if(valid){ // 通过校验
                    // 判断是新增员工还是修改员工
                    let result;
                    if(employee.value.id){
                        result = await updateEmpApi(employee.value);
                    }else{
                        result = await addEmpApi(employee.value);
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
    const updateEmployee = async (id) => {
        // 显示对话框
        dialogTableVisible.value = true;
        dialogTitle.value = '修改员工信息';

        // 查询回显
        const result = await queryEmpByIdApi(id);
        if (result.code == 1) { 
            employee.value = result.data;

            // 处理工作经历
            let exprList = employee.value.exprList;
            if(exprList && exprList.length > 0){
                exprList.forEach((item) => {
                    item.exprDate = [item.begin, item.end];
                })
            }

        }

    }

    // 删除单个员工
    const deleteEmployee = async (id) => {
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
            const result = await deleteEmpByIdApi(id);
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
        // 多选框处理 --selection: 选中的数据数组
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
                const result = await deleteEmpByIdApi(selectIds.value);
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

// 表单校验规则
const rules = ref({
    username: [
            //trigger: 校验触发方式
            { required: true, message: '请输入用户名~喵', trigger: 'blur' },// 必要性规则
            { min: 2, max: 20, message: '用户名长度必须在2-20之间~喵', trigger: 'blur' }// 长度规则
    ],
    name: [
            { required: true, message: '请输入员工姓名~喵', trigger: 'blur' },
            { min: 2, max: 20, message: '员工姓名长度必须在2-20之间~喵', trigger: 'blur' }
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
    ]
});



</script>

<template>
    <h1>员工管理</h1>

    <!-- 搜索栏 表单展示 -->
    <div class="container">
        <!-- {{ searchEmp }} -->
        <el-form :inline="true" :model="searchEmp" class="demo-form-inline">
            <!-- 表单项1 -->
            <el-form-item label="姓名">
                <el-input v-model="searchEmp.name" placeholder="请输入要搜索的姓名~喵" clearable />
            </el-form-item>

            <!-- 表单项2 -->
            <el-form-item label="性别">
                <el-select v-model="searchEmp.gender" placeholder="请选择性别~喵" clearable>
                    <el-option label="男" value="1" />
                    <el-option label="女" value="2" />
                </el-select>
            </el-form-item>

            <!-- 表单项3 -->
            <el-form-item label="入职时间">
                <el-date-picker v-model="searchEmp.date" type="daterange" range-separator="到" start-placeholder="开始日期"
                    end-placeholder="结束日期" value-format="YYYY-MM-DD" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="info" @click="clear">清空</el-button>
            </el-form-item>
        </el-form>
    </div>

    <!-- 功能按钮 -->
    <div class="container">
        <el-button type="primary" @click="addEmployee">+ 新增员工</el-button>
        <el-button type="danger" @click="deleteByIds">批量删除</el-button>
    </div>


    <!-- 多选框赋值功能测试 -->
    <!-- {{ selectIds }} -->

    <!-- 数据展示 -->
    <div class="container">
        <el-table :data="empList" border style="width: 100%" @selection-change="handleSelectionChange">
            <!-- 多选框 -->
            <el-table-column type="selection" :selectable="selectable" width="55" align="center" />

            <el-table-column prop="name" label="姓名" width="120" align="center" />

            <el-table-column prop="gender" label="性别" width="80" align="center">
                <template #default="scope">
                    <el-tag v-if="scope.row.gender == 1" type="success">男</el-tag>
                    <el-tag v-else type="danger">女</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="image" label="头像" width="100" align="center">
                <template #default="scope">
                    <img :src="scope.row.image" height="40px">
                </template>
            </el-table-column>

            <el-table-column prop="deptName" label="所属部门" width="100" align="center" />

            <el-table-column prop="job" label="职位" width="80" align="center">
                <template #default="scope">
                    <span v-if="scope.row.job == 1">主唱</span>
                    <span v-else-if="scope.row.job == 2">吉他手</span>
                    <span v-else-if="scope.row.job == 3">贝斯手</span>
                    <span v-else-if="scope.row.job == 4">键盘</span>
                    <span v-else-if="scope.row.job == 5">鼓手</span>
                    <span v-else-if="scope.row.job == 6">DJ</span>
                    <span v-else-if="scope.row.job == 7">小提琴</span>
                    <span v-else>其他</span>
                </template>
            </el-table-column>

            <el-table-column prop="entryDate" label="入职时间" width="220" align="center" />
            <el-table-column prop="updateTime" label="最后操作时间" width="200" align="center" />
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <div class="mb-4">
                        <el-button key="修改" type="primary" text @click="updateEmployee(scope.row.id)">
                            修改
                        </el-button>
                        <el-button key="删除" type="danger" text @click="deleteEmployee(scope.row.id)">
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
        <el-form style="max-width: 600px" :model="employee" :rules="rules" label-width="auto" ref="empFormRef">

            <!-- 第一行 -->
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="用户名" prop="username">
                        <el-input placeholder="喵~请输入用户名" v-model="employee.username" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="姓名" prop="name">
                        <el-input placeholder="喵~请输入姓名" v-model="employee.name" />
                    </el-form-item>
                </el-col>
            </el-row>


            <!-- 第二行 -->
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="性别" prop="gender">
                        <el-select v-model="employee.gender" placeholder="喵~请选择性别">
                            <!-- 动态绑定列表
                                v-for: 指定循环的元素
                                :key: 循环的元素的唯一标识
                                :label: 显示的文本
                                :value: 循环的元素的值
                            -->
                            <el-option v-for="item in genders" :key="item.value" :label="item.name" :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="手机号" prop="phone">
                        <el-input placeholder="喵~请输入手机号" v-model="employee.phone" />
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 第三行 -->
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="职位">
                        <el-select v-model="employee.job" placeholder="喵~请选择职位">
                            <!-- 动态绑定列表 -->
                            <el-option v-for="item in jobs" :key="item.value" :label="item.name" :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="薪资">
                        <el-input placeholder="喵~请输入薪资" v-model="employee.salary" />
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 第四行 -->
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="所属部门">
                        <el-select v-model="employee.deptId" placeholder="喵~请选择所属部门">
                            <!-- 动态绑定列表 -->
                            <el-option v-for="item in depts" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="入职日期">
                        <el-date-picker v-model="employee.entryDate" type="date" placeholder="喵~请选择入职日期"
                            value-format="YYYY-MM-DD" />
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 头像上传 -->
            <el-row :gutter="20">
                <el-col :span="2">
                    <tag>头像</tag>
                </el-col>
                <el-col :span="6" align="center">
                    <!-- 头像上传组件
                        action: 调用的服务器接口地址
                        show-file-list: 是否显示文件列表
                        :on-success: 上传成功后的回调函数
                        :before-upload: 上传前的回调函数
                        :headers: 设置请求头
                    -->
                    <el-upload class="avatar-uploader"
                        action="/api/upload" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
                        :headers="{'token' : token}">
                        <img v-if="employee.image" :src="employee.image" class="avatar" fit="cover"/>
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-col>
                <el-col :span="16">
                    说明
                </el-col>
            </el-row>

            <!-- 工作经历添加按钮 -->
            <el-row>
                <el-col :span="24" align="left">
                    <el-form-item label="工作经历">
                        <el-button type="success" @click="addExprItem">+ 添加工作经历</el-button>
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 工作经历表单 -->
            <!-- item: 数组中的元素，index: 数组中的索引 -->
            <el-row :gutter="3" v-for="(item, index) in employee.exprList">
                <el-col :span="10">
                    <el-form-item size="small" label="时间" label-width="40px">
                        <el-date-picker v-model="item.exprDate" type="daterange" range-separator="到"
                            start-placeholder="开始时间" end-placeholder="结束时间" size="small" 
                            format="YYYY-MM-DD" value-format="YYYY-MM-DD"/>
                    </el-form-item>
                </el-col>

                <el-col :span="7">
                    <el-form-item size="small" label="公司" label-width="40px">
                        <el-input placeholder="喵~请输入公司名称" width="100%" v-model="item.company"/>
                    </el-form-item>
                </el-col>

                <el-col :span="6">
                    <el-form-item size="small" label="职位" label-width="40px">
                        <el-input placeholder="喵~请输入职位" width="100%" v-model="item.job"/>
                    </el-form-item>
                </el-col>

                <el-col :span="1">
                    <el-button type="danger" @click="deleteExprItem(index)" size="small">删除</el-button>
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
    margin-left: 10px;
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
