import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import About from '../views/About'
import Archives from '../views/Archives'
import Detail from '../views/Detail'
import Tags from '../views/Tags'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path:'/tags/:tag',
    name:'tags',
    component:Tags
  },
  {
    path:'/archives',
    name:'archives',
    component:Archives
  },
  {
    path:'/detail/:timestamp',
    name:'detail',
    component:Detail
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
