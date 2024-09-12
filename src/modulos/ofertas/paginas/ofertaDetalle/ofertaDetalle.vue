<template>
  <NuxtLayout
    :name="authStore.getNegocio.tipo === 'PUNTO' ? 'punto' : 'cathering'"
    :titulo="oferta?.nombre"
    :navegacion="[
      {
        label: 'Ofertas',
        to: 'ofertas',
        params: { area: store.catalogoParaVolver }
      },
      { label: oferta?.nombre }
    ]">
    {{ store.catalogoParaVolver }}
    <q-tabs
      v-model="tabActiva"
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
      v-if="oferta"
      v-model="tabActiva"
      animated
      style="height: calc(100vh - 115px)">
      <q-tab-panel name="datosBasicos" animated>
        <DatosBasicosTab :ofertaCorriente="oferta" />
      </q-tab-panel>
      <q-tab-panel name="productos" animated>
        <ProductosTab :ofertaCorriente="oferta" />
      </q-tab-panel>
      <q-tab-panel name="precios" animated>
        <PreciosTab :ofertaCorriente="oferta" />
      </q-tab-panel>
      <q-tab-panel name="acciones" animated>
        <AccionesTab :ofertaCorriente="oferta" />
      </q-tab-panel>
    </q-tab-panels>
  </NuxtLayout>
</template>

<script setup>
import { useOfertaDetalle } from './ofertaDetalle';
const { estado, store, authStore, router, route } = useOfertaDetalle();

const tabActiva = ref('datosBasicos');

import DatosBasicosTab from '@/modulos/ofertas/paginas/ofertaDetalle/ofertaBasico.vue';
import ProductosTab from '@/modulos/ofertas/paginas/ofertaDetalle/ofertaProductos.vue';
import PreciosTab from '@/modulos/ofertas/paginas/ofertaDetalle/ofertaPrecios.vue';
import AccionesTab from '@/modulos/ofertas/paginas/ofertaDetalle/ofertaAcciones.vue';

const oferta = ref(null);
onBeforeMount(async () => {
  // recuperamos el producto
  if (!store.ofertas) store.ofertas = await store.getOfertas();
  oferta.value = store.ofertas?.find(o => o._id === route.params.id);
  if (!oferta.value) {
    goTo(router, '404');
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
