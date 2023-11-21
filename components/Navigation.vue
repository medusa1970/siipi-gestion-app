<template>
  <q-breadcrumbs style="font-size: 15px">
    <q-breadcrumbs-el icon="home" :to="path" />
    <q-breadcrumbs-el :label="label" :icon="icon" />
    <q-breadcrumbs-el v-if="label2" :label="label2" :icon="icon2" :to="href2" />
  </q-breadcrumbs>
  <br />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
defineProps({
  label: String,
  icon: String,
  label2: String,
  icon2: String,
  href2: String
});

const route = useRoute();
const path = route.path.substring(0, route.path.lastIndexOf('/'));
</script>
