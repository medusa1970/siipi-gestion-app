<template>
  <!-- @vue-ignore -->
  <formProductoBasico
    v-show="store.producto"
    :edicion="store.producto"
    :key="store.producto"
    @modificarObjeto="handleProductoModificado"
  />
</template>

<script setup lang="ts">
import formProductoBasico from "@/modulos/almacen/forms/formProductoBasico.vue";
import { useProductoBasico } from "./productoBasico.composable";
const { $socket } = useNuxtApp();
const { store, handleProductoModificado } = useProductoBasico();
</script>

<style lang="scss" scoped></style>
