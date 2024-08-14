<template>
  <NuxtLayout name="cathering">
    <q-tabs
      v-model="estado.tab"
      inline-label
      outside-arrows
      mobile-arrows
      class="bg-grey-3 text-black shadow-2"
      align="justify"
      no-caps>
      <q-tab name="debido" icon="balance" label="Resumen" />
      <q-tab name="pagos" icon="balance" label="Pagos" />
      <q-tab name="acciones" icon="balance" label="Acciones" />
    </q-tabs>
    <q-tab-panels
      v-model="estado.tab"
      animated
      style="height: calc(100vh - 115px)">
      <q-tab-panel name="debido" animated>
        <DebidoTabPanel />
      </q-tab-panel>
      <q-tab-panel name="pagos" animated>
        <PagosTabPanel />
      </q-tab-panel>
      <q-tab-panel name="acciones" animated>
        <AccionesTabPanel />
      </q-tab-panel> </q-tab-panels
  ></NuxtLayout>
</template>

<script setup lang="ts">
import { useTesoreriaDetalle } from './tesoreriaDetalle';
const { estado, store, authStore, router } = useTesoreriaDetalle();

import DebidoTabPanel from './debido/tesoreriaDebido.vue';
import PagosTabPanel from './pagos/tesoreriaPagos.vue';
import AccionesTabPanel from './acciones/tesoreriaAcciones.vue';

/**
 * provide para el layout
 */
const infoPagina = ref(null);
provide('infoPagina', {
  infoPagina,
  update: () => {
    infoPagina.value = {
      titulo: store.entidad?.nombre,
      camino: [
        { label: 'Tesoreria', to: 'tesoreria' },
        {
          label: store.entidad?.nombre,
          to: 'tesoreriaDetalle',
          params: { id: store.entidad?._id }
        }
      ]
    };
  }
});

/**
 * Recuperacion de los datos
 */
onMounted(async () => {
  await store.useEntidad();
  await store.getInfoPedidos();
});
</script>

<style scoped>
.q-tab {
  padding: 0 10px;
  margin-bottom: 0px;
  /* border: 2px solid red; */
}
</style>
./pagos/tesoreriaHistorial.vue
