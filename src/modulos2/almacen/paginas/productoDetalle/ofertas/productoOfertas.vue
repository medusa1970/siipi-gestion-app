<template>
  <div></div>
</template>

<script setup lang="ts">
import { useAlmacen } from '~/modulos2/almacen/almacen.composable';
const { actProductosDB } = useAlmacen();
const { $socket } = useNuxtApp();

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
