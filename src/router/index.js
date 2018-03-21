import Vue from 'vue'
import Router from 'vue-router'
import Upload from '@/components/Upload'
import Home from '@/components/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Upload',
      component: Upload
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    }
  ]
})
