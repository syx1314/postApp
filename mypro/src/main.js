// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {post, fetch, patch, put} from './axios/http'
Vue.config.productionTip = false
// 定义全局变量
Vue.prototype.$post = post
Vue.prototype.$fetch = fetch
Vue.prototype.$patch = patch
Vue.prototype.$put = put
window.onload = () => {
  // 手机端的适配
  document.addEventListener('DOMContentLoaded', function () {
    document.getElementsByTagName('html')[0].style.fontSize = (document.documentElement.clientWidth / 750) * 100 + 'px'
  })

  window.onresize = function () {
    document.getElementsByTagName('html')[0].style.fontSize = (document.documentElement.clientWidth / 750) * 100 + 'px'
  }
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
