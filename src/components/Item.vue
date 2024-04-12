<template>
  <q-item
    clickable
    v-ripple
    class="border-[1px] p-0"
    dense
    style="margin: 6px 0px !important"
  >
    <!-- <q-item-section avatar top>
      <q-avatar :icon="icon" :color="colorIcon" text-color="white" />
    </q-item-section> -->

    <q-item-section class="py-1 px-2">
      <NuxtLink :href="href">
        <h1 class="capitalize">{{ title }}</h1>
        <p class="italic text-xs" v-if="title2">({{ title2 }})</p>
      </NuxtLink>
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
  href: String,
});
</script>

<style lang="scss" scoped></style>
