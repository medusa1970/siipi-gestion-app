<template>
  <q-table
    class="my-sticky-header-table"
    flat
    bordered
    :rows="rows"
    :columns="columns"
    :filter="filter"
    table-header-style="text-transform: uppercase;"
    :rows-per-page-options="[10, 20, 50, 100]"
    table-class="q-mt-md"
  >
    <!-- HEADER -->
    <template v-slot:top-right>
      <q-input
        borderless
        dense
        debounce="300"
        color="secondary"
        v-model="filter"
        style="
          margin: 10px 0 10px 0px;
          border: 0.5px solid #757575;
          padding: 0 10px;
          width: 220px;
        "
        placeholder="Buscar"
      >
        <template v-slot:append>
          <q-icon
            name="close"
            @click.stop.prevent="filter = ''"
            class="cursor-pointer"
          />
        </template>
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>

    <!-- DROPDDOWN -->
    <template v-slot:top-left>
      <slot name="dropdown"></slot>
    </template>
    <!-- ACCIONES -->
    <template v-slot:body-cell-actions="props">
      <slot name="body-cell-actions" :props="props"></slot>
    </template>
    <!-- IMAGES -->
    <template v-slot:body-cell-image="{ value }">
      <slot name="body-cell-image" :value="value"></slot>
    </template>
  </q-table>
</template>

<script setup>
import { ref } from 'vue';
const filter = ref('');

defineProps({
  rows: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  }
});
</script>
