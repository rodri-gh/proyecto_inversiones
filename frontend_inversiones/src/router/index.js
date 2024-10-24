import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import UsersView from '@/views/UsersView.vue'

import MineralsView from '@/views/MineralsView.vue'
import ProjectsView from '@/views/ProjectsView.vue'
import ProjectDetailsView from '@/views/ProjectDetailsView.vue'
import CategoryPostView from '@/views/CategoryPostView.vue'
import PostView from '@/views/PostView.vue'
import PostDeatilsView from '@/views/PostDeatilsView.vue'
import ContactView from '@/views/ContactView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/minerals',
      name: 'minerals',
      component: MineralsView
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView
    },
    {
      path: '/projects/:id',
      name: 'project-details',
      component: ProjectDetailsView
    },
    {

      path: '/users',
      name: 'users',
      component: UsersView

    },
    {
      path: '/category-posts',
      name: 'category-posts',
      component: CategoryPostView
    },
    {
      path: '/posts',
      name: 'posts',
      component: PostView
    },
    {
      path: '/posts/:id',
      name: 'post-details',
      component: PostDeatilsView
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView
    }
  ]
})

export default router
