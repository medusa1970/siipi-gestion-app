<template>
  <NuxtLayout
    :name="authStore.getNegocio.tipo === 'PUNTO' ? 'punto' : 'cathering'"
    titulo="Recibir pedido"
    :navegacion="[{ label: 'Recibir pedido', to: 'recibirPedido' }]">
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
import { useRecibirPedidos } from './recibirPedidos.composable';
import { storePedido } from '@/modulos/pedidos/pedidos.store';

const { estado, authStore } = useRecibirPedidos();
const pedidoStore = storePedido();

const selectCatalogo = catalogo => {
  estado.catalogoSeleccionado = catalogo;
  estado.searchResults = [catalogo];
  // console.log(pedidoStore.area);
  switch (catalogo.nombre) {
    case 'PROVEEDORES':
      pedidoStore.area = {
        _id: '665ff70dbc13d4eedbf0ea5b',
        nombre: 'Area Proveedor'
      };
      break;
    case 'PANADERIA':
      pedidoStore.area = {
        _id: '65a5a9af08c1a906d83522d1',
        nombre: 'Area Panaderia'
      };
      break;
    case 'REPOSTERIA':
      pedidoStore.area = {
        _id: '65a5a9af08c1a906d83522d3',
        nombre: 'Area Reposteria'
      };
      break;
    case 'EMBOTELLADOS':
      pedidoStore.area = {
        _id: '662808c349ae018b4c0c8e5b',
        nombre: 'Area Embotellados'
      };
      break;
    case 'ENVASADOS':
      pedidoStore.area = {
        _id: '65a5a9af08c1a906d83522d4',
        nombre: 'Area Envasados'
      };
      break;
    case 'SIINPLE':
      pedidoStore.area = {
        _id: '65a5a9af08c1a906d83522d2',
        nombre: 'Area Siinple'
      };
      break;
    default:
      console.log('Area no reconocida');
  }
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
