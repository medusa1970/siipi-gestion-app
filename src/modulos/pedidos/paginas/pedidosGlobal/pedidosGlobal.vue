<template>
  <NuxtLayout name="cathering"> <div>pedidos globales</div></NuxtLayout>
</template>

<script setup>
provide("infoPagina", {
  titulo: "Pedidos global",
  camino: [{ label: "Pedidos global", to: "pedidosGlobal" }],
});
</script>
