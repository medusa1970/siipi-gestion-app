<template>
  <Layout :menuList="menuListCathering">
    <template #slot>
      <slot />
    </template>
  </Layout>
</template>

<script setup>
import { menuListCathering } from '@/helpers/menuList';
</script>
