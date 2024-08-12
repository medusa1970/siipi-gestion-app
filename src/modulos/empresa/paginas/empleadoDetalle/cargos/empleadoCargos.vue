<template>[{{ store.empleado?.cargos }}]</template>

<script setup lang="ts">
import { useEmpleadoCargo } from './empleadoCargos';
const { estado, authStore, store, router } = useEmpleadoCargo();
</script>
