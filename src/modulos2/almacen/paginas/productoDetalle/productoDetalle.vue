<template>
  <Navigation2
    :nav="[
      {
        label: 'productos',
        to: 'productos',
      },
      {
        label: 'detalle',
        to: 'producto',
        params: { id: store.producto._id },
      },
    ]"
    :titulo="'Producto: ' + store.producto.nombre"
  />

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
    <q-tab v-if="soloAlmacen" name="marcas" icon="group" label="Marcas" />
    <q-tab
      v-if="soloAlmacenAdquisicion"
      name="medidas"
      icon="folder_copy"
      label="Medidas & Empaques"
    />
    <q-tab
      v-if="soloAdquisicion"
      name="proveedores"
      icon="query_stats"
      label="Proveedores"
    />
    <q-tab v-if="soloAdquisicion" name="ofertas" icon="work" label="Ofertas" />
    <q-tab name="acciones" icon="delete" label="Borrar" />
  </q-tabs>
  <q-tab-panels
    v-model="estado.tab"
    animated
    style="height: calc(100vh - 115px)"
  >
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
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'cathering',
});

import { useProductoDetalle } from './productoDetalle.composable';
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';
const authStore = useAuthStore();
const { estado, store } = useProductoDetalle();
const { params } = useRoute();
const router = useRouter();

// Verificacion de permisos
if (!authStore.checkPermisos(['ALMACEN', 'ADQUISICION', 'TODO'])) {
  console.log('No tiene el acceso para esta pagina');
}
const soloAlmacen = ref(authStore.checkPermisos(['ALMACEN']));
const soloAdquisicion = ref(authStore.checkPermisos(['ADQUISICION']));
const soloAlmacenAdquisicion = ref(
  authStore.checkPermisos(['ADQUISICION', 'ALMACEN']),
);

import MarcaTabPanel from './tab/variedades/productoVariedades.vue';
import MedidaTabPanel from './tab/medidas/productoMedidas.vue';
import ProveedorTabPanel from './tab/proveedores/productoServicios.vue';
import AccionesTabPanel from './tab/acciones/productoAcciones.vue';
import BasicoTabPanel from './tab/basico/productoBasico.vue';
import OfertasTabPanel from './tab/ofertas/productoOfertas.vue';

onBeforeMount(async () => {
  await store.getProductos();
  const producto = store.productos.find((prod) => {
    return prod._id === params.id;
  });
  if (producto) {
    store.producto = producto;
  } else {
    goTo(router, 'productos');
  }
});
</script>

<style lang="scss" scoped></style>
