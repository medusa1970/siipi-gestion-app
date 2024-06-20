<template>
  <div class="flex justify-center items-center h-[100vh]">
    <div style="width: 300px" class="flex">
      <img style="width: 100%" :src="Logo" />
      <slot></slot>
    </div>
  </div>
</template>
<script setup>
import Logo from '@/assets/img/logo.png';
</script>
