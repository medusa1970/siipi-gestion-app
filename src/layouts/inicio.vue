<template>
  <div class="flex justify-center items-center">
    <div style="width: 300px" class="">
      <!-- <img style="width: 100%" :src="Logo" /> -->

      <slot></slot>
    </div>
  </div>
</template>
<script setup>
import Logo from '@/assets/img/logo.png';
</script>
