<template>
  <div class="block mx-auto w-[400px] max-sm:w-[350px]">
    <h1 class="font-bold mb-2 text-center uppercase">
      {{
        nombreCatalogo.includes('PRODUCCION')
          ? 'catalogo compra PROVEEDOR'
          : nombreCatalogo
      }}
    </h1>

    <q-input
      borderless
      dense
      debounce="300"
      color="secondary"
      v-model="filter"
      style="padding: 0 10px"
      placeholder="Buscar"
      class="w-search border-[1px] rounded-sm border-[#010f1a] hover:shadow-[0_0_5px_#010f1a]"
    >
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

    <q-list v-if="searchResults" class="flex flex-col gap-1">
      <div v-for="item in searchResults" :key="item._id">
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
            </div>
          </q-card>
        </q-expansion-item>
      </div>
    </q-list>
    <div v-if="searchResults.length === 0">No hay producto..</div>
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
const { obtenerListaOfertas } = usePedido();

const catalogosOfertas = ref([]);
const catalogoSeleccionado = ref([]);
const catalogoSeleccionado2 = ref([]);
const searchResults = ref([]);
const nombreCatalogo = ref('');

const filter = ref('');

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
  // searchResults.value = catalogo;
  searchResults.value = catalogo.hijas;
};

const obtenerCatalogosProductos = async () => {
  const catalogoArbol = await ofertaService.buscarCatalogoID(route.params.id);

  nombreCatalogo.value = catalogoArbol.nombre;
  catalogosOfertas.value = catalogoArbol.hijas;
  catalogoSeleccionado.value = catalogoArbol.hijas[0];
  searchResults.value = catalogoArbol.hijas[0].hijas;
  catalogoSeleccionado2.value = catalogoArbol.hijas[0];
};

const searchCatalog = (searchTerm) => {
  const catalogo = catalogoSeleccionado.value;
  if (!catalogo.hijas) {
    return catalogo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      ? [catalogo]
      : [];
  }

  const results = catalogo.hijas.filter((hija) => {
    return (
      hija.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hija.ofertas.some((oferta) =>
        oferta.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    );
  });

  return results
    .map((hija) => {
      const filteredOfertas = hija.ofertas.filter((oferta) =>
        oferta.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      return { ...hija, ofertas: filteredOfertas };
    })
    .filter(
      (hija) =>
        hija.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hija.ofertas.length > 0,
    );
};

watch(filter, () => {
  searchResults.value = searchCatalog(filter.value);
});

onMounted(() => {
  obtenerCatalogosProductos();
  obtenerListaOfertas();
});

catalogoSeleccionado.value = {
  _id: '85c7ce11ce1b515075092db1',
  nombre: 'CONSUMIBLES',
  ofertas: [],
  hijas: [
    {
      _id: '85c7ce11ce1b515075092db3',
      nombre: 'Fruta',
      ofertas: [
        { _id: '6102c1c8df85a46e2f0b960b', nombre: 'Frutilla (kg)' },
        {
          _id: '6101c1c8df85a46e2f0b960c',
          nombre: 'Papaya (unidad)',
        },
      ],
    },
    {
      _id: '85c7ce11ce1b515075092db5',
      nombre: 'Granos',
      ofertas: [
        {
          _id: '6104c1c8df85a46e2f0b9429',
          nombre: 'Harina Blanca S/M (Q45)',
        },
        {
          _id: '6102c1c8df85a46e2f0b942d',
          nombre: 'Azucar Blanca (Kg)',
        },
      ],
    },
    {
      _id: '85c7ce11ce1b515075092db6',
      nombre: 'Embolsados',
      ofertas: [
        {
          _id: '6103c1c8df85a46e2f0b947e',
          nombre: 'Cascara de huevo en polvo (bolsa 1kg)',
        },
        {
          _id: '6104c1c8df85a46e2f0b953d',
          nombre: 'Moringa (bolsa de 1kg)',
        },
      ],
    },
    {
      _id: '85c7ce11ce1b515075092db8',
      nombre: 'Mates y concentrados',
      ofertas: [
        {
          _id: '6102c1c8df85a46e2f0b9647',
          nombre: 'Aniz (bolsa de 1kg)',
        },
        {
          _id: '6102c1c8df85a46e2f0b9649',
          nombre: 'Coca (bolsa de 1kg)',
        },
      ],
    },
    {
      _id: '85c7ce11ce1b515075092dba',
      nombre: 'Embotellados',
      ofertas: [
        {
          _id: '6102c1c8df85a46e2f0b9484',
          nombre: 'Caramelo miel con jengibre 80gr (Paq)',
        },
      ],
    },
    {
      _id: '85c7ce11ce1b515075092dbc',
      nombre: 'Aderezos siinple',
      ofertas: [
        {
          _id: '6102c1c8df85a46e2f0b95f9',
          nombre: 'Polvo de hornear (paquete 1kg)',
        },
        {
          _id: '6103c1c8df85a46e2f0b95f9',
          nombre: 'Polvo de hornear (caja 10x1kg)',
        },
      ],
      hijas: [],
    },
    {
      _id: '85c7ce11ce1b515075092dbe',
      nombre: 'Ingredientes',
      ofertas: [
        {
          _id: '6102c1c8df85a46e2f0b9601',
          nombre: 'Champiñon (lata 200g)',
        },
        {
          _id: '6102c1c8df85a46e2f0b9602',
          nombre: 'Fideo tallarin (paq 400g)',
        },
      ],
    },
  ],
};
</script>
