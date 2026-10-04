import { createRouter, createWebHistory } from 'vue-router';
import { reactive } from 'vue';

const visitedRoutes = reactive([]);
const routes = [{
  path: '/',
  redirect: { name: 'shows' },
}, {
  path: '/shows',
  name: "shows",
  component: () => import('@/views/Dashboard.vue')
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

router.afterEach((to, from, faliure) => {
  if (to.path !== "/history") {
    if (!visitedRoutes.some(route => route.path === to.path)) {
      visitedRoutes.push({ path: to.path });
      //console.log("visitedRoutes", visitedRoutes);
    }
  }
})

export { visitedRoutes };
export default router;
