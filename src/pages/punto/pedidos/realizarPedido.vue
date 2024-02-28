<template>
  <h1 class="font-bold text-lg text-center mb-6">Realizar pedido</h1>
  <!-- <code>{{ estado.catalogosOfertas }}</code> -->
  <div class="grid grid-cols-4 h-[70vh]">
    <!-- 1 -->
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
              default-opened
              dense
            >
              <q-list v-for="(item2, index) in item.hijas" :key="index">
                <q-item
                  clickable
                  dense
                  @click="selectCategory(item2)"
                  :class="item2 == test && 'bg-gray-500 [&>div]:text-white'"
                >
                  <q-item-section side>
                    <h1 class="ml-24">{{ item2.nombre }}</h1>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </q-list>
        </q-expansion-item>
      </q-list>
    </div>

    <!-- 2 -->
    <!-- <div class="col-span-2 p-2">
      <h1 class="text-center font-bold bg-gray-300 text-md uppercase">
        {{
          test
            ? `${test.nombre} (${test.productos.length})`
            : 'Seleccione una categoria'
        }}
      </h1>
      <div class="grid grid-cols-2 mt-3 gap-2" v-if="test">
        <h1 v-if="test.productos.length === 0">No hay productos...</h1>
        <div
          class="flex items-center gap-1"
          v-for="producto in test.productos"
          :key="producto._id"
        >
          <input
            type="number"
            placeholder="Cantidad"
            class="test border-[1px] border-gray-400 px-2 py-1 w-[88px] outline-none bg-transparent"
            @input="handleInputChange($event, producto)"
          />
          <h1 class="font-bold">{{ producto.nombre }}</h1>
        </div>
      </div>
    </div> -->

    <!-- 3 -->
    <div
      class="col-span-3 p-2 w-[480px] mx-auto max-sm:w-full max-sm:col-span-4"
    >
      <h1 class="text-center bg-[#011627] text-white font-bold">PEDIDO</h1>
      <div v-for="pedido in listaPedidos" :key="pedido">
        <h1 class="bg-gray-300 text-center my-2">{{ pedido.nombre }}</h1>
        <span
          class="flex mt-[6px] items-center"
          v-for="producto in pedido.productos"
          :key="producto"
        >
          <input
            v-if="producto.edit"
            type="number"
            placeholder="Cantidad"
            class="test border-[1px] border-gray-400 px-2 py-1 w-[70px] outline-none bg-transparent col-span-1"
            v-model="producto.cantidad"
          />
          <h1 v-if="producto.edit === false" class="w-[60px]">
            {{ producto.cantidad }}
          </h1>

          <h1 class="col-span-2 flex-1 ml-2">{{ producto.nombre }}</h1>
          <span>
            <q-btn
              color="primary"
              icon="edit"
              flat
              round
              dense
              size="sm"
              @click="editarCantidad(producto)"
            />
            <q-btn
              color="red"
              icon="delete"
              flat
              round
              dense
              size="sm"
              @click="deleteOfertaInList(producto)"
            />
          </span>
        </span>
      </div>
      <q-btn
        class="bg-red-500 text-white mt-2 mr-2"
        label="Cancelar"
        dense
        no-caps
        padding="3px 10px"
      />
      <q-btn
        class="bg-[#011627] text-white mt-2"
        label="Guardar"
        dense
        no-caps
        padding="3px 10px"
        @click="realizarPedido"
      />
    </div>
  </div>

  <!-- MODAL -->
  <q-dialog v-model="estado.modal.isAddOferta" persistent>
    <q-card class="w-[370px]">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-lg font-semibold">Agregar productos</div>
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
            placeholder="Cantidad"
            class="test border-[1px] border-gray-400 px-2 py-1 w-[88px] outline-none bg-transparent"
            @input="handleInputChange($event, producto)"
          />
          <h1 class="font-bold">{{ producto.nombre }}</h1>
          <!-- <q-btn icon="add" round dense color="green" size="sm" /> -->
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useProducts } from '@/composables/sede/useProducts';
import { usePedido } from '@/composables/punto/usePedido';
import { ref } from 'vue';
import { pedidoService } from '~/services/punto/pedido.service';
import { NotifyError, NotifySucessCenter } from '~/helpers/message.service';
definePageMeta({
  layout: 'punto',
});

const { estado, obtenerCatalogosProductos, useAuth } = usePedido();

// const { estado, obtenerTodasCategorias } = useProducts();
const test = ref(null);
const listaPedidos = ref([]);
const categoriasPedido = ref({}); // Objeto para almacenar pedidos por categoría

const selectCategory = (category) => {
  // console.log(category);
  test.value = category;
  estado.modal.isAddOferta = true;
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
  else
    listaPedidos.value.push({
      nombre: categoriaActual,
      productos: [producto],
    });

  // console.log(listaPedidos.value);
};

const editarCantidad = (producto) => {
  // console.log(producto);
  estado.isEditCantidad = !estado.isEditCantidad;
  producto.edit = !producto.edit;
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
  const items = listaPedidos.value.flatMap((categoria) => {
    return categoria.productos.map((producto) => {
      return {
        oferta: producto.id,
        cantidad: parseInt(producto.cantidad),
      };
    });
  });
  const { pedidoIniciar } = await pedidoService.pedidoIniciar(
    useAuth.negocioElegido._id,
    '65a5a9af08c1a906d83522d0',
    items,
    useGqlToken(useAuth.token),
  );
  if (pedidoIniciar) NotifySucessCenter('Pedido realizado con éxito');
  else NotifyError('Error al realizar el pedido');
  // console.log(pedidoIniciar);
};

onMounted(() => {
  // obtenerTodasCategorias();
  obtenerCatalogosProductos();
});
</script>

<style scoped></style>
