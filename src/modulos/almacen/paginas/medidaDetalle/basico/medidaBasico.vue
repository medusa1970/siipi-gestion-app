<template>
  <!-- @vue-ignore -->
  <formMedida
    v-show="store.medida"
    :edicion="store.medida"
    :key="store.medida"
    @modificarObjeto="handleMedidaModificada"
  />
</template>

<script setup lang="ts">
import { useMedidaBasico } from "./medidaBasico.composable";
const { estado, authStore, store, router, handleMedidaModificada } =
  useMedidaBasico();
import formMedida from "@/modulos/almacen/forms/formMedida.vue";
</script>
