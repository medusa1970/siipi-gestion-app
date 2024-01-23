<template>
  <q-item clickable v-ripple class="border-[1px] bg-white">
    <q-item-section avatar top>
      <q-avatar :icon="icon" :color="colorIcon" text-color="white" />
    </q-item-section>

    <q-item-section>
      <h1 class="font-bold uppercase">{{ title }}</h1>
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
