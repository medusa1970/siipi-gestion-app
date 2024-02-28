<template>
  <q-item clickable v-ripple class="border-[1px] bg-white py-1" dense>
    <!-- <q-item-section avatar top>
      <q-avatar :icon="icon" :color="colorIcon" text-color="white" />
    </q-item-section> -->

    <q-item-section>
      <h1 class="capitalize">{{ title }}</h1>
      <p class="italic text-xs" v-if="title2">({{ title2 }})</p>
      <!-- <q-item-label class="font-bold uppercase">{{ title }}</q-item-label> -->
      <!-- <q-item-label caption>February 22nd, 2019</q-item-label> -->
    </q-item-section>

    <q-item-section side>
      <!-- <q-icon name="chevron_right " color="green" /> -->
      <slot name="actions" />
    </q-item-section>
  </q-item>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  title2: String,
  icon: {
    type: String,
    default: 'folder',
  },
  colorIcon: {
    type: String,
    default: 'primary',
  },
});
</script>

<style lang="scss" scoped></style>
