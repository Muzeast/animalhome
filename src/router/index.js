import Vue from 'vue'
import Router from 'vue-router'
import {routes} from './router'
import store from '@/store'
import {getToken, matchPathName} from '@/libs/utils'

Vue.use(Router)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

let router = new Router({
  routes: routes
})

router.beforeEach((to, from, next) => {
  //如果未指定跳转路径，则跳转至首页
  if (to.name == null) {
    next({
      name: 'home'
    })
    return false
  }

  //判断用户是否登录
  const token = getToken()
  if (!token && to.name != 'login' && to.name != 'register') {
    next({
      name: 'login'
    })
  } else if (token && to.name == 'login') {
    next({
      name: 'home'
    })
  } else {
    next()
  }
})

router.afterEach(to => {
  let fullPath = to.fullPath
  fullPath = fullPath.substring(1)
  let arr = fullPath.split('/')
  let fullPathName = matchPathName(arr, routes)
  store.commit('updateBreadList', {
    breadList: fullPathName
  })
  let title = fullPathName[fullPathName.length - 1]
  window.document.title = title
})

export default router
