<template>
  <NuxtLayout
    :name="authStore.getNegocio.tipo === 'PUNTO' ? 'punto' : 'cathering'"
    :titulo="'Pedido'"
    :navegacion="[{ label: 'Realizar pedido', to: 'pedido' }]">
    <formPedido
      :catalogo="catalogo"
      :comprador="authStore.getNegocio._id"
      vendedor="65a5a9af08c1a906d83522d0"
      :key="catalogo?._id" />
    <!-- @ok="handlePedidoOk" @error="handlePedidoError"  -->
  </NuxtLayout>
</template>

<script setup lang="ts">
import formPedido from '@/modulos/ofertas/forms/formPedido.vue';
import { pedidoDespachar } from './pedidoDespachar';
const { authStore, handlePedidoOk, handlePedidoError } = pedidoDespachar();

const catalogo = ref(null);
onMounted(async () => {
  try {
    loadingAsync(async () => {
      catalogo.value = await buscarUno(GqlEntidadLeerMenuCompleto, {
        busqueda: authStore.negocio._id
      });
    });
  } catch (err) {
    errFailback(err);
  }
});
</script>
