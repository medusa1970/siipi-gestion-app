<template>
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
</script>

<style lang="scss" scoped></style>
