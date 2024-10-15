import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
<<<<<<< HEAD
import Contacto from '../views/Contacto.vue'
=======
import LoginView from '@/views/LoginView.vue'
>>>>>>> 08e0e1d3f43528f819f388fe2fec0af27dd3d8a1

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
<<<<<<< HEAD
      path: '/contacto',
      name: 'contacto',
      component: Contacto
    }

    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
=======
      path: '/login',
      name: 'login',
      component: LoginView
>>>>>>> 08e0e1d3f43528f819f388fe2fec0af27dd3d8a1
    }

  ]
})

export default router
