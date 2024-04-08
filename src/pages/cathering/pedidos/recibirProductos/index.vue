<template>
  <div>
    <h1 class="font-extrabold text-lg">Recibir productosss</h1>
    <div class="flex gap-2 flex-wrap justify-center mt-2">
      <NuxtLink
        href="/cathering/pedidos/recibirProductos/65a4475e446a5885b05739c4"
      >
        <q-btn color="primary" label="Proveedor" />
      </NuxtLink>
      <NuxtLink
        href="/cathering/pedidos/recibirProductos/65a4475e446a5885b05739c6"
      >
        <q-btn color="green" label="Panaderia" />
      </NuxtLink>
      <NuxtLink
        href="/cathering/pedidos/recibirProductos/66101ce13e9dea0b967b40fd"
      >
        <q-btn color="orange" label="Reposteria" />
      </NuxtLink>
      <NuxtLink
        href="/cathering/pedidos/recibirProductos/66101e1499cbfcfbe0650ee5"
      >
        <q-btn color="primary" label="Siimple" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'cathering',
});
</script>
