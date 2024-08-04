<template>
  <pre>{{ store.empleado?.persona }}</pre>
</template>

<script setup lang="ts">
import { useEmpleadoPersona } from "./empleadoPersona.composable";
const { estado, authStore, store, router } = useEmpleadoPersona();
</script>
