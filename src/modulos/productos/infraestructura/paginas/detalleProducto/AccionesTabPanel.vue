<template>
  <div>
    <p>Indica el motivo por cual desea borrar este producto:</p>
    <input-text
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
import { useDetalleAcciones } from '@/modulos/productos/negocio/detalle/acciones.composable';
const router = useRouter();
const { estado, authStore, productoStore, borrarProducto } =
  useDetalleAcciones();

// Verificacion de permisos
if (!authStore.checkPermisos(['ALMACEN', 'ADQUISICION', 'TODO'])) {
  console.log('No tiene el acceso para esta pagina');
}
const soloAlmacen = ref(authStore.checkPermisos(['ALMACEN']));
const soloAdquisicion = ref(authStore.checkPermisos(['ADQUISICION']));
const soloAlmacenAdquisicion = ref(
  authStore.checkPermisos(['ADQUISICION', 'ALMACEN']),
);

definePageMeta({
  layout: 'cathering',
});

// si no hay producto, pagina equivocada y volvemos a lalista
if (!productoStore.producto) {
  goTo(router, 'productos');
}
</script>

<style lang="scss" scoped></style>
