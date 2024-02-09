<template>
  <layout :menuList="menuListSede">
    <template #slot>
      <slot />
    </template>
  </layout>
</template>

<script setup>
import { menuListSede } from '@/helpers/menuList';
</script>
