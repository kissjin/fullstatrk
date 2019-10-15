import axios from 'axios';
import { Loading, Message } from 'element-ui';
import router from './router'
let loading;

function startLoading() {
    loading = Loading.service({
        lock: true,
        text: '拼命加载中...',
        backgroud: 'rgba(0,0,0,.3)'
    });
}

function endloading() {
    loading.close()
}
//请求拦截
axios.interceptors.request.use(config => {
        startLoading();
        if (localStorage.eleToken) {
            config.headers.Authorization = localStorage.eleToken;
        }
        return config;
    }, err => {
        return Promise.reject(err)
    })
    //相应拦截
axios.interceptors.response.use(response => {
    //结束加载动画
    endloading();

    return response;
}, err => {
    endloading();
    Message.error(err.response.data)
        //获取错误码 
    const { status } = err.response;
    if (status == 401) {
        Message.error('token失效，请重新登陆');
        localStorage.removeItem('eleToken');
        router.push('/login')
            //跳转到登陆界面
    }
    return Promise.reject(err)

})
export default axios;