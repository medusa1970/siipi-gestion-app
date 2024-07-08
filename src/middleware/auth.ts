import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';

const authStore = useAuthStore();

export default defineNuxtRouteMiddleware((to, from) => {
  if (!authStore.getUsuario && to.path !== '/') {
    // return navigateTo('/');
  }
});
