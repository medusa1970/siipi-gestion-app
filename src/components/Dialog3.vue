<template>
  <q-dialog v-model="alert">
    <q-card>
      <q-card-section>
        <div class="text-h6">Alert</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
        repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis
        perferendis totam, ea at omnis vel numquam exercitationem aut, natus
        minima, porro labore.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog persistent v-model="alert">
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
      <slot key="inputsDialog"></slot>

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
