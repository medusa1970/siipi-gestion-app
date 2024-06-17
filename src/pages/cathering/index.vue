<template>
  <div class="flex justify-center items-center h-[92vh] backImage">
    <h1 class="text-lg font-bold">DIOS TE BENDIGA</h1>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'cathering',
});
const authStore = useAuthStore();
console.log(authStore.getUser);

// if (!authStore.checkPermisos(['HACER_INVENTARIO'])) {
//   console.log('no autorizado');
// }
</script>
