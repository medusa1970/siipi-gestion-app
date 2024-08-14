<template>
  <NuxtLayout name="cathering">
    <q-tabs v-model="tab" inline-label no-caps dense class="mb-3">
      <q-tab name="puntos" icon="bi-box-seam" label="Pedidos Puntos" />
      <q-tab name="global" icon="bi-box-seam" label="Pedido Global" />
      <q-tab name="historial" icon="bi-calendar-date" label="Historial" />
    </q-tabs>

    <!-- TAB PANELS INFORMACION -->
    <q-tab-panels
      v-model="tab"
      animated
      transition-prev="jump-up"
      transition-next="jump-up"
      class="bg-transparent">
      <!-- VER PEDIDOS PUNTOS -->
      <q-tab-panel
        name="puntos"
        class="flex flex-col justify-center items-center">
        <Puntos />
      </q-tab-panel>

    <!-- VER PEDIDO GLOBAL -->
    <q-tab-panel name="global">
      <Global />
    </q-tab-panel>

      <!-- VER HISTORIAL DE PEDIDOS -->
      <q-tab-panel
        name="historial"
        class="flex flex-col justify-center items-center">
        <Historial />
      </q-tab-panel>
    </q-tab-panels>
  </NuxtLayout>
</template>

<script setup>
import Puntos from '../puntos/Puntos.vue';
import Global from '../global/Global.vue';
import Historial from '../historial/Historial.vue';

provide('infoPagina', {
  infoPagina: {
    titulo: 'Pedidos de los punto',
    camino: [{ label: 'Pedidos', to: 'listaPedidos' }]
  }
});

// const { estado, buscarPedidos2, obtenerOfertas } = useListaPedidos();

const tab = ref('puntos');
// const tabPuntos = ref('areaGlobal');
</script>
