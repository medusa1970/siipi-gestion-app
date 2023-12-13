<template>
  <q-breadcrumbs style="font-size: 15px">
    <q-breadcrumbs-el icon="home" :to="path" />
    <q-breadcrumbs-el :label="label" :icon="icon" :href="href" />
    <q-breadcrumbs-el v-if="label2" :label="label2" :icon="icon2" :to="href2" />
  </q-breadcrumbs>
  <br />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { authStore } from '@/stores/auth.store';
defineProps({
  label: String,
  icon: String,
  href: String,
  label2: String,
  icon2: String,
  href2: String
});

const useAuth = authStore();
// const route = useRoute();
// console.log(useAuth.negocioTipoSelected.toLowerCase());
// const path = route.path.substring(0, route.path.lastIndexOf('/'));
const path = `/${useAuth.negocioTipoSelected.toLowerCase()}`;
// console.log(route.path);
// console.log(path);
</script>
