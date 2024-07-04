<template>
  <q-form @submit.prevent="modificarOfertaPrecio">
    <p>Entre los precios de la oferta:</p>

    <!-- precio sin factura -->
    <input-text
      label="Precio sin factura"
      @update="(v) => (estado.datos_preciosOferta.precioSinFactura = Number(v))"
      info="Se debe modificar el nombre UNICAMENTE para corrigir su ortografia o mejorar su descriptividad, caso contrario toca crear un nuevo producto."
      :porDefecto="estado.datos_preciosOferta.precioSinFactura"
      :rules="[useRules.requerido(), useRules.numero()]"
    />
    <!-- precio con factura -->
    <input-text
      label="Precio con factura"
      @update="(v) => (estado.datos_preciosOferta.precioConFactura = Number(v))"
      info="Se debe modificar el nombre UNICAMENTE para corrigir su ortografia o mejorar su descriptividad, caso contrario toca crear un nuevo producto."
      :porDefecto="estado.datos_preciosOferta.precioConFactura"
      :rules="[useRules.requerido(), useRules.numero()]"
    />
    <q-btn color="primary" label="Guardar" type="submit" no-caps />
  </q-form>
</template>

<script setup>
import { usePrecioTab } from '~/modulos/ofertas/negocio/preciosTab.composable';

const { estado, modificarOfertaPrecio, ofertaStore } = usePrecioTab();

if (ofertaStore.oferta) {
  estado.datos_preciosOferta.precioSinFactura =
    ofertaStore.oferta.precioSinFactura;
  estado.datos_preciosOferta.precioConFactura =
    ofertaStore.oferta.precioConFactura;
}
</script>

<style lang="scss" scoped></style>
