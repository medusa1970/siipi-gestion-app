<template>
  <NuxtLayout
    :name="authStore.getNegocio.tipo === 'PUNTO' ? 'punto' : 'cathering'">
    <!-- <code>{{ estado.catalogo }}</code> -->
    <div class="block mx-auto w-[400px] max-sm:w-[350px]">
      <q-input
        borderless
        dense
        debounce="300"
        color="secondary"
        v-model="filter"
        style="padding: 0 10px"
        placeholder="Buscar"
        class="w-search border-[1px] rounded-sm border-[#010f1a] hover:shadow-[0_0_5px_#010f1a]">
        <template v-slot:prepend>
          <q-icon name="search" size="22px" class="text-[#010f1a]" />
        </template>
        <template v-slot:append>
          <q-icon name="close" @click="filter = ''" class="cursor-pointer" />
        </template>
      </q-input>
      <!-- #F0F0F0 -->

      <!-- RECORRIDO -->
      <div class="flex gap-2 justify-center my-2">
        <div
          class="cursor-pointer"
          v-for="catalogo in estado.catalogo"
          :key="catalogo._id">
          <h1
            @click="selectCatalogo(catalogo)"
            :class="[
              'bg-[#F0F0F0] p-2',
              estado.catalogoSeleccionado.nombre === catalogo.nombre &&
                'font-bold'
            ]">
            {{ catalogo.nombre }}
          </h1>
        </div>
      </div>
      <!-- <code>{{ estado.catalogoSeleccionado }}</code> -->
      <q-list v-if="estado.searchResults" class="flex flex-col gap-1">
        <div v-for="item in estado.searchResults" :key="item._id">
          <q-card class="p-3">
            <div
              v-for="item in item.ofertas"
              :key="item._id"
              class="grid grid-cols-[70px_1fr_auto] gap-2">
              <div>
                <input
                  type="number"
                  class="w-full test border-[1px] border-gray-400 px-2 py-1 outline-none bg-transparent"
                  @input="handleInputChange2($event, item)"
                  min="0" />
              </div>

              <h1>{{ item.nombre }}</h1>
            </div>

            <h1 v-if="item.ofertas.length == 0">No hay producto.</h1>
          </q-card>
        </div>
      </q-list>
      <div v-if="estado.searchResults.length === 0">No hay producto..</div>
    </div>
  </NuxtLayout>
</template>

<script setup>
provide('infoPagina', {
  infoPagina: {
    titulo: 'Despachar pedido',
    camino: [{ label: 'Despachar pedido', to: 'despacharPedidos' }]
  }
});
import { useDespacharPedidos } from './despacharPedidos.composable';
import { storePedido } from '@/modulos/pedidos/pedidos.store';

const { estado, store, authStore } = useDespacharPedidos();
const pedidoStore = storePedido();

const selectCatalogo = catalogo => {
  estado.catalogoSeleccionado = catalogo;
  estado.searchResults = [catalogo];
};

const handleInputChange2 = (event, product) => {
  event.target.value = Math.max(0, event.target.value);
  const nuevoValor = event.target.value;

  const producto = {
    id: product._id,
    nombre: product.nombre,
    cantidad: nuevoValor
  };

  const index = pedidoStore.listaPedido.findIndex(
    item => item.id === producto.id
  );

  if (index > -1) {
    pedidoStore.listaPedido[index].cantidad = nuevoValor;
  } else {
    pedidoStore.listaPedido.push(producto);
  }
  // console.log(pedidoStore);
};
// onBeforeMount(async () => {
//   console.log('first');
//   store.catalogoArbol = await store.getCatalogoArbol();
// });
</script>
