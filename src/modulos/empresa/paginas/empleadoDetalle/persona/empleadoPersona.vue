<template>
  <pre>{{ store.empleado?.persona }}</pre>
</template>

<script setup lang="ts">
import { useEmpleadoPersona } from "./empleadoPersona.composable";
import { useRouter } from "vue-router";
const { estado, authStore, store } = useEmpleadoPersona();
const router = useRouter();
</script>
