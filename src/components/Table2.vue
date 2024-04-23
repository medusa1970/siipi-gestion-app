<template>
  <q-table
    flat
    bordered
    :rows="rows"
    :columns="columns"
    :filter="filter"
    :rows-per-page-options="[13, 26]"
    :dense="dense"
    class="border-none"
  >
    <!-- HEADER -->
    <template v-slot:top="">
      <div class="w-full grid grid-cols-8 mb-3">
        <div class="col-span-2">
          <slot name="slot-header1" />
        </div>
        <div class="col-span-4 max-sm:col-span-8">
          <q-input
            borderless
            dense
            debounce="300"
            color="secondary"
            v-model="filter"
            style="padding: 0 10px"
            placeholder="Buscar"
            clearable
            class="w-search border-[1px] rounded-sm border-[#010f1a] hover:shadow-[0_0_5px_#010f1a]"
          >
            <template v-slot:prepend>
              <q-icon name="search" size="22px" class="text-[#010f1a]" />
            </template>
          </q-input>
        </div>

        <div class="col-span-2 flex justify-center">
          <slot name="slot-header2" />
        </div>
        <div class="col-span-8 mt-3">
          <slot name="slot-footer" />
        </div>
      </div>
    </template>

    <!-- ACCIONES -->
    <template v-slot:body-cell-actions="props">
      <slot name="body-cell-actions" :props="props"></slot>
    </template>
    <!-- IMAGES -->
    <template v-slot:body-cell-foto="{ value }">
      <slot name="body-cell-image" :value="value"></slot>
    </template>
    <!-- BADGE -->
    <template v-if="badge" v-slot:body="props">
      <slot name="rows-badge" :props="props"></slot>
    </template>
  </q-table>
</template>

<script setup>
import { ref } from 'vue';
const filter = ref('');

defineProps({
  rows: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  dense: Boolean,
  badge: Boolean,
});
</script>
<style>
.q-table tbody tr:nth-child(odd) {
  --tw-bg-opacity: 1;
  background-color: rgb(243 244 246 / var(--tw-bg-opacity));
}
</style>
