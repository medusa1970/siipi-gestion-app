import { authStore } from '@/stores/auth.store';

const useAuth = authStore();
export default defineNuxtRouteMiddleware((to, from) => {
  // console.log(useAuth.token);
  if (!useAuth.token && to.path !== '/') {
    return navigateTo('/');
  }
});
