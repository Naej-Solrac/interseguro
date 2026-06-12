import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/Login.vue';
import DashboardView from '../views/Dashboard.vue';
import { useAuthStore } from '../store/auth.store';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { public: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
  ],
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  const isPublic = Boolean(to.meta.public);

  if (!isPublic && !authStore.isAuthenticated) {
    return { name: 'login' };
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'dashboard' };
  }

  return true;
});

export default router;
