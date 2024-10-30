import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import ProjectMineralsView from '@/views/ProjectMineralsView.vue'
import UsersView from '@/views/UsersView.vue'
import MineralsView from '@/views/MineralsView.vue'
import ProjectsView from '@/views/ProjectsView.vue'
import ProjectDetailsView from '@/views/ProjectDetailsView.vue'
import CategoryPostView from '@/views/CategoryPostView.vue'
import PostsView from '@/views/PostsView.vue'
import PostView from '@/views/PostView.vue'
import WithdrawalRequestsView from '@/views/WithdrawalRequestsView.vue'
import UserHomeView from '@/views/UserHomeView.vue'
import MovementsView from '@/views/MovementsView.vue'
import ControlPanel from '@/components/ControlPanel.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'user-home',
      component: UserHomeView,
    },

    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },

    },
    {
      path: '/minerals',
      name: 'minerals',
      component: MineralsView,
      meta: { requiresAuth: true },

    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView,
      meta: { requiresAuth: true },

    },
    {
      path: '/projects/:id',
      name: 'project-details',
      component: ProjectDetailsView,
      meta: { requiresAuth: true },

    },
    {

      path: '/projectminerals',
      name: 'projectminerals',
      component: ProjectMineralsView,
      meta: { requiresAuth: true },

    },

    {
      path: '/users',
      name: 'users',
      component: UsersView,
      meta: { requiresAuth: true },


    },
    {
      path: '/category-posts',
      name: 'category-posts',
      component: CategoryPostView,
      meta: { requiresAuth: true },

    },
    {
      path: '/posts',
      name: 'posts',
      component: PostsView,
      meta: { requiresAuth: true },

    },
    {
      path: '/post/:id',
      name: 'post-details',
      component: PostView,
      meta: { requiresAuth: true },

    },
    {
      path: '/withdrawalrequests',
      name: 'withdrawalrequests',
      component: WithdrawalRequestsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {

      path: '/:pathMatch(.*)*',
      redirect: '/'
    },
    {
      path: '/movements',
      name: 'movements',
      component: MovementsView,
      meta: { requiresAuth: true }
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: ControlPanel,
      meta: { requiresAuth: true }
    }
  ]
})

// este es el verifidor si esta autenticado mediante token en las rutas 
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem("token");
  // is la ruta nesesita autenticacion y si el user esta autentificado
  if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
    next('/login') // redireccion
  } else {
    next(); //permitir
  }
})

export default router