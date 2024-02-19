<template>
  <div>
    <q-tabs v-model="tab" inline-label no-caps dense>
      <q-tab name="cathering" icon="bi-cart4" label="Pedidos Cathering" />
      <q-tab name="historial" icon="bi-calendar-date" label="Historial" />
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
            :title="punto.nombre"
            v-for="punto in aceptados"
            class="w-[400px]"
            :key="punto"
          >
            <template v-slot:actions>
              <div class="flex">
                <h1 class="text-orange-500 font-bold">Preparando...</h1>
                <q-btn
                  dense
                  round
                  icon="edit"
                  flat
                  color="blue"
                  padding="4px"
                  size="12px"
                />
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
            v-model="date"
            mask="date"
            :rules="['date']"
            class="w-[250px]"
            clearable
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script setup>
definePageMeta({
  layout: 'punto',
});
import { ref } from 'vue';
import { aceptados } from '@/mocks/puntos.json';

const tab = ref('cathering');
const date = ref('2020/07/08');
</script>
