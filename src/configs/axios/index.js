import axios from 'axios'
import qs from 'qs'
import {Message, MessageBox} from 'element-ui'
import router from '@/configs/router'

axios.defaults.baseURL = process.env.NODE_ENV === 'development' ?
    "http://192.168.199.63:8090/" :
    "http://47.96.175.198:8090/";

axios.defaults.timeout = 10000;
axios.defaults.crossDomain = true;
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Authorization'] = '';

// 请求拦截
axios.interceptors.request.use(
    config => {
        config.headers.token = localStorage.getItem('token');

        if (config.headers['Content-Type'] !== 'multipart/form-data') {
            if (['post', 'put'].includes(config.method))
                config.data = qs.stringify(config.data, {indices: false});
            if (['get', 'delete'].includes(config.method))
                config.paramsSerializer = params => qs.stringify(params, {indices: false});
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截
axios.interceptors.response.use(
    async res => {
        let result = res.data;
        if (res.config.responseType === 'blob') { // 是一个下载文件的请求
            try {
                await readBlob(res); // 等待文件解析
                return Promise.resolve(); // 没有报错，下载成功，直接返回
            } catch (e) {
                result = e; // 有报错，下载失败，覆盖R，继续进行判断
            }
        }
        let code = +result.code;
        let msg = result.msg;
        let data = result.data;
        let token = result.token;
        if (token)
            localStorage.setItem('token', token);

        switch (code) {
            case 1: // 成功
                if (['post', 'put', 'delete'].includes(res.config.method))
                    Message.success({showClose: true, message: msg});
                return Promise.resolve(data);
            case 0: // 失败
                Message.error({showClose: true, message: msg});
                return Promise.reject();
            case 1000: // 重新登录
                MessageBox.alert(msg).then(() => router.push({name: 'login'}));
                return Promise.reject();
            default:
                Message.error({showClose: true, message: '不支持的状态码code=' + code});
                return Promise.reject();
        }
    },
    error => {
        Message.error({showClose: true, message: error.message});
        return Promise.reject(error);
    }
);

const readBlob = (res) => {
    return new Promise((resolve, reject) => {
        let data = res.data;
        let reader = new FileReader();
        reader.onload = e => {
            if (isJSONObject(e.target.result)) { // 是JSON说明有报错信息
                reject(JSON.parse(String(e.target.result)));
            } else { // 不是JSON说明正常下载
                let filename = res.headers['content-disposition'].split('filename=')[1];
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(new Blob([data]));
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                resolve();
            }
        }
        reader.readAsText(data);
    });
}

const isJSONObject = (obj) => {
    if (Object.prototype.toString.call(obj) === '[object Object]')
        return true;
    try {
        obj = JSON.parse(obj);
        return Object.prototype.toString.call(obj) === '[object Object]';
    } catch (e) {
        return false;
    }
}

export default axios;