<template>
  <q-dialog>
    <q-card :style="`min-width: ${props.width > 0 ? props.width : 0}px`">
      <q-card-section class="bg-amber-500 p-2 flex justify-between">
        <div class="px-3 h-full text-white" style="font-size: 18px">
          {{ titulo }}
        </div>
        <q-btn
          icon="close"
          color="white"
          flat
          round
          dense
          size="sm"
          v-close-popup />
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
    width?: number;
  }>(),
  {
    width: 0
  }
);
</script>
