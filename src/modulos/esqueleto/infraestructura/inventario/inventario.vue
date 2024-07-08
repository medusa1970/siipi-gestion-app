<template>
  <h1 class="text-lg font-extrabold uppercase text-center">Inventario</h1>
</template>

<script setup>
// Layout y metadata
definePageMeta({
  layout: 'cathering',
});

// imports y inicializaciones
import { useInventario } from './inventario.composable';
import { useAlmacen } from '@/modulos/almacen/negocio/almacen.composable';
const almacen = useAlmacen();
const { estado, store, service } = useInventario();

// Reactives y inicializaciones
onMounted(() => {
  almacen.estado.crearEntidadData.nombre = 'foo';
  almacen.estado.crearEntidadData.tipo = 'PUNTO';
  almacen.estado.crearEntidadData.descripcion = 'descripcion';
  almacen.crearEntidad();
});
</script>
