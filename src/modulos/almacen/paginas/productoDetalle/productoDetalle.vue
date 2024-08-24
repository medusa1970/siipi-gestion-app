<template>
  <NuxtLayout
    :name="authStore.getNegocio.tipo === 'PUNTO' ? 'punto' : 'cathering'"
    :titulo="store.producto?.nombre"
    :navegacion="[
      { label: 'productos', to: 'productos' },
      { label: store.producto?.nombre }
    ]">
    <q-tabs
      v-model="estado.tab"
      inline-label
      outside-arrows
      mobile-arrows
      class="bg-grey-7 text-white shadow-2"
      align="justify"
      no-caps>
      <q-tab name="datosBasicos" icon="bi-box" label="Datos basicos" />
      <q-tab name="marcas" icon="storefront" label="Marcas" />
      <q-tab name="medidas" icon="balance" label="Medidas & Empaques" />
      <q-tab name="proveedores" icon="hail" label="Proveedores" />
      <q-tab name="ofertas" icon="menu_book" label="Ofertas" />
      <q-tab name="acciones" icon="delete" label="Borrar" />
    </q-tabs>
    <q-tab-panels
      v-model="estado.tab"
      animated
      style="height: calc(100vh - 115px)">
      <q-tab-panel name="datosBasicos" animated>
        <BasicoTabPanel />
      </q-tab-panel>
      <q-tab-panel name="marcas" animated>
        <MarcaTabPanel />
      </q-tab-panel>
      <q-tab-panel name="medidas" animated>
        <MedidaTabPanel />
      </q-tab-panel>
      <q-tab-panel name="proveedores" animated>
        <ProveedorTabPanel />
      </q-tab-panel>
      <q-tab-panel name="ofertas" animated>
        <OfertasTabPanel />
      </q-tab-panel>
      <q-tab-panel name="acciones" animated>
        <AccionesTabPanel />
      </q-tab-panel> </q-tab-panels
  ></NuxtLayout>
</template>

<script setup lang="ts">
import { useProductoDetalle } from './productoDetalle.composable';
const { estado, store, authStore, router, route } = useProductoDetalle();

import MarcaTabPanel from './variedades/productoVariedades.vue';
import MedidaTabPanel from './medidas/productoMedidas.vue';
import ProveedorTabPanel from './proveedores/productoServicios.vue';
import AccionesTabPanel from './acciones/productoAcciones.vue';
import BasicoTabPanel from './basico/productoBasico.vue';
import OfertasTabPanel from './ofertas/productoOfertas.vue';

onBeforeMount(async () => {
  if (!store.producto || store.producto?._id !== route.params.id) {
    if (store.productos) {
      store.producto = store.productos?.find(o => o._id === route.params.id);
    } else {
      try {
        store.producto = await buscarUno(GqlBuscarProductos_basico, {
          busqueda: route.params.id as string
        });
      } catch (err) {
        errFailback(err);
      }
    }
  }
  if (!store.producto) {
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
