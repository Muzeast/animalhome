import axios from 'axios' // 导入axios
import { Notice } from 'view-design' // 使用 IVIEW Notice 做消息提醒

Notice.config({
  top: 60,
  duration: 4
})
// 创建新的axios实例
const service = axios.create({
  baseURL: '', // 公共接口
  timeout: 5 * 1000 // 超时时间 单位是ms
})

// 请求拦截
service.interceptors.request.use(config => {
  //发请求前做的一些处理，数据转化，配置请求头，设置token,设置loading等，根据需求去添加
   config.headers = {
     //'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
     'Content-Type':'application/json;charset=UTF-8',
   }
   config.data = JSON.stringify(config.data); //数据转化,也可以使用qs转换
  return config;
}, error => {
  Promise.reject(error)
})

// 响应拦截
service.interceptors.response.use(response => {
  if (response.status === 200) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(response);
  }
}, error => {
  if (error.response.status) {
    switch (error.response.status) {
      case 400:
        Notice.error({
          title: '400',
          desc: '请求参数错误!'
        })
        break
      case 404:
        Notice.error({
          title: '404',
          desc: '请求资源不存在!'
        })
        break
      default:
        Notice.error({
          title: error.response.status + "请求失败"
        })
    }
    return Promise.reject(error.response);
  }
})

// 导出文件
export default service