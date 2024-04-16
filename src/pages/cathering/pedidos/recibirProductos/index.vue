<template>
  <div>
    <h1 class="font-extrabold text-lg">Recibir productos</h1>
    <div class="flex gap-2 flex-wrap justify-center mt-2">
      <NuxtLink
        href="/cathering/pedidos/recibirProductos/65a4475e446a5885b05739c4"
        @click="() => (storePedido.areaPedidoID = '65a1a6c9566e40c934929a56')"
      >
        <q-btn color="primary" label="Proveedor" />
      </NuxtLink>
      <NuxtLink
        to="/cathering/pedidos/recibirProductos/65a4475e446a5885b05739c6"
        @click="() => (storePedido.areaPedidoID = '65a5a9af08c1a906d83522d1')"
      >
        <q-btn color="green" label="Panaderia" />
      </NuxtLink>
      <NuxtLink
        href="/cathering/pedidos/recibirProductos/66101ce13e9dea0b967b40fd"
        @click="() => (storePedido.areaPedidoID = '65a5a9af08c1a906d83522d3')"
      >
        <q-btn color="orange" label="Reposteria" />
      </NuxtLink>
      <NuxtLink
        href="/cathering/pedidos/recibirProductos/66101e1499cbfcfbe0650ee5"
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
  storePedido.isDespachar = false;
});
</script>
