<template>
  <q-item clickable v-ripple class="border-[1px] bg-white">
    <q-item-section avatar top>
      <q-avatar :icon="icon" :color="colorIcon" text-color="white" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="font-bold text-lg">{{ title }}</q-item-label>
      <q-item-label caption>February 22nd, 2019</q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-icon name="chevron_right " color="green" />
    </q-item-section>
  </q-item>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'folder'
  },
  colorIcon: {
    type: String,
    default: 'primary'
  }
});
</script>

<style lang="scss" scoped></style>
