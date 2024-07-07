<template>
  <q-table
    flat
    :rows="rows"
    row-key="key"
    :columns="columns"
    :defaultImage="defaultImage"
    :filter="filter"
    class="border-none"
  >
    <template #top>
      <q-input
        v-model="filter2"
        borderless
        dense
        debounce="300"
        color="secondary"
        style="padding: 0 10px"
        placeholder="Buscar"
        clearable
        class="w-search border-[1px] rounded-sm border-[#010f1a] hover:shadow-[0_0_5px_#010f1a]"
      >
        <template v-slot:prepend>
          <q-icon name="search" size="22px" class="text-[#010f1a]" />
        </template>
      </q-input>
    </template>
    <template #body="props">
      <q-tr :props="props" @click="props.expand = !props.expand">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <div v-if="col.slot">
            <slot :name="`body-cell-${col.name}`" :row="props.row" />
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
      <q-tr v-show="props.expand" :props="props">
        <q-td colspan="100%">
          <slot name="body-expand" :row="props.row" />
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <div v-show="false">{{ filter }}</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ProductoImage from '@/assets/img/producto.png';
const filter = ref('');
const filter2 = ref('');
watch(
  () => filter2.value,
  () => {
    filter.value = filter2.value;
  },
);
const props = withDefaults(
  defineProps<{
    rows: Array<any>;
    columns: Array<any>;
    defaultImage: any;
  }>(),
  {
    defaultImage: ProductoImage,
  },
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
</style>
