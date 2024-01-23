<template>
  <div class="grid grid-cols-2 gap-5 mt-2">
    <div class="col-span-1" @click="() => push('cathering/empleados')">
      <Item title="Empleados" icon="group" />
    </div>
    <div class="col-span-1" @click="() => push('cathering/stock')">
      <Item title="Stock" icon="warehouse" color-icon="blue" />
    </div>
    <div class="col-span-1" @click="() => push('cathering/inventario')">
      <Item title="Inventario" icon="visibility" color-icon="brown" />
    </div>
    <div
      class="col-span-1"
      @click="() => push('cathering/inventario/listaProblemas')"
    >
      <Item
        title="Solucion Inventario"
        icon="bi-journal-text"
        color-icon="orange"
      />
    </div>
    <div class="col-span-1" @click="() => push('cathering/pedidos')">
      <Item title="Pedidos" icon="description" color-icon="teal" />
    </div>
    <div
      class="col-span-1"
      @click="() => push('cathering/pedidos/realizarPedido')"
    >
      <Item title="realizar pedido" icon="description" color-icon="teal" />
    </div>
    <div class="col-span-1" @click="() => push('cathering/pedidos/verPedido')">
      <Item title="ver pedidos" icon="description" color-icon="red" />
    </div>
    <div class="col-span-1" @click="() => push('cathering/caja')">
      <Item title="Caja" icon="point_of_sale" color-icon="green" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
const { push } = useRouter();
</script>
