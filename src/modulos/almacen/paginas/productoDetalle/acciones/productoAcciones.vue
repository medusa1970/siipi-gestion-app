<template>
  <div>
    <p>Indica el motivo por cual desea borrar este producto:</p>
    <input-text
      tipo="textarea"
      label="Motivo"
      @update="(v) => (estado.motivoEliminacion = v as string)"
      info="Info #39"
      requerido
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
import { useProductoAcciones } from "./productoAcciones.composable";
const { estado, authStore, store, router, borrarProducto } =
  useProductoAcciones();

// si no hay producto, pagina equivocada y volvemos a lalista
if (!store.producto) {
  goTo(router, "productos");
}
</script>

<style lang="scss" scoped></style>
