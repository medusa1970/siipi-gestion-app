<template>
  <div class="flex justify-center items-center h-[80vh]">
    <h1 class="text-lg font-bold">DIOS TE BENDIGA</h1>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
const { push } = useRouter();
definePageMeta({
  middleware: ['auth'],
  layout: 'punto',
});
</script>
