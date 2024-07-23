import { useAuthStore } from '~/modulos/main/useAuthStore';

const authStore = useAuthStore();

export default defineNuxtRouteMiddleware((to, from) => {
  if (!authStore.getUsuario && to.path !== '/') {
    // return navigateTo('/');
  }
});
