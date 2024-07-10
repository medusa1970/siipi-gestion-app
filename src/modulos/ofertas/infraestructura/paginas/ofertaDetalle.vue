<template>
  <Navigation
    label="Ofertas"
    icon="list_alt"
    :label2="ofertaStore.oferta.nombre"
    href="/cathering/ofertas"
  />

  <!--
    TABS
    -->

  <q-tabs
    v-model="estado.tab"
    inline-label
    outside-arrows
    mobile-arrows
    class="bg-grey-7 text-white shadow-2"
    align="justify"
    no-caps
  >
    <q-tab name="datosBasicos" icon="storefront" label="Datos basicos" />
    <q-tab name="productos" icon="group" label="Productos" />
    <q-tab name="precios" icon="attach_money" label="Precios" />
    <q-tab name="acciones" icon="delete" label="Borrar" />
  </q-tabs>

  <q-tab-panels
    v-model="estado.tab"
    animated
    style="height: calc(100vh - 115px)"
  >
    <!-- 
    DATOS BASICOS 
  -->

    <q-tab-panel name="datosBasicos" animated>
      <DatosBasicosTab />
    </q-tab-panel>

    <!-- 
        PRODUCTOS OFERTA 
  -->
    <q-tab-panel name="productos" animated>
      <ProductosTab />
    </q-tab-panel>

    <!-- 
    PRECIOS OFERTA 
  -->
    <q-tab-panel name="precios" animated>
      <PreciosTab />
    </q-tab-panel>

    <!-- 
    ACCIONES BORRAR 
  -->
    <q-tab-panel name="acciones" animated>
      <AccionesTab />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { useOfertaDetalle } from '@/modulos/ofertas/negocio/ofertaDetalle.composable';
import DatosBasicosTab from '@/modulos/ofertas/infraestructura/componente/DatosBasicosTab.vue';
import ProductosTab from '@/modulos/ofertas/infraestructura/componente/ProductosTab.vue';
import PreciosTab from '~/modulos/ofertas/infraestructura/componente/PreciosTab.vue';
import AccionesTab from '~/modulos/ofertas/infraestructura/componente/AccionesTab.vue';

const { estado, ofertaStore } = useOfertaDetalle();
// layout
definePageMeta({
  layout: 'cathering',
});
</script>
<style scoped>
.q-tab {
  padding: 0 10px;
  margin-bottom: 0px;
  /* border: 2px solid red; */
}
</style>
