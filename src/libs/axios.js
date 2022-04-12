import axios from 'axios' //
import {setToken, getToken} from '@/libs/utils'
import { Notice } from 'view-design' //

Notice.config({
  top: 60,
  duration: 4
})

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      // toast:false,
      headers: {
        //
      }
    }
    return config
  }
  interceptors(instance, options) {
    //请求拦截
    instance.interceptors.request.use(
      config => {
        // 请求头中添加token
        config.headers = {
          'tokenauthorization': 'Bearer' + getToken(),
          'Content-Type': 'application/json;charset=UTF-8'
        }
        config.data = JSON.stringify(config.data) //数据转化,也可以使用qs转换
		//config.params = JSON.stringify(config.params)
        return config
      },
      error => {
        // 请求错误提醒
        Notice.error({ title: '网络请求失败，请稍后再试' })
        return Promise.reject(error)
      }
    )
    //响应拦截
    instance.interceptors.response.use(res => {
        if (res.status === 200) {
          return Promise.resolve(res);
        } else {
          return Promise.reject(res);
        }
      }, error => {
        if (error.message.indexOf('timeout') > -1) {
          Notice.error({ title: '网络请求超时' })
          return Promise.reject(error)
        }

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
      }
    )
  }
  //创建请求
  request (options) {
    if (options.url) {
      const instance = axios.create({
        timeout: 10 * 1000
      })
      options = Object.assign(this.getInsideConfig(), options)
      this.interceptors(instance, options)
      return instance(options)
    } else {
      // 请求错误提醒
      Notice.error({
        title: '请求参数不合法，未设置请求地址！！'
      })
    }
  }
}

export default HttpRequest