<template>
  <q-form @submit.prevent="modificarOfertaPrecio">
    <p>Entre los precios de la oferta:</p>

    <!-- precio sin factura -->
    <input-text
      label="Precio sin factura"
      @update="(v) => (estado.datos_preciosOferta.precioSinFactura = v)"
      :porDefecto="estado.datos_preciosOferta.precioSinFactura"
      :rules="[useRules.requerido()]"
      info="Ingrese o modifique el precio sin factura de la oferta"
    />
    <!-- precio con factura -->
    <input-text
      label="Precio con factura"
      tipo="number"
      @update="(v) => (estado.datos_preciosOferta.precioConFactura = v)"
      :porDefecto="estado.datos_preciosOferta.precioConFactura"
      :rules="[useRules.requerido()]"
      info="Ingrese o modifique el precio con factura de la oferta"
    />
    <q-btn color="primary" label="Guardar" type="submit" no-caps />
  </q-form>
</template>

<script setup>
import { usePrecioTab } from './preciosTab.composable';
const { estado, store, modificarOfertaPrecio } = usePrecioTab();
if (store.oferta) {
  estado.datos_preciosOferta.precioSinFactura = store.oferta.precioSinFactura;
  estado.datos_preciosOferta.precioConFactura = store.oferta.precioConFactura;
}
</script>
<style lang="scss" scoped></style>
