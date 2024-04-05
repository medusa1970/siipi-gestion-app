<template>
  <Navigation label="Hacer pedido" icon="folder" />
  <!-- <code>{{ estado.catalogosOfertas }}</code> -->
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

  <!-- MODAL -->
  <q-dialog v-model="estado.modal.isAddOferta" persistent>
    <q-card class="w-[370px]">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-lg font-semibold">Agregar productoss</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <h1 class="bg-gray-300 text-center my-2">{{ test.nombre }}</h1>
        <div
          class="flex items-center gap-1 mb-[6px]"
          v-for="producto in test.ofertas"
          :key="producto._id"
        >
          <input
            type="number"
            placeholder="Cantidade"
            class="test border-[1px] border-gray-400 px-2 py-1 w-[95px] outline-none bg-transparent"
            @input="handleInputChange($event, producto)"
          />
          <h1 class="font-bold">{{ producto.nombre }}</h1>
          <!-- <q-btn icon="add" round dense color="green" size="sm" /> -->
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="estado.modal.isBuscarPorCategoria" persistent>
    <q-card class="w-[370px]">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-lg font-semibold">Seleccionar productos</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <div
          class="col-span-1 max-sm:col-span-4 max-sm:mx-auto"
          v-if="estado.catalogosOfertas"
        >
          <q-list
            class="rounded-borders w-[350px]"
            v-for="categoria in estado.catalogosOfertas"
            :key="categoria.nombre"
          >
            <q-expansion-item
              expand-separator
              icon="category"
              :label="`${categoria.nombre} (${categoria.hijas.length})`"
              default-opened
              dense
            >
              <q-list v-for="(item, index) in categoria.hijas" :key="index">
                <q-expansion-item
                  :header-inset-level="0.5"
                  switch-toggle-side
                  dense-toggle
                  :label="`${item.nombre} (${item.hijas.length})`"
                  dense
                >
                  <q-list
                    v-for="(item2, index) in item.hijas"
                    :key="index"
                    dense
                  >
                    <q-expansion-item
                      :header-inset-level="1"
                      switch-toggle-side
                      dense-toggle
                      :label="`${item2.nombre} (${item.hijas.length})`"
                      dense
                    >
                      <!-- <code>{{ item2 }}</code> -->
                      <q-list
                        v-for="(item3, index) in item2.ofertas"
                        :key="index"
                        dense
                      >
                        <q-item
                          clickable
                          dense
                          @click="selectProduct(item3)"
                          :class="
                            item3 == test && 'bg-gray-500 [&>div]:text-white'
                          "
                        >
                          <q-item-section side>
                            <h1 class="ml-24">{{ item3.nombre }}</h1>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-expansion-item>
                    <!-- <q-item
                      clickable
                      dense
                      @click="selectProduct(item2)"
                      :class="item2 == test && 'bg-gray-500 [&>div]:text-white'"
                    >
                      <q-item-section side>
                        <h1 class="ml-24">{{ item2.nombre }}</h1>
                      </q-item-section>
                    </q-item> -->
                  </q-list>
                </q-expansion-item>
              </q-list>
            </q-expansion-item>
          </q-list>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useProducts } from '@/composables/sede/useProducts';
import { usePedido } from '@/composables/punto/usePedido';
import { ref, watch } from 'vue';
import { pedidoService } from '~/services/punto/pedido.service';
import { NotifyError, NotifySucessCenter } from '~/helpers/message.service';
import { pedidoStore } from '@/stores/pedido.store';
import { useRouter } from 'vue-router';
definePageMeta({
  layout: 'punto',
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
// const { estado, obtenerTodasCategorias } = useProducts();
const test = ref(null);
const listaPedidos = ref([]);
const catalogoSeleccionado = ref([]);
// const pruebaFilter = ref('sandia');
const categoriasPedido = ref({}); // Objeto para almacenar pedidos por categoría

// const selectCategory = (category) => {
//   // console.log(category);
//   test.value = category;
//   estado.modal.isAddOferta = true;
// };
const handleInputChange2 = (event, product) => {
  console.log(event);
  console.log(product);
  const nuevoValor = event.target.value;

  const producto = {
    id: product._id,
    nombre: product.nombre,
    cantidad: nuevoValor,
    // edit: false,
  };
  console.log(producto);
  // Busca la categoría actual en el pedido
  // const categoriaEnPedido = listaPedidos.value.find(
  //   (categoria) => categoria.nombre === categoriaActual,
  // );
  // console.log(categoriaEnPedido);

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

const buscarPorCategoria = () => {
  estado.modal.isBuscarPorCategoria = true;
  obtenerCatalogosProductos();
};

const selectProduct = (product) => {
  console.log(product.nombre);
  console.log(prueba.value);
  // estado.modal.isBuscarPorCategoria = false;
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
  // obtenerTodasCategorias();
  obtenerCatalogosProductos();
  obtenerListaOfertas();

  // listaPedidos.value = usePedidoStore.listaPedido;
});
</script>

<style scoped></style>
