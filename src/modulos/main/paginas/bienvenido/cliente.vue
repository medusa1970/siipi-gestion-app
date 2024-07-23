<template>
  <div class="flex justify-center items-center backImage" style="height: 500px">
    <h1 class="text-lg font-bold">DIOS TE BENDIGA, CLIENTE</h1>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'cliente',
});
</script>
