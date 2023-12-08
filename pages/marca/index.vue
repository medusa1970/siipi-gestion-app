<template>
  <div class="grid grid-cols-2 gap-5 mt-2">
    <div class="col-span-1" @click="() => push('marca/empleados')">
      <Item title="Empleados" icon="group" />
    </div>
    <div class="col-span-1" @click="() => push('marca/ofertas')">
      <Item title="Ofertas" icon="list_alt" color-icon="orange" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const { push } = useRouter();
definePageMeta({
  middleware: 'auth'
});
</script>
