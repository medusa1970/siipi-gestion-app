<template>
  <layout :menuList="menuListSede" sede>
    <template #slot>
      <slot />
    </template>
  </layout>
</template>

<script setup>
import { menuListSede } from '@/helpers/menuList';
</script>
