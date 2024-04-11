<template>
  <div class="block mx-auto w-[400px]">
    <h1 class="font-bold mb-2 text-center uppercase">
      {{
        nombreCatalogo.includes('PRODUCCION')
          ? 'catalogo compra PROVEEDOR'
          : nombreCatalogo
      }}
    </h1>
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
        v-for="catalogo in catalogosOfertas"
        :key="catalogo._id"
      >
        <h1
          @click="selectCatalogo(catalogo)"
          :class="[
            'bg-[#F0F0F0] p-2',
            catalogoSeleccionado.nombre === catalogo.nombre && 'font-bold',
          ]"
        >
          {{ catalogo.nombre }}
        </h1>
      </div>
    </div>
    <!-- <code>{{ estado.catalogoSeleccionado }}</code> -->
    <q-list v-if="catalogoSeleccionado" class="flex flex-col gap-1">
      <div v-for="item in catalogoSeleccionado.hijas" :key="item._id">
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
      <div
        v-if="
          catalogoSeleccionado.hijas && catalogoSeleccionado.hijas.length === 0
        "
        class="text-center"
      >
        <h1>Producto no encontrado😧</h1>
      </div>
    </q-list>
    <div v-if="catalogoSeleccionado.length === 0">Cargando productos...</div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'cathering',
});
import { ref, onMounted, watch } from 'vue';
import { usePedido } from '~/composables/punto/usePedido';
import { pedidoStore } from '@/stores/pedido.store';
import { useRoute } from 'vue-router';
import { ofertaService } from '~/services/marca/ofertas.service';
const route = useRoute();

const usePedidoStore = pedidoStore();
const { estado, useAuth, filter, obtenerListaOfertas, filteredCatalogos } =
  usePedido();

const catalogosOfertas = ref([]);
const catalogoSeleccionado = ref([]);
const catalogoSeleccionado2 = ref([]);
const nombreCatalogo = ref('');

// const filter = ref('');

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
const selectCatalogo = (catalogo) => {
  console.log(catalogo);
  catalogoSeleccionado.value = catalogo;
};

watch(filter, () => {
  // console.log('first');
  // console.log(filteredCatalogos.value);
  estado.catalogoSeleccionado = filteredCatalogos.value;
  // console.log(estado.catalogoSeleccionado);
});

const obtenerCatalogosProductos = async () => {
  const { catalogoArbol } = await ofertaService.buscarCatalogoID(
    route.params.id,
  );
  console.log(catalogoArbol);
  nombreCatalogo.value = catalogoArbol.nombre;
  catalogosOfertas.value = catalogoArbol.hijas;
  catalogoSeleccionado.value = catalogoArbol.hijas[0];
  catalogoSeleccionado2.value = catalogoArbol.hijas[0];
};

onMounted(() => {
  obtenerCatalogosProductos();
});

onMounted(() => {
  obtenerListaOfertas();
  obtenerCatalogosProductos();
});
</script>
