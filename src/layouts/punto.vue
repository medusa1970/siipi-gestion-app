<template>
  <Layout :menuList="menuListPunto">
    <template #slot>
      <slot />
    </template>
  </Layout>
</template>

<script setup>
import { menuListPunto } from '@/helpers/menuList';
</script>
