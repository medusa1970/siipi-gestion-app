<template>
  <Navigation2
    :nav="[{ label: 'productos', to: 'productos' }]"
    titulo="Gestion de productos"
  />
  <Tabla
    :rows="rowsTablaProductos"
    :columns="
    [ 
       {
    name: 'actions',
    label: '',
    align: 'right',
    slot: true,
  },

  {
    name: 'imagen',
    label: 'Imagen',
    imagen: true,
    align: 'center',
    field: (row: any) => row.imagen?.cloudinaryUrl,
  },

  {
    name: 'nombre',
    required: true,slot:true,
    label: 'Nombre',
    align: 'left',
    field: (row: any) => row.nombre,
    sortable: true,
  },
  {
    name: 'medida',
    required: true,
    label: 'Unidad',
    align: 'left',
    field: (row: any) => row.medida?.abreviacion,
    sortable: true,
  },
  {
    name: 'categoria',
    required: true,
    label: 'categoria',
    align: 'left',
    field: (row: any) => row.categoria.nombre,
    sortable: true,
  },
  {
    name: 'modificado',
    label: 'Modif.',
    align: 'left',
    field: (row: any) => row._modificado,
    format: (val, row) => `${fechaMes(row._modificado ?? row._creado) }`,
    sortable: true,
  },

]"
    :defaultImage="ProductoImage"
  >
    <template #dropdown>
      <div class="w-full grid grid-cols-[1fr_1fr_1fr_auto] gap-3">
        <input-text2
          class="col-span-1"
          label="Buscar"
          @update="(v) => (estado.filtros.buscarFiltro = v)"
          porDefecto=""
          noSlot
        />
        <input-select2
          class="col-span-1"
          label="Categoria"
          @update="(v) => (estado.filtros.categoriaSeleccionada = v)"
          :opciones="estado.filtros.categoriaOpciones"
          noSlot
        />
        <input-select2
          class="col-span-1"
          label="Marca"
          @update="(v) => (estado.filtros.marcaSeleccionada = v)"
          :opciones="estado.filtros.marcaOpciones"
          noSlot
        />
        <q-btn
          class=""
          icon="add"
          color="green"
          no-caps
          padding="4px 10px"
          @click="() => (estado.modal.formProductoBasico = true)"
        />
      </div>
    </template>
    <template #body-cell-actions="{ row }">
      <q-btn-group push @click="(e) => e.stopPropagation()">
        <q-btn
          @click="goTo(router, 'producto2', { id: row._id })"
          icon="edit"
          class="p-1"
          color="black"
          size="sm"
        />
        <q-btn
          @click="() => (estado.modal.crearOferta = true)"
          icon="add_business"
          class="p-1"
          color="orange"
          size="sm"
        />
      </q-btn-group>
    </template>
    <template #body-cell-nombre="{ val, row }">
      {{ val }}
      <br />
      <q-badge
        v-for="variedad in row.variedades"
        :key="variedad._id"
        color="green"
        class="mr-2 lowercase"
      >
        {{ variedad.marca?.nombre }}
      </q-badge>
    </template>
    <template #body-expand="{ row }">
      <pre>{{ row }}</pre>
      <!-- <div class="text-left">
        <h1 class="text-center bg-gray-300 font-bold py-[2px]">
          DATOS BASICOS
        </h1>
        <span class="flex gap-2 items-center"
          ><h1 class="font-bold text-xs">NOMBRE:</h1>
          <p>{{ row.nombre }}</p></span
        >
        <span class="flex gap-2 items-center"
          ><h1 class="font-bold text-xs">COMENTARIO:</h1>
          <p>{{ row.comentario }}</p></span
        >
        <span class="flex gap-2 items-center"
          ><h1 class="font-bold text-xs">CATEGORIA:</h1>
          <p>{{ row.categoria?.nombre }}</p></span
        >
        <h1 class="text-center bg-gray-300 font-bold py-[2px]">MARCAS</h1>
        <div
          v-for="variedad in row.variedades"
          :key="variedad._id"
          class="border border-gray-400 p-1 mt-1 rounded-[4px] mb-1"
        >
          <span class="flex gap-2 items-center"
            ><h1 class="font-bold text-xs">MARCA:</h1>
            <p>{{ variedad.marca.nombre }}</p></span
          >
          <span class="flex gap-2 items-center"
            ><h1 class="font-bold text-xs">CANTIDAD MINIMA:</h1>
            <p>{{ variedad.cantidadLimite }}</p>
          </span>
          <span class="flex gap-2 items-center"
            ><h1 class="font-bold text-xs">CANTIDAD MAXIMA:</h1>
            <p>{{ variedad.cantidadMaxPedido }}</p></span
          >
        </div>
        <h1 v-if="row.variedades.length == 0">Sin marcas ...</h1>

        <h1 class="text-center bg-gray-300 font-bold py-[2px]">
          MEDIDA & EMPAQUES
        </h1>
        <span class="flex gap-2 items-center"
          ><h1 class="font-bold text-xs">MEDIDA:</h1>
          <p v-if="row.medida">
            {{ row.medida?.nombre }}
          </p>
          <p v-else>sin medida basica...</p>
        </span>
        <div
          v-for="empaque in row.empaques"
          :key="empaque.nombre"
          class="border border-gray-400 p-1 mt-1 rounded-[4px] mb-1"
        >
          <span class="flex gap-2 items-center"
            ><h1 class="font-bold text-xs">NOMBRE:</h1>
            <p>{{ empaque.nombre }}</p></span
          >
          <span class="flex gap-2 items-center"
            ><h1 class="font-bold text-xs">ABREVIACION:</h1>
            <p>{{ empaque.abreviacion }}</p></span
          >
          <span class="flex gap-2 items-center"
            ><h1 class="font-bold text-xs">CANTIDAD:</h1>
            <p>{{ empaque.cantidad }}</p></span
          >
          <span class="flex gap-2 items-center"
            ><h1 class="font-bold text-xs">MARCA:</h1>
            <p>{{ empaque.marca.nombre }}</p></span
          >
        </div>
        <h1 v-if="row.empaques.length == 0">Sin empaques ...</h1>
      </div> -->
    </template>
  </Tabla>

  <popup v-model="estado.modal.crearOferta" titulo="Nueva Oferta">
    <template #body>
      <crearOfertaComp
        :producto="store.producto"
        @crear:oferta="handleOfertaCreada"
      />
    </template>
  </popup>

  <popup v-model="estado.modal.formProductoBasico" titulo="Nuevo producto">
    <template #body>
      <crearProductoBasicoComp @crear:producto="handleProductoCreado" />
    </template>
  </popup>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'cathering',
});

import { useAlmacen } from '~/modulos2/almacen/almacen.composable';
import { useProductos } from './productos.composable';
import ProductoImage from '@/assets/img/producto.png';
import crearOfertaComp from '@/modulos/ofertas/infraestructura/agregarOferta.vue';
import crearProductoBasicoComp from '@/modulos2/almacen/forms/formProductoBasico.vue';
const router = useRouter();
const { $socket } = useNuxtApp();
const { estado, store } = useProductos();
const { actProductosDB, categoriaSelectOptionsFiltro } = useAlmacen();

onMounted(async () => {
  await store.getProductos();
  estado.filtros.categoriaOpciones = await categoriaSelectOptionsFiltro();
  estado.filtros.marcaOpciones = (await api.buscarMarcas({})).map((marca) => ({
    value: marca._id,
    label: marca.nombre,
  }));
  $socket.on('cambiosProductos', async (data: any) => {
    await actProductosDB();
  });
});
onBeforeUnmount(() => {
  $socket.off('cambiosProductos');
});

/**
 * Rows para la tabla
 */
const rowsTablaProductos = computed(() => {
  let filtered = store.productos;
  // filtro por categoria
  if (
    estado.filtros.categoriaSeleccionada != null &&
    estado.filtros.categoriaSeleccionada !== ''
  ) {
    filtered = filtered.filter((producto) =>
      estado.filtros.categoriaSeleccionada.includes(producto.categoria._id),
    );
  }
  // filtro por marca
  if (
    estado.filtros.marcaSeleccionada != null &&
    estado.filtros.marcaSeleccionada !== ''
  ) {
    filtered = filtered.filter((producto) =>
      producto.variedades
        .map((variedad) => variedad.marca._id)
        .includes(estado.filtros.marcaSeleccionada),
    );
  }
  // filtro por buscar que no discrimine maiusculas de minusculas y acentos
  if (estado.filtros.buscarFiltro != null) {
    const regex = new RegExp(`${estado.filtros.buscarFiltro}`, 'i');
    filtered = filtered.filter((producto) => {
      return regex.test(
        producto.nombre +
          producto.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      );
    });
  }
  return filtered;
});

/**
 * Crear un producto Basico
 */
const handleProductoCreado = (producto) => {
  NotifySucessCenter('Producto creado éxitosamente');
  estado.modal.formProductoBasico = false;
};

/**
 * Crear una oferta a partir del producto
 */
const handleOfertaCreada = (oferta) => {
  estado.modal.crearOferta = false;
};
</script>

<style scoped>
.prove {
  border: 1px solid red;
}
.table-cell-image {
  display: flex;
  justify-content: center;
  padding: 5px 0;
}
.cell-image {
  width: 70px;
  height: 70px;
}
.q-poput-edit {
  min-width: 400px !important;
}
.truncate-7 {
  display: inline-block;
  width: 15ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: uppercase;
}
</style>
