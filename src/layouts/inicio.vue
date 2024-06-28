<template>
<<<<<<< HEAD
  <div class="m-auto max-w-xs h-full">
    <img style="width: 100%" :src="Logo" />
    <slot></slot>
=======
  <div class="flex justify-center items-center">
    <div style="width: 300px" class="">
      <!-- <img style="width: 100%" :src="Logo" /> -->

      <slot></slot>
    </div>
>>>>>>> will-productos
  </div>
</template>

<script setup>
import Logo from '@/assets/img/logo.png';
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';
const authStore = useAuthStore();
</script>
