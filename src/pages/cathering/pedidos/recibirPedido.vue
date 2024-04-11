<template>
  <Navigation label="Realizar pedido" icon="group" />
  <h1 class="font-bold text-lg text-center mb-2">Recibir productos</h1>

  <div class="block mx-auto w-[400px]">
    <q-input
      v-if="$q.platform.is.desktop"
      borderless
      dense
      debounce="300"
      color="secondary"
      v-model="filter"
      style="padding: 0 10px"
      placeholder="Buscar"
      clearable
      class="w-search border-[1px] rounded-sm border-[#010f1a] hover:shadow-[0_0_5px_#010f1a]"
    >
      <template v-slot:prepend>
        <q-icon name="search" size="22px" class="text-[#010f1a]" />
      </template>
    </q-input>
    <!-- #F0F0F0 -->
    <div class="flex gap-2 justify-center my-2">
      <div
        class="cursor-pointer"
        v-for="catalogo in estado.catalogosOfertas"
        :key="catalogo._id"
      >
        <h1
          @click="selectCatalogo(catalogo)"
          :class="[
            'bg-[#F0F0F0] p-2',
            estado.catalogoSeleccionado.nombre === catalogo.nombre &&
              'font-bold',
          ]"
        >
          {{ catalogo.nombre }}
        </h1>
      </div>
    </div>
    <!-- <code>{{ estado.catalogoSeleccionado }}</code> -->
    <q-list v-if="estado.catalogoSeleccionado" class="flex flex-col gap-1">
      <div v-for="item in estado.catalogoSeleccionado.hijas" :key="item._id">
        <q-expansion-item
          class="bg-[#F0F0F0]"
          dense
          dense-toggle
          group="somegroup"
          icon="category"
          :label="item.nombre"
        >
          <q-card class="px-4">
            <div
              v-for="item in item.ofertas"
              :key="item._id"
              class="grid grid-cols-[70px_1fr_auto] gap-2"
            >
              <div>
                <input
                  type="number"
                  class="w-full test border-[1px] border-gray-400 px-2 py-1 outline-none bg-transparent"
                  @input="handleInputChange2($event, item)"
                  min="0"
                />
              </div>

              <h1>{{ item.nombre }}</h1>

              <q-btn
                color="primary"
                icon="visibility"
                flat
                round
                dense
                size="12px"
              >
                <q-tooltip> ver foto </q-tooltip>
              </q-btn>
            </div>
          </q-card>
        </q-expansion-item>
      </div>
      <!-- <div v-if="estado.catalogoSeleccionado.hijas.length == 0">
      Producto no encontrado😧
    </div> -->
      <div
        v-if="
          estado.catalogoSeleccionado.hijas &&
          estado.catalogoSeleccionado.hijas.length === 0
        "
        class="text-center"
      >
        <h1>Producto no encontrado😧</h1>
      </div>
    </q-list>
    <div v-if="estado.catalogoSeleccionado.length === 0">
      Cargando productos...
    </div>
  </div>
</template>
<script setup>
import { watch } from 'vue';
import { useProducts } from '@/composables/sede/useProducts';
import { usePedido } from '@/composables/punto/usePedido';
import { ref } from 'vue';
import { pedidoService } from '~/services/punto/pedido.service';
import { NotifyError, NotifySucessCenter } from '~/helpers/message.service';
import { pedidoStore } from '@/stores/pedido.store';
import { useRouter } from 'vue-router';
definePageMeta({
  layout: 'cathering',
});

const {
  estado,
  obtenerCatalogosProductos,
  useAuth,
  obtenerListaOfertas,
  filter,
  filteredCatalogos,
} = usePedido();
const usePedidoStore = pedidoStore();
const router = useRouter();
const test = ref(null);
const listaPedidos = ref([]);
const categoriasPedido = ref({});

const handleInputChange2 = (event, product) => {
  event.target.value = Math.max(0, event.target.value);
  const nuevoValor = event.target.value;

  const producto = {
    id: product._id,
    nombre: product.nombre,
    cantidad: nuevoValor,
  };
  const index = usePedidoStore.listaPedido.findIndex(
    (item) => item.id === producto.id,
  );

  if (index > -1) {
    usePedidoStore.listaPedido[index].cantidad = nuevoValor;
  } else {
    usePedidoStore.listaPedido.push(producto);
  }

  console.log(usePedidoStore.listaPedido);
};

const deleteOfertaInList = (producto) => {
  // console.log(producto);
  // console.log(listaPedidos.value);
  listaPedidos.value.forEach((categoria) => {
    const indiceProducto = categoria.productos.findIndex(
      (item) => item.nombre === producto.nombre,
    );
    if (indiceProducto !== -1) categoria.productos.splice(indiceProducto, 1);
  });
};

const realizarPedido = async () => {
  //solo quiero sacar el productonombre y su cantidad
  const items = usePedidoStore.listaPedido.flatMap((categoria) => {
    return categoria.productos.map((producto) => {
      return {
        oferta: producto.id,
        cantidad: parseInt(producto.cantidad),
      };
    });
  });
  // console.log(items)
  const { pedidoIniciar } = await pedidoService.pedidoIniciar(
    useAuth.negocioElegido._id,
    '65a5a9af08c1a906d83522d0',
    items,
    useGqlToken(useAuth.token),
  );
  if (pedidoIniciar) {
    await pedidoService.pedidoConfirmarItems(pedidoIniciar._id);
    await pedidoService.pedidoAceptarItems(pedidoIniciar._id);
    await pedidoService.pedidoPrepararItems(pedidoIniciar._id);
    await pedidoService.pedidoRecibirItems(pedidoIniciar._id);
    NotifySucessCenter('Pedido recibido con éxito');
    router.push('/cathering/pedidos/listaPedidos');
    usePedidoStore.listaPedido = [];
  } else NotifyError('Error al realizar el pedido');
};
const selectCatalogo = (catalogo) => {
  console.log('hola');
  console.log(catalogo);
  estado.catalogoSeleccionado = catalogo;
};

watch(filter, () => {
  // console.log('first');
  // console.log(filteredCatalogos.value);
  estado.catalogoSeleccionado = filteredCatalogos.value;
  // console.log(estado.catalogoSeleccionado);
});

onMounted(() => {
  obtenerListaOfertas();
  obtenerCatalogosProductos();
});
</script>

<!-- <style scoped></style> -->
