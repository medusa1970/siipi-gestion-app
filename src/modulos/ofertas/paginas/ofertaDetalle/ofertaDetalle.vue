<template>
  <NuxtLayout
    :name="authStore.getNegocio.tipo === 'PUNTO' ? 'punto' : 'cathering'"
    :titulo="store.oferta?.nombre"
    :navegacion="[
      {
        label: 'Ofertas ' + store.catalogoRaiz.nombre,
        to: 'ofertas',
        params: { id: store.catalogoRaiz.id }
      },
      { label: store.oferta?.nombre }
    ]">
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
const { estado, store, authStore, router, route } = useOfertaDetalle();

import DatosBasicosTab from '@/modulos/ofertas/paginas/ofertaDetalle/datosBasicos/DatosBasicosTab.vue';
import ProductosTab from '@/modulos/ofertas/paginas/ofertaDetalle/productos/ProductosTab.vue';
import PreciosTab from '@/modulos/ofertas/paginas/ofertaDetalle/precios/PreciosTab.vue';
import AccionesTab from '@/modulos/ofertas/paginas/ofertaDetalle/acciones/AccionesTab.vue';

onBeforeMount(async () => {
  if (!store.oferta || store.oferta?._id !== route.params.id) {
    if (store.ofertas) {
      store.oferta = store.ofertas?.find(o => o._id === route.params.id);
    } else {
      try {
        store.oferta = await api.buscarOferta(route.params.id);
      } catch (err) {
        errFailback(err);
      }
    }
  }
  if (!store.oferta) {
    goTo(router, 'ofertas', { id: store.catalogoRaiz });
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
