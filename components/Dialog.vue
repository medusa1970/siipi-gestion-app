<template>
  <q-dialog>
    <q-card style="width: 380px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-xl font-semibold">{{ title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <slot name="inputsDialog"></slot>
      </q-card-section>
      <q-card-section class="row justify-center">
        <q-btn
          no-caps
          style="font-size: 15px; margin-bottom: 10px"
          label="Guardar"
          color="secondary"
          type="submit"
          @click="handleSubmit"
        ></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps({
  title: String,
  nameDialog: String,
  handleSubmit: Function
});
</script>

<style lang="scss" scoped></style>
