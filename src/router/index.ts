import { createRouter, createWebHistory, type RouteMeta, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
  }
}

// vue-router types `meta` itself as optional, so a route could still omit the title
type TitledRoute = RouteRecordRaw & { meta: RouteMeta }

const routes: TitledRoute[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Home' },
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue'),
    meta: { title: 'About' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
