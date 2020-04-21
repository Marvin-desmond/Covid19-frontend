import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Cases from '@/components/Cases'
import NewCases from '@/components/NewCases'
import Map from '@/views/Map'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path:'/cases',
    name:'Cases',
    component:Cases
  },
  {
   path:'/map',
   name:'Map',
   component:Map
  },
  {
    path:'/cases/new',
    name:'NewCases',
    component:NewCases
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
