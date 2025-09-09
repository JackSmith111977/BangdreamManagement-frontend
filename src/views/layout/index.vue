<script setup>
import { Refresh } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

const login = () => {
    router.push('/login');
}

const out = () => {
    ElMessageBox.confirm('退出登录~喵？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
    .then( async () => {
        ElMessage.success('退出成功~喵~');
        // 清除登录信息
        localStorage.removeItem('loginUser');
        // 跳转登录页面
        router.push('/login');
    }).catch(() => {// 点击取消按钮
        ElMessage.info('什么也没发生~喵~');
    })
}

const userUrl = ref();
const userName = ref();
const router = useRouter();
const status = ref();
const statusText = ref('');
const headerText = ref();
const loginStatus = ref();
const logoutStatus = ref();

onMounted(() => {
    // 从本地存储中获取当前登录用户信息
        // JSON.parse(): 将JSON字符串转换成对象,以便后序调用
    const user = JSON.parse(localStorage.getItem('loginUser'));
    if(user){
        // 获取登录用户信息
        userUrl.value = user.image;
        userName.value = user.username;
        status.value = "primary"
        statusText.value = "已登录"
        headerText.value = '欢迎你,'+user.username;
        loginStatus.value = true;
        logoutStatus.value = false;
    }else{
        status.value = "danger"
        statusText.value = "未登录"
        headerText.value = '';
        loginStatus.value = false;
        logoutStatus.value = true;
    }

    
})

const refresh = () => {
    window.location.reload();
}



</script>

<template>
    <!-- Container 布局容器 -->
    <el-container>
        <el-header>
            <!-- Header区域 -->
            <!-- 页钉，固定在顶部 -->
            <el-affix :offset="0">
                <!-- 页头图标 -->
                <el-page-header :icon="Refresh" title="刷新" class="header" @click="refresh">

                    <!-- 页头内容 -->
                    <template #content>
                        <div class="flex items-center">

                            <!-- 头像显示 -->
                            <el-avatar :size="32" class="mr-3" :src="userUrl" />

                            <!-- 主标题 -->
                            <span class="text-large font-600 mr-3"> Bang Dream! </span>

                            <!-- 副标题 -->
                            <span class="text-sm mr-2" style="color: var(--el-text-color-regular)">
                                木柜子乐队管理系统
                            </span>

                            <!-- 状态标签 -->
                            <el-tag :type="status">{{ statusText }}</el-tag>
                        </div>
                    </template>

                    <!-- 页头额外内容 -->
                    <template #extra>

                        <div class="flex items-center">

                            <!-- 包含内容 -->
                            <el-text class="mx-1" type="primary" id="headerText">{{ headerText }}</el-text>
                            <el-button @click="login" :disabled="loginStatus">登录</el-button>
                            <el-button type="primary" class="ml-2" @click.stop="out"
                                :disabled="logoutStatus">登出</el-button>

                        </div>
                    </template>

                </el-page-header>
            </el-affix>

        </el-header>


        <el-container>

            <el-affix :offset="60">
                <el-aside width="200px">
                    <!-- 侧边栏 -->
                    <el-scrollbar>
                        <!-- 主菜单 -->
                        <!-- :default-openeds="['1', '3']" 即默认打开index为1和3的菜单 -->
                        <!-- router=true:开启vue-router ,随后子菜单中的index属性即可设置跳转链接-->
                        <el-menu router="true">

                            <!-- 首页菜单 -->
                            <!-- <router-link to="/index"> -->
                            <el-menu-item index="/index">
                                <el-icon>
                                    <HomeFilled />
                                </el-icon>首页
                            </el-menu-item>
                            <!-- </router-link> -->


                            <!-- 子菜单1 -->
                            <el-sub-menu index="1">

                                <!-- 子菜单显示内容 -->
                                <template #title>
                                    <el-icon>
                                        <Location />
                                    </el-icon>乐队成员管理
                                </template>

                                <!-- 子菜单分组1 -->
                                <!-- <el-menu-item-group> -->
                                <!-- 分组标题 -->
                                <!-- <template #title>Group 1</template> -->

                                <!-- 子菜单项 -->
                                <el-menu-item index="clazz">
                                    <el-icon>
                                        <Headset />
                                    </el-icon>乐队管理
                                </el-menu-item>
                                <el-menu-item index="student"><el-icon>
                                        <Female />
                                    </el-icon>木柜子管理</el-menu-item>
                                <!-- </el-menu-item-group> -->

                                <!-- 子菜单分组2 -->
                                <!-- <el-menu-item-group title="Group 2"> -->

                                <!-- 子菜单项 -->
                                <!-- <el-menu-item index="1-3">Option 3</el-menu-item> -->
                                <!-- </el-menu-item-group> -->

                                <!-- 子菜单的子菜单 -->
                                <!-- <el-sub-menu index="1-4"> -->
                                <!-- <template #title>Option4</template> -->

                                <!-- 子菜单的子菜单项 -->
                                <!-- <el-menu-item index="1-4-1">Option 4-1</el-menu-item> -->
                                <!-- </el-sub-menu> -->
                            </el-sub-menu>

                            <!-- 子菜单2 -->
                            <el-sub-menu index="2">
                                <template #title>
                                    <el-icon>
                                        <Setting />
                                    </el-icon>系统信息管理
                                </template>

                                <el-menu-item index="dept">
                                    <el-icon>
                                        <DataLine />
                                    </el-icon>学院管理
                                </el-menu-item>

                                <el-menu-item index="emp">
                                    <el-icon>
                                        <User />
                                    </el-icon>员工管理
                                </el-menu-item>

                            </el-sub-menu>

                            <!-- 子菜单3 -->
                            <el-sub-menu index="/report">
                                <template #title>
                                    <el-icon>
                                        <DataAnalysis />
                                    </el-icon>统计信息管理
                                </template>

                                <el-menu-item index="/empReport">
                                    <el-icon>
                                        <Histogram />
                                    </el-icon>员工信息统计
                                </el-menu-item>

                                <el-menu-item index="/stuReport">
                                    <el-icon>
                                        <Histogram />
                                    </el-icon>木柜子信息统计
                                </el-menu-item>

                                <el-menu-item index="/log">
                                    <el-icon>
                                        <Memo />
                                    </el-icon>日志信息统计
                                </el-menu-item>

                            </el-sub-menu>

                        </el-menu>
                    </el-scrollbar>
                </el-aside>
            </el-affix>

            <el-main>
                <!-- 主体区域 -->
                <router-view>

                </router-view>
            </el-main>

        </el-container>

    </el-container>
    <el-backtop :right="100" :bottom="100" />

</template>

<style scoped>
    /* 页头样式 */
    .header {
        position: relative;
        border-bottom: 1px solid var(--border-color);
        height: var(--header-height);
        padding: 0 12px 10px 24px;
        background-image: radial-gradient(transparent 1px, var(--bg-color) 1px);
        background-size: 4px 4px;
        backdrop-filter: saturate(50%) blur(4px);
        -webkit-backdrop-filter: saturate(50%) blur(4px);
        top: 0;
        width: 100%;
    }

    #headerText{
        position: relative;
        top: 10px;
    }
</style>
