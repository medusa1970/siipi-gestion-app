<template>
  <div class="grid grid-cols-2 gap-5 mt-2">
    <!-- <NuxtLink class="col-span-1" to="marca/empleados">
        <Item title="Empleados" icon="group" />
      </NuxtLink> -->
    <NuxtLink class="col-span-1" to="marca/ofertas">
      <Item title="Ofertas" icon="list_alt" color-icon="orange" />
    </NuxtLink>
    <NuxtLink class="col-span-1" to="marca/catalogos">
      <Item title="Gestion de catalogos" icon="list_alt" color-icon="orange" />
    </NuxtLink>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const { push } = useRouter();
definePageMeta({
  middleware: 'auth',
});
</script>
