<script setup>
import { imageProps } from 'element-plus';

const fits = [
    'fill',
    'contain',
    'cover',
    'none',
    'scale-down',
]
const url ='F:\\学习资料\\编程\\Vue\\vue-tlias-management\\src\\assets\\115855899_p0.png'
</script>

<template>
    <!-- <div class="demo-image">
        <div v-for="fit in fits" :key="fit" class="block">
            <span class="demonstration">{{ fit }}</span>
            <el-image style="width: 100px; height: 100px" :src="url" :fit="fit" />
        </div>
    </div> -->
    <div id="bg">
        <div class="container">
            <h1>欢迎来到木柜子管理系统~喵</h1>
        </div>
    </div>


</template>

<style scoped>
.container {
    margin: 10px 0px;
}

.demo-image .block {
    padding: 30px 0;
    text-align: center;
    border-right: solid 1px var(--el-border-color);
    display: inline-block;
    width: 20%;
    box-sizing: border-box;
    vertical-align: top;
}

.demo-image .block:last-child {
    border-right: none;
}

.demo-image .demonstration {
    display: block;
    color: var(--el-text-color-secondary);
    font-size: 14px;
    margin-bottom: 20px;
}

#bg{
    height: 100vh;
    width: 100vw;
    /* 使用 flex 布局使子元素居中 */
    display: flex;
    justify-content: center;
    align-items: center;

    /* 修复背景图片语法 */
    background-image:
        linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 1)),
        url("https://kei-web.oss-cn-beijing.aliyuncs.com/2025/07/9a178da3-88ae-4a48-9b87-0cc33f9bf61d.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    padding: 0;
    margin: 0;

}

h1{
    color: #000000;
}
</style>
