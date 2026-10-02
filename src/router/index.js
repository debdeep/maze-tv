import { createRouter, createWebHistory } from 'vue-router'

const routes = [{
  path: '/shows',
  name: "shows",
  component: () => import('@/views/Dashboard.vue'),
  alias: ["/", "/home"]
}, {
  path: '/history',
  name: "history",
  component: () => import('@/views/History.vue'),
}, {
  path: '/shows/:id',
  name: 'show-detail',
  component: () => import('@/views/ShowDetail.vue'),
}]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
