<template>
  <div></div>
</template>

<script setup lang="ts">
import { useAlmacen } from '~/modulos/almacen/almacen.composable';
const { store } = useAlmacen();
const { $socket } = useNuxtApp();

//inicializaciones
onMounted(async () => {
  $socket.on('cambiosProductos', async (data: any) => {
    await store.refreshProductos();
  });
});
onBeforeUnmount(() => {
  $socket.off('cambiosProductos');
});
</script>

<style lang="scss" scoped></style>
