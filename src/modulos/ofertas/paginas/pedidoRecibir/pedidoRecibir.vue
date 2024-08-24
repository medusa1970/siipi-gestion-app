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
import { pedidoRecibir } from './pedidoRecibir';
import { catalogoIds } from '@/modulos/ofertas/oferta.definicion';
const { store, authStore, route, router } = pedidoRecibir();

const catalogo = ref(null);
onMounted(async () => {
  const catalogoId = catalogoIds[route.params.area as string];
  if (!catalogoId) {
    goTo(router, '404');
  }
  if (catalogoId)
    loadingAsync(async () => {
      catalogo.value = await store.getCatalogoArbol(catalogoId, {
        completo: true
      });
    });
});
</script>
