import axios from "axios";
import router from "../router";
import { ElMessage } from "element-plus";
import { UserStore } from "../store/user/user";

// 创建一个 axios 实例
const request = axios.create({
    // 请求地址前缀
    baseURL: "http://127.0.0.1:8689/visix/dynamic/",
    // baseURL: "https://192.168.5.172:4999/visix/",
    // 超时时间
    timeout: 30000,
});

// 请求拦截器
request.interceptors.request.use(
    async (config) => {
        const userStore = UserStore();
        const token = await userStore.GETTOKEN();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        ElMessage.error(error.response.data.msg);
        if (error.response.status === 401) {
            router.push("/login");
        }
        return Promise.reject(error);
    }
);

export default request;
