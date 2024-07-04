<template>
  <Navigation
    label="Productos"
    icon="list_alt"
    :label2="productoStore.producto.nombre"
    href="/cathering/productos"
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
    <!-- Datos Basicos -->
    <q-tab name="datosBasicos" icon="storefront" label="Datos basicos" />

    <!-- Marcas -->
    <q-tab v-if="soloAlmacen" name="marcas" icon="group" label="Marcas" />

    <!-- Medidas y empaques -->
    <q-tab
      v-if="soloAlmacenAdquisicion"
      name="medidas"
      icon="folder_copy"
      label="Medidas & Empaques"
    />

    <!-- Proveedores -->
    <q-tab
      v-if="soloAdquisicion"
      name="proveedores"
      icon="query_stats"
      label="Proveedores"
    />

    <!-- Acciones -->
    <q-tab name="acciones" icon="delete" label="Borrar" />
  </q-tabs>

  <!--
    PANELS
    -->

  <q-tab-panels
    v-model="estado.tab"
    animated
    style="height: calc(100vh - 115px)"
  >
    <!-- Datos Basicos -->
    <q-tab-panel name="datosBasicos" animated>
      <BasicoTabPanel />
    </q-tab-panel>

    <!-- Marcas -->
    <q-tab-panel name="marcas" animated>
      <MarcaTabPanel />
    </q-tab-panel>

    <!-- Medidas y empaques -->
    <q-tab-panel name="medidas" animated>
      <MedidaTabPanel />
    </q-tab-panel>

    <!-- Proveedores -->
    <q-tab-panel name="proveedores" animated>
      <ProveedorTabPanel />
    </q-tab-panel>

    <!-- Acciones -->
    <q-tab-panel name="acciones" animated>
      <AccionesTabPanel />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'cathering',
});

import MarcaTabPanel from '@/modulos/productos/infraestructura/paginas/detalleProducto/MarcaTabPanel.vue';
import MedidaTabPanel from '@/modulos/productos/infraestructura/paginas/detalleProducto/MedidaTabPanel.vue';
import ProveedorTabPanel from '@/modulos/productos/infraestructura/paginas/detalleProducto/ProveedorTabPanel.vue';
import AccionesTabPanel from '@/modulos/productos/infraestructura/paginas/detalleProducto/AccionesTabPanel.vue';
import BasicoTabPanel from '@/modulos/productos/infraestructura/paginas/detalleProducto/BasicoTabPanel.vue';
import { useProductoDetalle } from '@/modulos/productos/negocio/productoDetalle.composable';
const { estado, productoStore, authStore } = useProductoDetalle();
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
</script>

<style scoped>
.q-tab {
  padding: 0 10px;
  margin-bottom: 0px;
  /* border: 2px solid red; */
}
</style>
