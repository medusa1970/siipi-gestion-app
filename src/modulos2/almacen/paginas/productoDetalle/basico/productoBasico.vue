<template>
  <crearProductoBasicoComp
    :edicion="store.producto"
    @modificar:producto="handleProductoModificado"
  />
</template>

<script setup>
import crearProductoBasicoComp from '@/modulos2/almacen/forms/formProductoBasico.vue';
import { useProductoBasico } from './productoBasico.composable';
const { store, handleProductoModificado } = useProductoBasico();
</script>

<style lang="scss" scoped></style>
