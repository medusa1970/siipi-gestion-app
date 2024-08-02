<template>
  <Navigation2 :nav="[{ label: 'bienvenido', to: 'punto' }]" />
  <div class="flex justify-center items-center backImage" style="height: 500px">
    <h1 class="text-lg font-bold">DIOS TE BENDIGA, ADMINISTRADOR DE PUNTO !</h1>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
  layout: "punto",
});
</script>
