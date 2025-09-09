<script setup>
import { ref } from 'vue'
import { loginApi } from '@/api/login';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const user = ref({
    username: '',
    password: ''

});

// 获取路由实例
const router = useRouter();


// 登录
const login = async () => {
    const result = await loginApi(user.value);
    if(result.code == 1){// 登录成功
        ElMessage.success('恭喜你，登录成功~喵');
        // 存储用户信息 
            // localStorage: 浏览器端存储数据，只能存储字符串，数据会丢失
            // JSON.stringify(): 将对象转换成字符串
        localStorage.setItem('loginUser', JSON.stringify(result.data));
        // 跳转到首页
        router.push('/');
    }else{// 登录失败
        ElMessage.error("出错了~喵" + result.msg);
    }
}

// 重置
const reset = () => {
    user.value = { username: '', password: '' };
}


</script>

<template>
    <div id="background">
        <div id="login">
            <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" status-icon :rules="rules"
                label-width="auto" class="demo-ruleForm">

                <el-form-item>
                    <!-- 主标题 -->
                    <span class="text-large font-600 mr-3"> Bang Dream! </span>
                    <!-- 副标题 -->
                    <span class="text-sm mr-2" style="color: var(--el-text-color-regular)">
                        木柜子乐队管理系统
                    </span>
                </el-form-item>

                <el-form-item label="用户名" prop="pass">
                    <el-input v-model="user.username" placeholder="喵~请输入用户名" />
                </el-form-item>
                <el-form-item label="密码" prop="checkPass">
                    <el-input v-model="user.password" type="password" placeholder="喵~请输入密码" />
                </el-form-item>
                <el-row>
                    <el-col :span="24" align="right" class="button-group">
                        <el-button type="primary" @click="login">
                            登录
                        </el-button>
                        <el-button @click="reset(user)">
                            重置
                        </el-button>
                    </el-col>
                </el-row>


            </el-form>
        </div>
    </div>


</template>

<style scoped>
#login {
    margin: 0 auto;
    padding: 30px;
    width: 400px;
    /* 移除 transform，改用 flex 布局居中 */
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.9));
    background-position: top center;
    border-radius: 8px;
    /* 添加 z-index 确保在背景上方 */
    z-index: 10;
}

#background {
    height: 100vh;
    width: 100vw;
    /* 使用 flex 布局使子元素居中 */
    display: flex;
    justify-content: center;
    align-items: center;

    /* 修复背景图片语法 */
    background-image:
        linear-gradient(135deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5)),
        url("https://kei-web.oss-cn-beijing.aliyuncs.com/2025/07/9a178da3-88ae-4a48-9b87-0cc33f9bf61d.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    padding: 0;
    margin: 0;
}
</style>

<style>
/* 全局样式重置 */
html,
body {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
}

/* #app {
    height: 100%;
    width: 100%;
}

* {
    box-sizing: border-box;
}

body {
    overflow: hidden;
} */
</style>