<template>
  <q-form @submit.prevent="modificarOfertaPrecio">
    <p>Entre los precios de la oferta:</p>

    <!-- precio sin factura -->
    <input-text
      label="Precio sin factura"
      @update="(v) => (estado.datos_preciosOferta.precioSinFactura = Number(v))"
      :porDefecto="estado.datos_preciosOferta.precioSinFactura"
      :rules="[useRules.requerido(), useRules.numero()]"
      info="Ingrese o modifique el precio sin factura de la oferta"
    />
    <!-- precio con factura -->
    <input-text
      label="Precio con factura"
      @update="(v) => (estado.datos_preciosOferta.precioConFactura = Number(v))"
      :porDefecto="estado.datos_preciosOferta.precioConFactura"
      :rules="[useRules.requerido(), useRules.numero()]"
      info="Ingrese o modifique el precio con factura de la oferta"
    />
    <q-btn color="primary" label="Guardar" type="submit" no-caps />
  </q-form>
</template>

<script setup>
import { usePrecioTab } from '~/modulos/ofertas/negocio/preciosTab.composable';
import { useOferta } from '@/modulos/ofertas/negocio/oferta.composable';

const { estado, modificarOfertaPrecio, ofertaStore } = usePrecioTab();
const { actOfertasDB } = useOferta();
const { $socket } = useNuxtApp();

if (ofertaStore.oferta) {
  estado.datos_preciosOferta.precioSinFactura =
    ofertaStore.oferta.precioSinFactura;
  estado.datos_preciosOferta.precioConFactura =
    ofertaStore.oferta.precioConFactura;
}

onMounted(async () => {
  // ofertaStore.obtenerOfertas();
  $socket.on('cambiosOfertas', async (data) => {
    await actOfertasDB();
  });
});

onBeforeUnmount(() => {
  $socket.off('cambiosOfertas');
});
</script>

<style lang="scss" scoped></style>
