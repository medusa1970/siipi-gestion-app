<template>
  <formProductoBasico
    v-show="productoCorriente"
    :edicion="productoCorriente"
    :key="productoCorriente"
    @modificarObjeto="handleProductoModificado" />
</template>

<script setup lang="ts">
import formProductoBasico from '@/modulos/almacen/forms/formProductoBasico.vue';
const props = defineProps({
  productoCorriente: null
});
const handleProductoModificado = producto => {
  NotifySucessCenter('Producto modificado correctamente');
  // store.productos.producot = producto ?
};
</script>

<style lang="scss" scoped></style>
