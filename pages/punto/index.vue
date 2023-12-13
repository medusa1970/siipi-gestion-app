<template>
  <div class="grid grid-cols-2 gap-5 mt-2">
    <div class="col-span-1" @click="() => push('punto/empleados')">
      <Item title="Empleados" icon="group" />
    </div>
    <div class="col-span-1" @click="() => push('punto/menu')">
      <Item title="Menu" icon="fact_check" color-icon="red" />
    </div>
    <div class="col-span-1" @click="() => push('punto/stock')">
      <Item title="Stock" icon="warehouse" color-icon="blue" />
    </div>
    <div class="col-span-1" @click="() => push('punto/inventario')">
      <Item title="Inventario" icon="visibility" color-icon="brown" />
    </div>
    <div
      class="col-span-1"
      @click="() => push('punto/inventario/listaProblemas')"
    >
      <Item
        title="Solucion Inventario"
        icon="bi-journal-text"
        color-icon="orange"
      />
    </div>
    <div class="col-span-1" @click="() => push('punto/pedidos')">
      <Item title="Pedidos" icon="description" color-icon="teal" />
    </div>
    <div class="col-span-1" @click="() => push('punto/caja')">
      <Item title="Caja" icon="point_of_sale" color-icon="green" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
const { push } = useRouter();
definePageMeta({
  middleware: ['auth']
});
</script>
