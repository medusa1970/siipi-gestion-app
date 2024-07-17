<template>
  <!-- @vue-ignore -->
  <formProductoBasico
    v-show="store.producto"
    :edicion="store.producto"
    :key="store.producto"
    @modificarObjeto="handleProductoModificado"
  />
</template>

<script setup lang="ts">
import formProductoBasico from '@/modulos2/almacen/forms/formProductoBasico.vue';
import { useProductoBasico } from './productoBasico.composable';
import { useAlmacen } from '~/modulos2/almacen/almacen.composable';
const { actProductosDB } = useAlmacen();
const { $socket } = useNuxtApp();
const { store, handleProductoModificado } = useProductoBasico();

//inicializaciones
onMounted(async () => {
  $socket.on('cambiosProductos', async (data: any) => {
    await actProductosDB();
  });
});
onBeforeUnmount(() => {
  $socket.off('cambiosProductos');
});
</script>

<style lang="scss" scoped></style>
