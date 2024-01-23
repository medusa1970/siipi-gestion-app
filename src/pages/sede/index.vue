<template>
  <div class="grid grid-cols-2 gap-5 mt-2">
    <NuxtLink class="col-span-1" href="sede/empleados">
      <Item title="Empleados" icon="group" />
    </NuxtLink>
    <NuxtLink class="col-span-1" href="sede/productos">
      <Item title="Productos" icon="list_alt" color-icon="green" />
    </NuxtLink>
  </div>
</template>
<script setup>
definePageMeta({
  middleware: 'auth',
});
</script>
