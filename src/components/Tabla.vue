<template>
  <q-table
    flat
    :rows="rows"
    :rowKey="rowKey"
    :columns="columns"
    :footer="footer"
    :defaultImage="defaultImage"
    :filter="filter"
    :dense
    :rows-per-page-options="[30]">
    <template #top>
      <slot name="dropdown" />
    </template>
    <template #body="props">
      <q-tr
        :class="`${
          1 == props.rowIndex % 2 ? 'expand odd' : 'expand even'
        } q-virtual-scroll--with-prev`"
        :props="props"
        @click="props.expand = !props.expand">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <div v-if="col.slot">
            <slot
              :name="`body-cell-${col.name}`"
              :val="col.value"
              :row="props.row" />
          </div>
          <div v-else-if="col.imagen">
            <q-img
              :src="col.value ?? defaultImage"
              spinner-color="black"
              class="cell-image" />
          </div>
          <div v-else>
            {{ col.value }}
          </div>
        </q-td>
      </q-tr>
      <q-tr
        :class="1 == props.rowIndex % 2 ? 'expand odd' : 'expand even'"
        v-if="!disableExpand && props.expand"
        :props="props">
        <q-td colspan="100%">
          <slot name="body-expand" :row="props.row" />
        </q-td>
      </q-tr>
    </template>
    <template v-slot:bottom-row v-if="footer">
      <q-tr
        ><q-td v-for="cell in footer">{{ cell }} </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const filter = ref('');
const props = withDefaults(
  defineProps<{
    rows: Array<any>;
    columns: Array<any>;
    footer: Array<any>;
    defaultImage?: any;
    rowKey?: string;
    conBusqueda?: boolean;
    watchFilter?: string;
    titulo?: string;
    disableExpand?: boolean;
    dense?: boolean;
  }>(),
  {
    defaultImage: null,
    rowKey: '_id',
    watchFilter: '',
    conBusqueda: false,
    titulo: '',
    disableExpand: false,
    dense: false,
    footer: null
  }
);
watch(
  () => props.watchFilter,
  () => {
    filter.value = props.watchFilter;
  },
  { immediate: false }
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

.q-table {
  max-height: 82.5vh;
  overflow-y: auto;
  border: none;

  thead,
  tr,
  th,
  td {
    border: none;
  }
  thead {
    color: red;
    font-weight: bold;
    text-transform: uppercase;
    background: #888888;
    color: white;
  }
  tr {
    height: 10px !important;
  }
  tr.odd {
    background-color: #e7e9eb;
  }
  tr.even {
    background-color: #fff;
    border: 2px solid blue;
  }
  tr.expand .q-card {
    background-color: #f8f8f8;
  }
}
</style>
