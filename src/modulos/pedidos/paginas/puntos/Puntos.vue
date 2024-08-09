<template>
  <div class="w-full max-w-[400px] max-sm:w-[350px] mx-auto">
    <q-btn
      color="primary"
      label="prueba impresora"
      no-caps
      padding="2px 10px"
      @click="pruebaImpresora" />
    <div class="flex justify-between items-center mb-4">
      <h1 class="font-bold">Pedidos por Aceptar:</h1>

      <span class="flex gap-2" v-if="pedidoStore.pedidosSinAceptar.length > 0">
        <q-btn
          class="text-orange-500"
          icon="warning"
          dense
          size="11px"
          flat
          round
          @click="mostrarEntidadSinPedidos"
          ><q-tooltip class="no-print bg-gray-400-500"
            >Entidades sin pedidos</q-tooltip
          ></q-btn
        >
      </span>
    </div>
    <h1 v-if="pedidoStore.pedidosSinAceptar.length === 0">
      No hay pedidos😯...
    </h1>

    <Item
      v-for="punto in pedidoStore.pedidosSinAceptar"
      :key="punto._id"
      :title="punto.comprador.nombre"
      class="w-full max-sm:w-full"
      :href="`listaPedidos/${punto._id}`"
      :title2="formateadorFecha(punto.estado[0]?._creado)">
      <template v-slot:actions>
        <div class="flex">
          <q-btn
            dense
            round
            icon="print"
            flat
            color="orange"
            padding="4px"
            size="12px"
            class="no-print"
            @click="imprimir(punto)" />
        </div>
      </template>
    </Item>
    <h1 class="font-bold">Pedidos Aceptados:</h1>
    <h1 v-if="pedidoStore.pedidosAceptados.length === 0">
      No hay pedidos😯...
    </h1>
    <Item
      v-for="punto in pedidoStore.pedidosAceptados"
      :key="punto._id"
      :href="`listaPedidos/${punto._id}`"
      :title="punto.comprador?.nombre"
      class="w-[400px] max-sm:w-full"
      :title2="formateadorFecha(punto.estado[0]._creado)">
      <template v-slot:actions>
        <div class="flex">
          <h1 class="text-orange-500 font-bold">
            {{ punto.estadoItems }}
          </h1>
          <q-btn
            dense
            round
            icon="print"
            flat
            color="orange"
            padding="4px"
            size="12px"
            class="no-print"
            @click="imprimir(punto)"
            ><q-tooltip class="no-print bg-gray-400-500"
              >Imprimir pedido</q-tooltip
            ></q-btn
          >
        </div>
      </template>
    </Item>
  </div>
</template>

<script setup>
import { usePuntos } from './puntos.composable';
definePageMeta({
  layout: 'cathering'
});

const { estado, buscarPedidos, pedidoStore } = usePuntos();

onMounted(async () => {
  await buscarPedidos();
});
</script>
