<template>
  <div class="grid grid-cols-2 gap-5 mt-2">
    <NuxtLink class="col-span-1" to="punto/empleados">
      <Item title="Empleados" icon="group" />
    </NuxtLink>
    <NuxtLink class="col-span-1" to="punto/menu">
      <Item title="Menu" icon="fact_check" color-icon="red" />
    </NuxtLink>
    <NuxtLink class="col-span-1" to="punto/stock">
      <Item title="Stock" icon="warehouse" color-icon="blue" />
    </NuxtLink>
    <NuxtLink class="col-span-1" to="punto/inventario">
      <Item title="Inventario" icon="visibility" color-icon="brown" />
    </NuxtLink>
    <NuxtLink class="col-span-1" to="punto/inventario/listaProblemas">
      <Item
        title="Solucion Inventario"
        icon="bi-journal-text"
        color-icon="orange"
      />
    </NuxtLink>
    <NuxtLink class="col-span-1" to="punto/pedidos/realizarPedido">
      <Item title="realizar pedido" icon="description" color-icon="teal" />
    </NuxtLink>
    <NuxtLink class="col-span-1" to="punto/pedidos/verPedido">
      <Item title="ver pedidos" icon="description" color-icon="red" />
    </NuxtLink>
    <NuxtLink class="col-span-1" to="punto/pedidos/historialPedidos">
      <Item title="historial de pedidos" icon="description" color-icon="blue" />
    </NuxtLink>
    <NuxtLink class="col-span-1" to="punto/caja">
      <Item title="Caja" icon="point_of_sale" color-icon="green" />
    </NuxtLink>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
const { push } = useRouter();
definePageMeta({
  middleware: ['auth'],
});
</script>
