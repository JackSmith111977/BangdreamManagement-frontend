import axios from "axios";
import { ElMessage } from "element-plus";
import router from "../router";


// 用于处理请求的拦截器 代理服务器server.proxy-request-api结构用于处理前后端交互

// 创建axios实例对象
const request = axios.create({
    
    // 请求的基准路径
    baseURL: '/api',

    // 请求超时时间
    timeout: 600000

});

// axios的请求 request拦截器 -在请求头中添加token
request.interceptors.request.use(
    (config) => {// 成功回调
        const loginUser =JSON.parse(localStorage.getItem('loginUser'));
        if(loginUser){
            config.headers.token = loginUser.token;
        }
        return config;
    },
    (error) => {// 失败回调
        return Promise.reject(error);
    }
)



// axios的响应 response拦截器
request.interceptors.response.use(
    (response) => {// 成功回调
        return response.data;
    },
    (error) => {// 失败回调
        // 处理未登录异常
        if(error.response.status === 401){
            // 提示未登录
            ElMessage.error('请先登录~喵');
            // 跳转到登录页面
            router.push('/login');
        }
        return Promise.reject(error);
    }
);

// 导出request 
export default request;