<template>
  <q-table
    flat
    bordered
    :rows="rows"
    :columns="columns"
    :filter="filter"
    :rows-per-page-options="[10, 20]"
    :dense="dense"
    class="border-none"
  >
    <!-- HEADER -->
    <template v-slot:top-right="props">
      <q-input
        v-if="$q.platform.is.desktop"
        class="no-print"
        borderless
        dense
        debounce="300"
        color="secondary"
        v-model="filter"
        style="
          margin: 10px 0;
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
            size="22px"
          />
        </template>
        <template v-slot:prepend>
          <q-icon name="search" size="22px" />
        </template>
      </q-input>
      <q-input
        v-if="$q.platform.is.mobile"
        borderless
        dense
        v-model="filter"
        style="
          margin: 10px 0;
          border-bottom: 0.5px solid #757575;
          padding: 0px 7px;
          width: 150px;
        "
        placeholder="Buscar"
        clearable
      >
        <template v-slot:prepend>
          <q-icon name="search" size="22px" />
        </template>
      </q-input>

      <q-btn
        flat
        round
        dense
        :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
        @click="props.toggleFullscreen"
      />
    </template>

    <!-- DROPDDOWN -->
    <template v-slot:top-left>
      <slot name="select"></slot>
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
