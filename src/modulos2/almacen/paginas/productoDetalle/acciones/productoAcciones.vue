<template>
  <div>
    <p>Indica el motivo por cual desea borrar este producto:</p>
    <input-text2
      tipo="textarea"
      label="Motivo"
      @update="(v) => (estado.motivoEliminacion = v)"
      info="Se avisará el jefe de logistica."
      :rules="[useRules.requerido()]"
    />
    <q-btn
      color="primary"
      label="Confirmar"
      :disable="estado.motivoEliminacion === ''"
      no-caps
      @click="borrarProducto()"
    />
  </div>
</template>

<script setup lang="ts">
import { useProductoAcciones } from './productoAcciones.composable';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useAlmacen } from '~/modulos2/almacen/almacen.composable';
const { actProductosDB } = useAlmacen();
const { $socket } = useNuxtApp();
const { estado, authStore, store, borrarProducto } = useProductoAcciones();
const router = useRouter();

//inicializaciones
onMounted(async () => {
  $socket.on('cambiosProductos', async (data: any) => {
    await actProductosDB();
  });
});
onBeforeUnmount(() => {
  $socket.off('cambiosProductos');
});

// Verificacion de permisos
if (!authStore.checkPermisos(['ALMACEN', 'ADQUISICION', 'TODO'])) {
  console.log('No tiene el acceso para esta pagina');
}
const soloAlmacen = ref(authStore.checkPermisos(['ALMACEN']));
const soloAdquisicion = ref(authStore.checkPermisos(['ADQUISICION']));
const soloAlmacenAdquisicion = ref(
  authStore.checkPermisos(['ADQUISICION', 'ALMACEN']),
);

// si no hay producto, pagina equivocada y volvemos a lalista
if (!store.producto) {
  goTo(router, 'productos');
}
</script>

<style lang="scss" scoped></style>
