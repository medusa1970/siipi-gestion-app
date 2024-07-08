<template>
  <q-dialog persistent>
    <q-card :style="cardBig ? 'width: 450px' : 'width: 380px'" class="p-3">
      <div class="flex justify-between">
        <h1 class="text-lg font-bold">{{ title }}</h1>
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          class="border-2 border-red-500"
        />
      </div>
      <!-- <q-space /> -->
      <q-form @submit.prevent="handleSubmit">
        <div class="my-1">
          <slot name="inputsDialog"></slot>
        </div>
        <div v-if="noBtn === false" class="flex row justify-center">
          <q-btn
            class="mt-2 mb-1"
            no-caps
            style="font-size: 15px"
            padding="4px 10px"
            :label="labelBtn"
            color="secondary"
            type="submit"
          ></q-btn>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps({
  title: String,
  handleSubmit: Function,
  cardBig: Boolean,
  labelBtn: String,
  noBtn: Boolean,
});
</script>
