<template>
  <q-dialog persistent>
    <q-card :style="cardBig ? 'width: 450px' : 'width: 380px'" class="p-3">
      <div class="flex justify-between">
        <h1 class="text-lg font-bold">{{ title }}</h1>
        <q-btn
          v-if="closeManual"
          icon="close"
          flat
          round
          dense
          @click="handleClose"
        />
        <q-btn
          v-else
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

<script setup lang="ts">
// Usar una declaración basada en tipos para definir props y valores predeterminados
const props = withDefaults(
  defineProps<{
    title?: string;
    handleSubmit?: () => void;
    handleClose?: () => void;
    cardBig?: boolean;
    labelBtn?: string;
    noBtn?: boolean;
    closeManual?: boolean;
  }>(),
  {
    title: "",
    cardBig: false,
    labelBtn: "",
    noBtn: false,
    closeManual: false,
    handleClose: () => {},
    handleSubmit: () => {},
  }
);
</script>

<!-- <template>
  <q-dialog persistent>
    <q-card :style="cardBig ? 'width: 450px' : 'width: 380px'" class="p-3">
      <h1 class="text-lg font-bold">{{ title }}</h1>
      <q-btn
        icon="close"
        flat
        round
        dense
        v-close-popup
        class="border-2 border-red-500"
      />
    </q-card>
    
    <q-card :style="cardBig ? 'width: 450px' : 'width: 380px'" class="p-3">
      <slot key="inputsDialog"></slot>
    </q-card>

    <q-card :style="cardBig ? 'width: 450px' : 'width: 380px'" class="p-3">
      <q-form @submit="handleSubmit" class="my-1">
        <div class="my-1"></div>
        <div class="flex row justify-center">
          <q-btn
            class="mt-2 mb-1"
            no-caps
            style="font-size: 15px"
            padding="4px 10px"
            label="Guardar"
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
  nameDialog: String,
  handleSubmit: Function,
  cardBig: Boolean,
});
</script> -->
