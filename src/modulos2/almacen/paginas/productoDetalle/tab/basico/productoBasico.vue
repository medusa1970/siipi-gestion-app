<template>
  <crearProductoBasicoComp
    :edicion="store.producto"
    @modificar:producto="handleProductoModificado"
  />
</template>

<script setup>
import crearProductoBasicoComp from '@/modulos2/almacen/forms/formProductoBasico.vue';
import { useProductoBasico } from './productoBasico.composable';
const { store } = useProductoBasico();

const handleProductoModificado = (producto) => {
  NotifySucessCenter('Producto modificado correctamente');
};
</script>

<style lang="scss" scoped></style>
