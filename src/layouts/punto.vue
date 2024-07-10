<template>
  <layout-common
    :menuList="menuListPunto"
    :portada-img="PortadaCathering"
    cathering
  >
    <template #slot>
      <slot />
    </template>
  </layout-common>
</template>

<script setup>
import { menuListPunto } from './menuList/menuList';
import PortadaCathering from '@/assets/img/cookies.png';
import layoutCommon from '@/layouts/shared/layoutCommon.vue';
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';
const router = useRouter();
const authStore = useAuthStore();
if (authStore.getNegocio?.tipo !== 'PUNTO') {
  goTo(router, 'inicio');
}
</script>
