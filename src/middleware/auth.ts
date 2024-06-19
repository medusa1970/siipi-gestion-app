import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';

const authStore = useAuthStore();

export default defineNuxtRouteMiddleware((to, from) => {
  if (!authStore.getUser && to.path !== '/') {
    // return navigateTo('/');
  }
});
