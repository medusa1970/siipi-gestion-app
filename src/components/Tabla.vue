<template>
  <q-table
    id="foo"
    flat
    :rows="rows"
    :rowKey="rowKey"
    :columns="columns"
    :defaultImage="defaultImage"
    :filter="filter"
    class="border-none"
    virtual-scroll
    :rows-per-page-options="[30]"
    style="max-height: 82.5vh; overflow-y: auto"
  >
    <template #top>
      <slot name="dropdown" />
    </template>
    <template #body="props">
      <q-tr
        :class="1 == props.rowIndex % 2 ? 'odd' : 'even'"
        :props="props"
        @click="props.expand = !props.expand"
      >
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
      <q-tr
        :class="1 == props.rowIndex % 2 ? 'expand odd' : 'expand even'"
        v-show="!disableExpand && props.expand"
        :props="props"
      >
        <q-td colspan="100%">
          <slot name="body-expand" :row="props.row" />
        </q-td>
      </q-tr>
    </template>
  </q-table>
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

.q-table th {
  background-color: #777;
  color: white;
}
.q-table tr.odd {
  background-color: #e7e9eb;
}
.q-table tr.even {
  background-color: #fff;
  border: 2px solid blue;
}

/* .q-table tr.expand.odd {
  background-color: #e7e9eb;
}
.q-table tr.expand.even {
  background-color: #fff;
} */
.q-table tr.expand .q-card {
  background-color: #f8f8f8;
}

/* QUASAR TABLE */
.q-table thead,
.q-table tr,
.q-table th,
.q-table td {
  border: none;
  /* @apply border-gray-400; */
}
.q-table {
  @apply border-t-[1px]
  /* border: 1px solid #f6921e; */
  /* @apply border-[1px] border-gray-200; */;
}
.q-table tr th {
  font-weight: bold;
  text-transform: uppercase;
}
</style>
