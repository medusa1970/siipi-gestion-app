<template>
  <div class="flex justify-center items-center h-[92vh] backImage">
    <h1 class="text-lg font-bold">DIOS TE BENDIGA</h1>
  </div>
</template>
<script setup lang="ts">
import { useAuth } from '~/composables/auth/useAuth';
definePageMeta({
  middleware: ['auth'],
  layout: 'cathering',
});

const { checkPermisos } = useAuth();

if (!checkPermisos(['HACER_INVENTARIO'])) {
  console.log('no autorizado');
}
</script>
