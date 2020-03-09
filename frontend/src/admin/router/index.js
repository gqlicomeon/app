import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home'
import Article from '../views/article'
import Personal from '../views/personal'
import Edit from '../views/edit'
import Login from '../views/login'
Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    name:'index',
    redirect:"login"
  },
  {
    path:'/login',
    name:'login',
    component:Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    children: [
      {path:"/home",name:"subindex",redirect:"personal"},
      {path:'personal',name:"personal",component:Personal},
      {path:'article',name:'article',component:Article},
      { path: 'edit', name:"edit",component: Edit}
    ]
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
