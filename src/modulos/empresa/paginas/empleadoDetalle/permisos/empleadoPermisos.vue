<template>
  <pre>{{ store.empleado.permisos }}</pre>
</template>

<script setup lang="ts">
import { useEmpleadoPermisos } from './empleadoPermisos.composable';
import { useRouter } from 'vue-router';
const { estado, authStore, store } = useEmpleadoPermisos();
const router = useRouter();
</script>
