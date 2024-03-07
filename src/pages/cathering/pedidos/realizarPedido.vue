<template>
  <Navigation label="Realizar pedido" icon="group" />
  <h1 class="font-bold text-lg text-center mb-2">Realizar pedido</h1>

  <TableExpand :rows="estado.ListaOfertasPedido">
    <template #slot-header1>
      <!-- <q-btn
      color="primary"
      label="Ver Stock"
      no-caps
      dense
      padding="7px 15px"
      @click="estado.ListaOfertasPedido = []"
    /> -->
    </template>

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
    // edit: false,
  };
  // Buscar si el producto ya existe en listaPedidos
  const index = usePedidoStore.listaPedido.findIndex(
    (item) => item.id === producto.id,
  );

  if (index > -1) {
    // Si el producto existe, actualizar su cantidad
    usePedidoStore.listaPedido[index].cantidad = nuevoValor;
  } else {
    // Si el producto no existe, añadirlo al array
    usePedidoStore.listaPedido.push(producto);
  }

  console.log(usePedidoStore.listaPedido);
};
const handleInputChange = (event, product) => {
  // console.log(product);
  const categoriaActual = test.value?.nombre; // Obtén el nombre de la categoría actual

  const nuevoValor = event.target.value;

  const producto = {
    id: product._id,
    nombre: product.nombre,
    cantidad: nuevoValor,
    edit: false,
  };

  // Busca la categoría actual en el pedido
  const categoriaEnPedido = listaPedidos.value.find(
    (categoria) => categoria.nombre === categoriaActual,
  );

  if (categoriaEnPedido) {
    // La categoría ya existe en el pedido, busca el producto en la categoría
    const indiceProducto = categoriaEnPedido.productos.findIndex(
      (item) => item.nombre === producto.nombre,
    );

    if (indiceProducto !== -1)
      categoriaEnPedido.productos[indiceProducto].cantidad = nuevoValor;
    else categoriaEnPedido.productos.push(producto);
  }
  // La categoría no existe en el pedido, agrégala con el producto
  else {
    listaPedidos.value.push({
      nombre: categoriaActual,
      productos: [producto],
    });
    // usePedidoStore.listaPedido.push({
    //   nombre: categoriaActual,
    //   productos: [producto],
    // });
  }
};

// const editarCantidad = (producto) => {
//   // console.log(producto);
//   estado.isEditCantidad = !estado.isEditCantidad;
//   producto.edit = !producto.edit;
// };
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
    NotifySucessCenter('Pedido realizado con éxito');
    router.push('/punto/pedidos/listaPedidos');
    usePedidoStore.listaPedido = [];
  } else NotifyError('Error al realizar el pedido');
  // console.log(pedidoIniciar);
};

onMounted(() => {
  // obtenerTodasCategorias();
  // obtenerCatalogosProductos();
  obtenerListaOfertas();
  // listaPedidos.value = usePedidoStore.listaPedido;
});
</script>

<style scoped></style>
