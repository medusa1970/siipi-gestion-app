<template>
  <div>
    <q-tabs v-model="tab" inline-label no-caps>
      <q-tab name="proveedor" icon="bi-cart4" label="Pedidos Proveedor" />
      <q-tab name="puntos" icon="bi-box-seam" label="Pedidos Puntos" />
      <q-tab name="historial" icon="bi-calendar-date" label="Historial" />
    </q-tabs>
    <q-tab-panels
      v-model="tab"
      animated
      transition-prev="jump-up"
      transition-next="jump-up"
    >
      <q-tab-panel name="proveedor">
        <div class="text-h6">COMPRA</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
      <q-tab-panel name="puntos">
        <div class="text-h6 text-center mb-4">
          PUNTOS QUE REALIZARON SUS PEDIDOS
        </div>
        <div class="flex flex-col gap-2 justify-center items-center">
          <Item
            :title="punto.nombre"
            v-for="punto in puntos"
            class="w-[500px]"
            :key="punto"
          >
            <template v-slot:actions>
              <div class="flex gap-1">
                <q-btn
                  flat
                  dense
                  round
                  icon="check"
                  class="bg-green-500 text-white"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  class="bg-primary text-white"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="print"
                  class="bg-orange-500 text-white"
                />
              </div>
            </template>
          </Item>
        </div>
      </q-tab-panel>
      <q-tab-panel name="historial">
        <div class="flex justify-center">
          <q-input
            filled
            v-model="date"
            mask="date"
            :rules="['date']"
            class="w-[300px]"
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
import { ref } from 'vue';
import puntos from '@/mocks/puntos.json';

const tab = ref('proveedor');
const date = ref('2020/07/08');
</script>
