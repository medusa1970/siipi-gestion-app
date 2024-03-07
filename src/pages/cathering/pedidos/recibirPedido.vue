<template>
  <Navigation label="Realizar pedido" icon="group" />
  <h1 class="font-bold text-lg text-center mb-2">Recibir pedido</h1>

  <TableExpand :rows="estado.ListaOfertasPedido">
    <template #slot-footer>
      <h1 class="font-bold uppercase text-center">
        Selecciona el producto e ingrese la cantidad
      </h1>
    </template>

    <template #body-data="{ props }">
      <div class="col-span-1">
        <q-list class="shadow-1">
          <q-expansion-item
            switch-toggle-side
            expand-separator
            group="somegroup"
            class="w-expansion [&>div>div>div>i]:bg-orange-400 [&>div>div>div>i]:rounded-full [&>div>div>div>i]:text-white"
          >
            <template v-slot:header>
              <div class="flex items-center justify-center">
                <!-- uppercase font-bold line-clamp-1 -->
                <p class="font-bold">
                  {{ props.row.nombre }}
                </p>
              </div>
              <q-item-section side class="h-[50px]">
                <!-- <h1>sds</h1> -->
                <img
                  v-if="props.row.foto"
                  :src="props.row.foto"
                  class="h-full w-full object-cover"
                  alt=""
                />
              </q-item-section>
            </template>
            <q-card class="pb-3 flex justify-center col-span-3">
              <div class="flex flex-col">
                <span class="flex gap-2 items-center">
                  <q-btn
                    padding="4px"
                    size="9px"
                    icon="add"
                    rounded
                    color="primary"
                    dense
                  />
                  <input
                    type="number"
                    placeholder="Cantidad"
                    class="test border-[1px] border-gray-400 px-2 py-1 w-[90px] outline-none bg-transparent"
                    @input="handleInputChange2($event, props.row)"
                  />
                  <!-- <q-input
                    v-model.number="text"
                    type="number"
                    dense
                    outlined
                    label="Cantidad"
                  /> -->
                  <q-btn
                    padding="4px"
                    size="9px"
                    icon="remove"
                    rounded
                    color="primary"
                    dense
                  />
                </span>
              </div>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
    </template>
  </TableExpand>
</template>
<script setup>
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

const { estado, obtenerCatalogosProductos, useAuth, obtenerListaOfertas } =
  usePedido();
const usePedidoStore = pedidoStore();
const router = useRouter();
const test = ref(null);
const listaPedidos = ref([]);
const categoriasPedido = ref({});

const handleInputChange2 = (event, product) => {
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

onMounted(() => {
  obtenerListaOfertas();
});
</script>

<style scoped></style>
