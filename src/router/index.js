import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/pages/Home'

Vue.use(VueRouter)


export function createRouter() {
    const router = new VueRouter({
        mode: 'history',
        routes: [
            {
                path: '/',
                name: 'home',
                component: Home
            },
            {
                path: '/about',
                name: 'about',
                component:() => import('@/pages/About')
            },
            {
                path:'*',
                name: '404page',
                component:()=> import('@/pages/404')
            }
        ]
    })
    return router
}