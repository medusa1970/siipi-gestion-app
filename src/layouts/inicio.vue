<template>
  <div class="m-auto max-w-xs h-full">
    <img style="width: 100%" :src="Logo" />
    <slot></slot>
    {{ authStore.token }}
  </div>
</template>
<script setup>
import Logo from '@/assets/img/logo.png';
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';
const authStore = useAuthStore();
</script>
