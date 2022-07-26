import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import About from './views/About.vue'

Vue.use(Router)

export default new Router({
    history: true,
    routes: [
        {
            path: '/',
            name: 'Login',
            component: Login
        },
        {
            path: '/about',
            name: 'About',
            component: About
        }
    ]
})
