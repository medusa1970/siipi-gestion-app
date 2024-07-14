<template>
  <div>
    <p>Lista de ofertas con este producto:</p>
  </div>
</template>

<script setup lang="ts">
import { useDetalleOfertas } from './ofertas.composable';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useAuthStore } from '@/modulos/main/negocio/useAuthStore';
const { store, estado, service } = useDetalleOfertas();
const router = useRouter();
const authStore = useAuthStore();

// Verificacion de permisos
if (!authStore.checkPermisos(['ALMACEN', 'ADQUISICION', 'TODO'])) {
  console.log('No tiene el acceso para esta pagina');
}
const soloAlmacen = ref(authStore.checkPermisos(['ALMACEN']));
const soloAdquisicion = ref(authStore.checkPermisos(['ADQUISICION']));
const soloAlmacenAdquisicion = ref(
  authStore.checkPermisos(['ADQUISICION', 'ALMACEN']),
);

// si no hay producto, pagina equivocada y volvemos a lalista
if (!store.producto) {
  goTo(router, 'productos');
}
</script>

<style lang="scss" scoped></style>
