<template>
  <Layout :menuList="menuListMarca">
    <template #slot>
      <slot />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { menuListMarca } from '@/helpers/menuList';
</script>

<style scoped></style>
