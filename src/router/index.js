import { createRouter, createWebHistory } from 'vue-router'

const routes = [{
  path: '/dashboard',
  name: "dashboard",
  component: () => import('@/views/Dashboard.vue'),
  alias: ["/", "/home"]
}, {
  path: '/history',
  name: "history",
  component: () => import('@/views/History.vue'),
}]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
