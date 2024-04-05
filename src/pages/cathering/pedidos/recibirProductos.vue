<template>
  <div>
    <h1 class="font-extrabold text-lg">Recibir productos</h1>
    <div class="flex gap-2 flex-wrap justify-center mt-2">
      <NuxtLink href="/cathering/pedidos/areas/recibirPanaderia">
        <q-btn color="primary" label="Proveedor" />
      </NuxtLink>
      <NuxtLink href="/cathering/pedidos/areas/recibirPanaderia">
        <q-btn color="green" label="Panaderia" />
      </NuxtLink>
      <NuxtLink href="/cathering/pedidos/areas/recibirPanaderia">
        <q-btn color="orange" label="Reposteria" />
      </NuxtLink>
      <NuxtLink href="/cathering/pedidos/areas/recibirPanaderia">
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
