<template>
  <div class="m-auto max-w-xs h-full">
    <img style="width: 100%" :src="Logo" />
    <slot></slot>
  </div>
</template>

<script setup>
import Logo from "@/assets/img/logo.png";
import { useAuthStore } from "~/modulos/main/useAuthStore";
const authStore = useAuthStore();
</script>
