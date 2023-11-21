<template>
  <div class="grid grid-cols-2 gap-5 mt-2">
    <div class="col-span-1" @click="() => push('sede/empleados')">
      <Item title="Empleados" icon="group" />
    </div>
    <div class="col-span-1" @click="() => push('sede/productos')">
      <Item title="Productos" icon="list_alt" color-icon="green" />
    </div>
    <div class="col-span-1" @click="() => push('sede/empleados')">
      <Item title="Finanzas" icon="monetization_on" color-icon="red" />
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
const { push } = useRouter();
</script>
