<template>
  <q-breadcrumbs style="font-size: 15px; margin-bottom: 5px">
    <q-breadcrumbs-el icon="home" :to="path" />
    <q-breadcrumbs-el v-if="label" :label="label" :icon="icon" :to="href" />
    <q-breadcrumbs-el v-if="label2" :label="label2" :icon="icon2" :to="href2" />
  </q-breadcrumbs>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';

defineProps({
  label: String,
  icon: String,
  href: String,
  label2: String,
  icon2: String,
  href2: String,
});

// const route = useRoute();
// const path = route.path.substring(0, route.path.lastIndexOf('/'));

const authStore = useAuthStore();
const path = `/${authStore.negocio?.tipo.toLowerCase()}`;
</script>
