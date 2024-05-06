<template>
  <layout :menuList="menuListSede" sede :portada-img="PortadaSede">
    <template #slot>
      <slot />
    </template>
  </layout>
</template>

<script setup>
import { menuListSede } from '@/helpers/menuList';
import PortadaSede from '@/assets/img/backSede.png';
</script>
