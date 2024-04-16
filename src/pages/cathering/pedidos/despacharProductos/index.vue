<template>
  <div>
    <h1 class="font-extrabold text-lg">Despachar productos</h1>
    <div class="flex gap-2 flex-wrap justify-center mt-2">
      <NuxtLink
        to="/cathering/pedidos/despacharProductos/661005cc5b32687efb0f6483"
        @click="() => (storePedido.areaPedidoID = '65a5a9af08c1a906d83522d1')"
      >
        <q-btn color="green" label="Panaderia" />
      </NuxtLink>
      <NuxtLink
        to="/cathering/pedidos/despacharProductos/65a44754446a5885b05739c7"
        @click="() => (storePedido.areaPedidoID = '65a5a9af08c1a906d83522d3')"
      >
        <q-btn color="orange" label="Reposteria" />
      </NuxtLink>
      <NuxtLink
        to="/cathering/pedidos/despacharProductos/66101e5174ef16d9398df9ba"
        @click="() => (storePedido.areaPedidoID = '65a5a9af08c1a906d83522d2')"
      >
        <q-btn color="primary" label="Siimple" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { pedidoStore } from '@/stores/pedido.store';
definePageMeta({
  layout: 'cathering',
});

const storePedido = pedidoStore();
onMounted(() => {
  storePedido.isDespachar = true;
});
</script>
