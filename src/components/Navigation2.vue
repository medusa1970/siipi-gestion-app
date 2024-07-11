<template>
  <div :style="'background: ' + props.color">
    <q-breadcrumbs id="navigacion">
      <q-breadcrumbs-el icon="home" :to="getRoute(router, 'cathering')" />
      <q-breadcrumbs-el
        v-for="nivel in nav"
        :label="nivel.label"
        :icon="nivel.icon ?? undefined"
        :to="getRoute(router, nivel.to, nivel.params)"
      />
    </q-breadcrumbs>
  </div>
  <h1 v-if="titulo" id="tituloPagina">{{ titulo }}</h1>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';
import { useRouter } from 'vue-router';
const router = useRouter();

const props = withDefaults(
  defineProps<{
    color?: string;
    titulo?: string;
    nav: {
      label?: string;
      icon?: string;
      to?: string;
      params?: any;
    }[];
  }>(),
  { color: 'orange' },
);

const authStore = useAuthStore();
const path = `/${authStore.negocio?.tipo.toLowerCase()}`;
</script>

<style scoped>
#navigacion .q-icon {
  color: white;
}
#navigacion * {
  color: white;
}
#navigacion {
  color: white;
  font-size: 15px;
  padding-left: 15px;
  margin: 0;
}
</style>
