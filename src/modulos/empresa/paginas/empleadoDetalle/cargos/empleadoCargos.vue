<template>[{{ store.empleado?.cargos }}]</template>

<script setup lang="ts">
import { useEmpleadoCargo } from "./empleadoCargos.composable";
const { estado, authStore, store, router } = useEmpleadoCargo();
</script>
