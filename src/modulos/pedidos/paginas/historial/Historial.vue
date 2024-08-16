<template>
  <q-input
    dense
    filled
    readonly
    v-model="date"
    mask="date"
    :rules="['date']"
    class="w-[250px] !my-2"
    clearable>
    <template v-slot:append>
      <!-- <q-btn icon="check" label="OK" @click="onClick" /> -->
      <q-icon name="bi-calendar-day" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-model="date" :options="dateOption">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
  <div class="flex flex-col gap-2 justify-center items-center max-sm:w-[350px]">
    <h1 v-if="estado.pedidosFiltrados.length === 0">No hay pedido😯...</h1>
    <Item
      v-for="punto in estado.pedidosFiltrados"
      :key="punto._id"
      :href="`listaPedidos/${punto._id}`"
      :title="punto.comprador.nombre"
      class="w-[400px] max-sm:w-full"
      :title2="formateadorFecha(punto.estado[0]._creado)">
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
            size="12px" />
        </div>
      </template>
    </Item>
  </div>
</template>

<script setup>
import { useHistorial } from './historial.composable';

definePageMeta({
  layout: 'cathering'
});

const { estado, authStore, filtroHistorial } = useHistorial();

const date = ref(new Date().toLocaleDateString('en-CA').replace(/-/g, '/'));

watch(date, value => {
  filtroHistorial(value);
});
onMounted(async () => {
  // await buscarPedidos2();
  filtroHistorial(new Date().toLocaleDateString('en-CA').replace(/-/g, '/'));
});
</script>

<!-- <q-input
        dense
        filled
        readonly
        v-model="date"
        mask="date"
        :rules="['date']"
        class="w-[250px] !my-2"
        clearable>
        <template v-slot:append>
          <q-icon name="bi-calendar-day" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale">
              <q-date v-model="date" :options="dateOption">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <div
        class="flex flex-col gap-2 justify-center items-center max-sm:w-[350px]">
        <h1 v-if="estado.pedidosFiltrados.length === 0">No hay pedido😯...</h1>
        <Item
          v-for="punto in estado.pedidosFiltrados"
          :key="punto._id"
          :href="`listaPedidos/${punto._id}`"
          :title="punto.comprador.nombre"
          class="w-[400px] max-sm:w-full"
          :title2="formateadorFecha(punto.estado[0]._creado)">
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
                size="12px" />
            </div>
          </template>
        </Item>
      </div> -->
