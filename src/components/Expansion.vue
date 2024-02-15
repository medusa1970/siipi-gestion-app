<template>
  <q-list bordered class="rounded-borders">
    <q-expansion-item>
      <template v-slot:header>
        <q-item-section avatar v-if="icon">
          <q-avatar :icon="icon" :color="color" text-color="white" />
        </q-item-section>
        <q-item-section class="font-semibold text-lg">
          {{ title }}</q-item-section
        >
        <q-item-section side>
          <h1>data adicional</h1>
          <!-- <div class="row items-center">
            <q-icon name="star" color="red" size="24px" />
            <q-icon name="star" color="red" size="24px" />
            <q-icon name="star" color="red" size="24px" />
          </div> -->
        </q-item-section>
      </template>

      <q-card>
        <q-card-section>
          <slot name="contenido"></slot>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>
</template>
<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: String,
  color: String,
});
</script>
