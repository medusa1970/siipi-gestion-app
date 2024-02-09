<template>
  <h1 class="text-xl text-slate-950 font-bold">EMPLEADOS</h1>
  <Empleado />
</template>
<script setup>
definePageMeta({
  layout: 'sede',
});
import Empleado from '@/components/empleados/Empleado.vue';
</script>
