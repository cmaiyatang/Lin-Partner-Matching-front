// Set config defaults when creating the instance
//自定义实例默认值
import axios from "axios";

// const isDev = process.env.NODE_ENV === 'development';

const myAxios = axios.create({
    baseURL: 'http://localhost:8080/api',
});

myAxios.defaults.withCredentials = true;//向后端发送请求携带cookie

//拦截器
// 添加请求拦截器
myAxios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    console.log("请求发送了",config)
    // if(config.method === 'get'){
    //     //如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
    //     config.paramsSerializer = function(params) {
    //         return qs.stringify(params, {arrayFormat: 'repeat'})
    //     }
    // }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
myAxios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    console.log("我收到你的响应啦",response)
    //未登录则跳转到登录页
    if(response?.data?.code === 40100){
        const redirectUrl = window.location.href;
        window.location.href = `/user/login?redirect=${redirectUrl}`;
    }
    return response.data;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default myAxios;
