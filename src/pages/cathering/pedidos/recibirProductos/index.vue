<template>
  <div>
    <h1 class="font-extrabold text-lg">Recibir productos</h1>
    <div class="flex gap-2 flex-wrap justify-center mt-2">
      <NuxtLink
        to="/cathering/pedidos/recibirProductos/85a4475e446a5885b05739c4"
        @click="() => (storePedido.areaPedidoID = '65a1a6c9566e40c934929a56')"
      >
        <q-btn color="primary" label="Proveedor" />
      </NuxtLink>
      <NuxtLink
        @click="() => (storePedido.areaPedidoID = '65a5a9af08c1a906d83522d1')"
        to="/cathering/pedidos/recibirProductos/65a4475e446a5885b05739c6"
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

// const handleRedirect = () => {
//   console.log('first');
//   storePedido.areaPedidoID = '65a1a6c9566e40c934929a56';
//   console.log(storePedido.areaPedidoID);

//   // showLoading();
//   // setTimeout(() => {
//   //   router.push('/cathering/pedidos/recibirProductos/65a4475e446a5885b05739c4');
//   //   hideLoading();
//   // }, 1000);
//   // storePedido.isDespachar = true;
// };
</script>
