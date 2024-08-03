<template>
  <NuxtLayout name="cathering">
    <div
      class="flex justify-center items-center backImage"
      style="height: 500px"
    >
      <h1 class="text-lg font-bold">DIOS TE BENDIGA</h1>
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
provide("infoPagina", {
  titulo: "Bienvenido",
  camino: [{ label: "bienvenido", to: "cathering" }],
});
</script>
