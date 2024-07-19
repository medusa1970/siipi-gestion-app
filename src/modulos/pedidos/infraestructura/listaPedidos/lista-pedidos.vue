<template>
  <div>
    <q-tabs
      v-model="tab"
      inline-label
      outside-arrows
      mobile-arrows
      class="bg-grey-7 text-white shadow-2"
      no-caps
    >
      <q-tab name="cathering" icon="bi-cart4" label="Pedidos Cathering" />
      <q-tab
        name="historial"
        icon="bi-calendar-date"
        label="Historial de pedidos"
      />
    </q-tabs>
    <q-tab-panels
      v-model="tab"
      animated
      transition-prev="jump-up"
      transition-next="jump-up"
      class="bg-transparent"
    >
      <!-- VER PEDIDOS CATHERING -->
      <q-tab-panel name="cathering" class="flex justify-center items-center">
        <div class="flex flex-col gap-2 justify-center items-center">
          <Item
            v-for="punto in estado.pedidosEntidad"
            :key="punto._id"
            :href="`listaPedidos/${punto._id}`"
            :title="punto.vendedor.nombre"
            class="w-[400px] max-sm:w-full"
            :title2="fechaDiaMes(punto.estado[0]?._creado)"
          >
            <template v-slot:actions>
              <div class="flex">
                <h1 class="text-orange-500 font-bold">
                  {{ punto.estadoItems }}
                </h1>
                <!-- <q-btn
                  dense
                  round
                  icon="edit"
                  flat
                  color="blue"
                  padding="4px"
                  size="12px"
                /> -->
                <q-btn
                  dense
                  round
                  icon="print"
                  flat
                  color="orange"
                  padding="4px"
                  size="12px"
                />
              </div>
            </template>
          </Item>
        </div>
      </q-tab-panel>

      <!-- VER HISTORIAL DE PEDIDOS -->
      <q-tab-panel name="historial">
        <div class="flex justify-center">
          <q-input
            dense
            filled
            readonly
            v-model="date"
            mask="date"
            :rules="['date']"
            class="w-[250px]"
            clearable
          >
            <template v-slot:append>
              <!-- <q-btn icon="check" label="OK" @click="onClick" /> -->
              <q-icon name="bi-calendar-day" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="date" :options="dateOption">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="flex flex-col gap-2 justify-center items-center">
          <h1 v-if="estado.pedidosFiltrados.length === 0">
            No hay pedido😯...
          </h1>
          <Item
            v-for="punto in estado.pedidosFiltrados"
            :key="punto._id"
            :href="`listaPedidos/${punto._id}`"
            :title="punto.comprador.nombre"
            class="w-[400px] max-sm:w-full"
            :title2="formateadorFecha(punto.estado[0]._creado)"
          >
            <template v-slot:actions>
              <div class="flex">
                <h1 class="text-orange-500 font-bold">
                  {{ punto.estadoItems }}
                </h1>
                <q-btn
                  dense
                  round
                  icon="print"
                  flat
                  color="orange"
                  padding="4px"
                  size="12px"
                />
              </div>
            </template>
          </Item>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import { listaPedidos } from '@/modulos/pedidos/infraestructura/listaPedidos/lista-pedidos.composable';
definePageMeta({
  layout: 'punto',
});

const { estado, buscarPedidos, filtroHistorial } = listaPedidos();

const tab = ref('cathering');
const date = ref(new Date().toLocaleDateString('en-CA').replace(/-/g, '/'));
const dateOption = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(date) <= today;
};

watch(date, (value) => {
  filtroHistorial(value);
});

onMounted(async () => {
  await buscarPedidos();
  filtroHistorial(new Date().toLocaleDateString('en-CA').replace(/-/g, '/'));
});
</script>
<style scoped>
.q-tab {
  padding: 0 10px;
  margin-bottom: 0px;
  /* border: 2px solid red; */
}
</style>
