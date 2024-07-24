<template>
  <DeployStatus />
  <layout-common
    :menuList="menuListCathering"
    :portada-img="PortadaCathering"
    cathering
  >
    <template #slot>
      <slot />
    </template>
  </layout-common>
</template>

<script setup>
import { menuListCathering } from './menuList/menuList';
import PortadaCathering from '@/assets/img/cookies.png';
import layoutCommon from '@/layouts/shared/layoutCommon.vue';
import { useAuthStore } from '~/modulos/main/useAuthStore';
const router = useRouter();
const authStore = useAuthStore();
if (authStore.getNegocio?.tipo !== 'CLIENTELA') {
  goTo(router, 'inicio');
}
</script>
