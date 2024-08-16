<template>
  <NuxtLayout name="cathering">
    <q-tabs
      v-model="estado.tab"
      inline-label
      outside-arrows
      mobile-arrows
      class="bg-grey-7 text-white shadow-2"
      align="justify"
      no-caps>
      <q-tab name="datosBasicos" icon="menu_book" label="Datos basicos" />
      <q-tab name="productos" icon="bi-box" label="Productos" />
      <q-tab name="precios" icon="money" label="Precios" />
      <q-tab name="acciones" icon="delete" label="Borrar" />
    </q-tabs>

    <q-tab-panels
      v-model="estado.tab"
      animated
      style="height: calc(100vh - 115px)">
      <q-tab-panel name="datosBasicos" animated>
        <DatosBasicosTab />
      </q-tab-panel>
      <q-tab-panel name="productos" animated>
        <ProductosTab />
      </q-tab-panel>
      <q-tab-panel name="precios" animated>
        <PreciosTab />
      </q-tab-panel>
      <q-tab-panel name="acciones" animated>
        <AccionesTab />
      </q-tab-panel>
    </q-tab-panels>
  </NuxtLayout>
</template>

<script setup>
import { useOfertaDetalle } from './ofertaDetalle.composable';
const { estado, store, authStore, router } = useOfertaDetalle();

import DatosBasicosTab from '@/modulos/ofertas/paginas/ofertaDetalle/datosBasicos/DatosBasicosTab.vue';
import ProductosTab from '@/modulos/ofertas/paginas/ofertaDetalle/productos/ProductosTab.vue';
import PreciosTab from '@/modulos/ofertas/paginas/ofertaDetalle/precios/PreciosTab.vue';
import AccionesTab from '@/modulos/ofertas/paginas/ofertaDetalle/acciones/AccionesTab.vue';

provide('infoPagina', {
  infoPagina: {
    titulo: store.oferta?.nombre + ' (edicion)',
    camino: [
      { label: 'Ofertas', to: 'ofertas' },
      { label: store.oferta?.nombre, to: 'ofertaDetalles' }
    ]
  }
});

onMounted(async () => {
  await store.getOfertas();
  store.useEntidad();
  if (!store.oferta) {
    goTo(router, 'ofertas');
  }
});
</script>

<style scoped>
.q-tab {
  padding: 0 10px;
  margin-bottom: 0px;
  /* border: 2px solid red; */
}
</style>
