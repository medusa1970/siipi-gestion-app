<template>
  <div :style="'background: ' + props.color" class="flex justify-between p-1">
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
  <div class="flex justify-center mt-2">
    <h1 class="!m-0 pr-3 font-extrabold" v-if="titulo" id="tituloPagina">
      {{ titulo }}
    </h1>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/modulos/main/useAuthStore';
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
~/modulos/main/useAuthStore
