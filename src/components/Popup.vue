<template>
  <q-dialog>
    <q-card>
      <q-card-section class="flex justify-between">
        <div class="mt-2">{{ titulo }}</div>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <slot name="body" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    titulo: string;
  }>(),
  {
    titulo: '',
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
