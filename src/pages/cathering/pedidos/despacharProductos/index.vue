<template>
  <div>
    <h1 class="font-extrabold text-lg">Despachar productos</h1>
    <div class="flex gap-2 flex-wrap justify-center mt-2">
      <NuxtLink
        href="/cathering/pedidos/despacharProductos/661005cc5b32687efb0f6483"
      >
        <q-btn color="green" label="Panaderia" />
      </NuxtLink>
      <NuxtLink
        href="/cathering/pedidos/despacharProductos/65a44754446a5885b05739c7"
      >
        <q-btn color="orange" label="Reposteria" />
      </NuxtLink>
      <NuxtLink
        href="/cathering/pedidos/despacharProductos/66101e5174ef16d9398df9ba"
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
