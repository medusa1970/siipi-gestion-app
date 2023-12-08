<template>
  <div>
    <Navigation label="Inventario" icon="folder" />
    <div class="grid grid-cols-2">
      <div class="flex justify-center items-start">
        <q-form class="shadow-md w-[340px] p-4 flex flex-col gap-3">
          <h1 class="text-center font-semibold text-lg">
            Inventario ProductoA
          </h1>
          <div class="row items-center" style="width: 100%">
            <q-select
              color="primary"
              v-model="inventario.presentacion"
              :options="presentacion"
              label="Seleccionar presentacion"
              option-label="label"
              style="width: 100%"
              use-input
              hide-selected
              fill-input
              dense
              outlined
            >
              <template v-slot:append>
                <q-icon
                  style="margin: 0"
                  name="close"
                  @click.stop.prevent="inventario.presentacion = ''"
                  class="cursor-pointer q-mr-md"
                />
              </template>
              <template v-slot:prepend>
                <q-icon name="bi-box-seam" />
              </template>
            </q-select>
          </div>
          <div class="w-full grid grid-cols-2 gap-3">
            <q-input
              v-model="inventario.fecha"
              type="text"
              label="Fecha vencimiento"
              outlined
              dense
            />
            <q-input
              v-model="inventario.cantidad"
              type="text"
              label="Cantidad"
              outlined
              dense
            />
          </div>
          <span v-if="showComment" class="flex gap-1">
            <h1 class="font-semibold">comentario:</h1>
            <p>{{ inventario.comentario }}</p>
          </span>
          <span class="flex justify-end">
            <q-btn
              label="Comentario"
              color="primary"
              dense
              no-caps
              class="px-3"
              flat
              @click="showComment = !showComment"
            /><q-btn
              label="Terminar"
              type="submit"
              color="primary"
              dense
              no-caps
              class="px-3"
            />
          </span>
          <q-input
            v-if="showComment"
            v-model="inventario.comentario"
            type="textarea"
            label="Inserte un Comentario"
            outlined
            dense
          />
        </q-form>
      </div>
      <div id="divParaImprimir" class="p-3 shadow-lg">
        <h1 class="font-bold text-lg text-center">INVENTARIO BLOQUE 'A'</h1>
        <div class="grid grid-cols-3 p-4 gap-3">
          <div v-for="inventario in Inventarios">
            <h1 class="font-semibold">{{ inventario.productName }}</h1>
            <div
              class="flex gap-2"
              v-for="presentacion in inventario.presentations"
            >
              <p>{{ presentacion.presentation }}:</p>
              <p>{{ presentacion.expiryDate }}</p>
              <p>{{ presentacion.quantity }} Unidades</p>
            </div>
          </div>
        </div>
        <span id="action" class="flex justify-end gap-3">
          <q-btn
            label="Imprimir"
            color="secondary"
            dense
            no-caps
            class="px-3"
            @click="printInventory()"
          />
          <q-btn label="Terminar" color="primary" dense no-caps class="px-3" />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Inventarios } from '@/mocks/data.json';

const inventario = ref({
  presentacion: '',
  fecha: '',
  cantidad: '',
  comentario: ''
});

const showComment = ref(false);
const presentacion = [
  { label: 'Kilo', value: 'kilo' },
  { label: 'Litro', value: 'litro' },
  { label: 'Unidad', value: 'unidad' }
];
const printInventory = () => {
  window.print();
};
</script>
<style>
@media print {
  body * {
    visibility: hidden;
  }
  #divParaImprimir,
  #divParaImprimir * {
    visibility: visible;
    #action {
      display: none;
    }
  }
  #divParaImprimir {
    position: absolute;
    left: 0;
    top: 10px;
  }
}
</style>
