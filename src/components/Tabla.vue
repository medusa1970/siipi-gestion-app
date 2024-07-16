<template>
  <q-table
    flat
    :rows="rows"
    :rowKey="rowKey"
    :columns="columns"
    :defaultImage="defaultImage"
    :filter="filter"
    class="border-none"
    virtual-scroll
    :rows-per-page-options="[30]"
    style="max-height: 600px; overflow-y: auto"
  >
    <template #top>
      <!-- slot para el boton de agregar -->
      <slot name="dropdown" />

      <!-- filtro de busqueda -->
      <div v-if="conBusqueda">
        <q-input
          v-model="filter"
          borderless
          dense
          debounce="300"
          color="secondary"
          style="padding: 0 10px"
          placeholder="Buscar"
          clearable
          class="w-search border-[1px] rounded-sm border-[#010f1a] hover:shadow-[0_0_5px_#010f1a] mr-3"
        >
          <template v-slot:prepend>
            <q-icon name="search" size="22px" class="text-[#010f1a]" />
          </template>
        </q-input>
      </div>
    </template>
    <template #body="props">
      <q-tr :props="props" @click="props.expand = !props.expand">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <div v-if="col.slot">
            <slot
              :name="`body-cell-${col.name}`"
              :val="col.value"
              :row="props.row"
            />
          </div>
          <div v-else-if="col.imagen">
            <q-img
              :src="col.value ?? defaultImage"
              spinner-color="black"
              class="cell-image"
            />
          </div>
          <div v-else>
            {{ col.value }}
          </div>
        </q-td>
      </q-tr>
      <q-tr v-show="!disableExpand && props.expand" :props="props">
        <q-td colspan="100%">
          <slot name="body-expand" :row="props.row" />
        </q-td>
      </q-tr>
    </template>
  </q-table>
  {{ props.disableExpand }} {{ foo }}
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ProductoImage from '@/assets/img/producto.png';
const filter = ref('');
const rs = ref('');
const props = withDefaults(
  defineProps<{
    rows: Array<any>;
    columns: Array<any>;
    defaultImage: any;
    rowKey: string;
    conBusqueda: boolean;
    watchFilter: string;
    titulo: string;
    disableExpand: boolean;
  }>(),
  {
    defaultImage: ProductoImage,
    rowKey: '_id',
    watchFilter: '',
    conBusqueda: false,
    titulo: '',
    disableExpand: false,
  },
);
watch(
  () => props.watchFilter,
  () => {
    filter.value = props.watchFilter;
  },
  { immediate: false },
);
</script>

<style>
.q-table tbody tr:nth-child(odd) {
  --tw-bg-opacity: 1;
  background-color: rgb(243 244 246 / var(--tw-bg-opacity));
}
.cell-image {
  width: 50px;
  height: 50px;
  border-radius: 20%;
}
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  text-align: center;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  white-space: nowrap; /* Prevent text from wrapping onto new lines */
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
</style>
