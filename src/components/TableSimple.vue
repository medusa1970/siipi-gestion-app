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
    <!-- <template v-slot:top-right="props">

      <q-btn
        flat
        round
        dense
        :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
        @click="props.toggleFullscreen"
      />
    </template> -->

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
import { ref } from "vue";
const filter = ref("");

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
<style scoped>
.q-table tbody tr:nth-child(odd) {
  --tw-bg-opacity: 1;
  background-color: white !important;
}
</style>
