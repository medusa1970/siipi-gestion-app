<template>
  <NuxtLayout
    :name="authStore.getNegocio.tipo === 'PUNTO' ? 'punto' : 'cathering'">
    <q-tabs
      v-model="estado.tab"
      inline-label
      outside-arrows
      mobile-arrows
      class="bg-grey-7 text-white shadow-2"
      align="justify"
      no-caps>
      <q-tab name="basico" icon="balance" label="Datos basicos" />
      <q-tab name="empaques" icon="balance" label="Tipos de empaque" />
    </q-tabs>
    <q-tab-panels
      v-model="estado.tab"
      animated
      style="height: calc(100vh - 115px)">
      <q-tab-panel name="basico" animated>
        <BasicoTabPanel />
      </q-tab-panel>
      <q-tab-panel name="empaques" animated>
        <EmpaquesTabPanel />
      </q-tab-panel> </q-tab-panels
  ></NuxtLayout>
</template>

<script setup lang="ts">
import { useMedidaDetalle } from './medidaDetalle.composable';
const { estado, store, authStore, router } = useMedidaDetalle();
const { params } = useRoute();

import BasicoTabPanel from './basico/medidaBasico.vue';
import EmpaquesTabPanel from './empaques/medidaEmpaques.vue';

provide('infoPagina', {
  infoPagina: {
    titulo: store.medida?.nombre + '(edición)',
    camino: [
      { label: 'Medidas', to: 'medidas' },
      {
        label: store.medida?.nombre,
        to: 'medida',
        params: { id: store.medida?._id }
      }
    ]
  }
});

onMounted(async () => {
  await store.getMedidas();
  const medida = store.medidas.find(m => {
    return m._id === params.id;
  });
  if (medida) {
    store.refreshMedidas();
    store.medida = medida;
  } else {
    goTo(router, 'medidas');
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
