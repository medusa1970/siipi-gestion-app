<template>
  <NuxtLayout
    :name="authStore.getNegocio.tipo === 'PUNTO' ? 'punto' : 'cathering'"
    :titulo="producto?.nombre"
    :navegacion="[
      { label: 'productos', to: 'productos' },
      { label: producto?.nombre }
    ]">
    <q-tabs
      v-model="tabActiva"
      inline-label
      outside-arrows
      mobile-arrows
      class="bg-grey-7 text-white shadow-2"
      align="justify"
      no-caps>
      <q-tab name="datosBasicos" icon="bi-box" label="Básico" />
      <q-tab name="marcas" icon="storefront" label="Marcas" />
      <q-tab name="medidas" icon="balance" label="Medidas" />
      <q-tab name="proveedores" icon="hail" label="Proveedores" />
      <q-tab name="ofertas" icon="menu_book" label="Ofertas" />
      <q-tab name="acciones" icon="delete" label="Borrar" />
    </q-tabs>

    <q-tab-panels
      v-model="tabActiva"
      animated
      style="height: calc(100vh - 115px)">
      <q-tab-panel name="datosBasicos" animated>
        <BasicoTabPanel :productoCorriente="producto" />
      </q-tab-panel>
      <q-tab-panel name="marcas" animated>
        <MarcaTabPanel :productoCorriente="producto" />
      </q-tab-panel>
      <q-tab-panel name="medidas" animated>
        <MedidaTabPanel :productoCorriente="producto" />
      </q-tab-panel>
      <q-tab-panel name="proveedores" animated>
        <ProveedorTabPanel :productoCorriente="producto" />
      </q-tab-panel>
      <q-tab-panel name="ofertas" animated>
        <OfertasTabPanel :productoCorriente="producto" />
      </q-tab-panel>
      <q-tab-panel name="acciones" animated>
        <AccionesTabPanel :productoCorriente="producto" />
      </q-tab-panel>
    </q-tab-panels>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useProductoDetalle } from './productoDetalle';
const { store, authStore, router, route } = useProductoDetalle();

const tabActiva = ref('datosBasicos');

import MarcaTabPanel from './productoVariedades.vue';
import MedidaTabPanel from './productoMedidas.vue';
import ProveedorTabPanel from './productoServicios.vue';
import AccionesTabPanel from './productoAcciones.vue';
import BasicoTabPanel from './productoBasico.vue';
import OfertasTabPanel from './productoOfertas.vue';

const producto = ref(null);
onBeforeMount(async () => {
  // recuperamos el producto
  if (!store.productos) store.productos = await store.getProductos();
  producto.value = store.productos?.find(p => p._id === route.params.id);
  if (!producto.value) {
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
