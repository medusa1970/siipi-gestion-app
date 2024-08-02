<template>[{{ store.empleado?.cargos }}]</template>

<script setup lang="ts">
import { useEmpleadoCargo } from "./empleadoCargos.composable";
import { useRouter } from "vue-router";
const { estado, authStore, store } = useEmpleadoCargo();
const router = useRouter();
</script>
