<template>
  <NuxtLayout name="punto">
    <!-- :name="authStore.getNegocio.tipo === 'PUNTO' ? 'punto' : 'cathering'"> -->
    <!-- <code>{{ estado.catalogosOfertas }}</code> -->
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
      <div class="flex gap-2 justify-center my-2">
        <div
          class="cursor-pointer"
          v-for="catalogo in estado.catalogosOfertas"
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
          <q-expansion-item
            class="bg-[#F0F0F0]"
            dense
            dense-toggle
            group="somegroup"
            icon="category"
            :label="item.nombre">
            <q-card class="px-4">
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
            </q-card>
          </q-expansion-item>
        </div>
      </q-list>
      <div v-if="estado.searchResults.length === 0">No hay producto..</div>
    </div>
  </NuxtLayout>
</template>
<script setup>
import { watch } from 'vue';
import { storePedido } from '@/modulos/pedidos/pedidos.store';
import { useRealizarPedido } from './realizarPedido.composable';

provide('infoPagina', {
  infoPagina: {
    titulo: 'Realizar pedido',
    camino: [{ label: 'Realizar pedido', to: 'realizarPedido' }]
  }
});

const { estado, authStore, obtenerCatalogosProductos, filter, searchCatalog } =
  useRealizarPedido();

const pedidoStore = storePedido();

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
};

const selectCatalogo = catalogo => {
  estado.catalogoSeleccionado = catalogo;
  estado.searchResults = catalogo.hijas;
};

watch(filter, () => {
  estado.searchResults = searchCatalog(filter.value);
});

onMounted(() => {
  obtenerCatalogosProductos();
});
</script>

<style scoped></style>

<!-- definePageMeta({
  layout: 'punto',
}); -->
