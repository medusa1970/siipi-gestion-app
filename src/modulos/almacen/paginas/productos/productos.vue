<template>
  <NuxtLayout
    :name="authStore.getNegocio.tipo === 'PUNTO' ? 'punto' : 'cathering'"
    titulo="Gestion de productos"
    :navegacion="[{ label: 'Productos', to: 'productos' }]">
    <div>
      <q-btn
        width="auto"
        icon="add"
        label="Nuevo producto"
        color="green"
        no-caps
        margin="auto"
        @click="() => (estado.modal.formProductoBasico = true)" />
    </div>

    <Tabla
      :rows="rowsTablaProductos"
      :columns="columnsTablaProducto"
      :defaultImage="ProductoImage"
      :paginacion="9">
      <template #dropdown>
        <div
          style="
            display: grid;
            grid-gap: 16px;
            margin: 0;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            width: 100%;
          ">
          <input-text
            label="Buscar"
            labelAdentro
            @update="(v) => (estado.filtros.buscar = v as string)"
            noSlot />

          <input-select
            label="Categoria"
            labelAdentro
            :opciones="selectCategoriaFiltro"
            @update="v => (estado.filtros.categoriaSeleccionada = v)"
            noSlot />

          <input-select
            label="Marca"
            labelAdentro
            @update="v => (estado.filtros.marcaSeleccionada = v)"
            :opciones="estado.filtros.marcaOpciones"
            noSlot />

          <input-select
            label="Estado"
            labelAdentro
            @update="v => (estado.filtros.completud = v)"
            :opciones="[
              { value: 'soloCompletos', label: 'solo completos' },
              { value: 'soloIncompletos', label: 'solo incompletos' }
            ]"
            noSlot />
        </div>
      </template>
      <template #cell-estado="{ row }">
        {{ fechaMes(row._modificado ?? row._creado) }}
        <br />
        <q-badge v-if="!productoIncompleto(row)" color="green">
          completo
        </q-badge>
        <q-badge v-else color="orange"> incompleto </q-badge>
        <p>Ofertas: {{ row.numOfertas }}</p>
      </template>
      <template #body-expand="{ row }">
        <div
          style="
            display: grid;
            grid-gap: 16px;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          ">
          <!-- IMAGEN -->
          <div>
            <q-img
              v-if="row.imagen?.cloudinaryUrl"
              :src="row.imagen?.cloudinaryUrl"
              spinner-color="primary"
              spinner-size="82px"
              class="w-full h-auto object-cover" />
            <h1 v-else>No hay imagen...</h1>
          </div>
          <!-- DATOS BASICOS -->
          <div>
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
          </div>
          <!-- MARCAS -->
          <div>
            <h1 class="text-center bg-gray-300 font-bold py-[2px]">MARCAS</h1>
            <div
              v-for="variedad in row.variedades"
              :key="variedad._id"
              class="border border-gray-400 p-1 mt-1 rounded-[4px] mb-1">
              <span class="flex gap-2 items-center"
                ><h1 class="font-bold text-xs">MARCA:</h1>
                <p>{{ variedad.marca.nombre }}</p></span
              >
              <span class="flex gap-2 items-center"
                ><h1 class="font-bold text-xs">CANTIDAD MINIMA:</h1>
                <p>
                  {{ row.cantidadAvisoSuave }} / {{ row.cantidadAvisoFuerte }}
                </p>
              </span>
              <span class="flex gap-2 items-center"
                ><h1 class="font-bold text-xs">CANTIDAD MAXIMA:</h1>
                <p>{{ variedad.cantidadMaxPedido }}</p></span
              >
            </div>
            <h1 v-if="row.variedades.length == 0">Sin marcas ...</h1>
          </div>
          <!-- MEDIDAS -->
          <div>
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
              class="border border-gray-400 p-1 mt-1 rounded-[4px] mb-1">
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
          </div>
        </div>
      </template>
      <template #cell-acciones="{ row }">
        <q-btn-group push @click="e => e.stopPropagation()">
          <btnAccion
            icono="edit black"
            @click="
              () => {
                goTo(router, 'producto', { id: row._id });
              }
            " />
          <q-btn
            @click="
              () => {
                estado.productoSeleccionado = row._id;
                estado.productoIncompleto = productoIncompleto(row);
                if (estado.productoIncompleto) {
                  estado.modal.alertaIncompleto = true;
                } else {
                  estado.modal.crearOferta = true;
                }
              }
            "
            icon="add_business"
            class="p-1"
            color="orange"
            size="sm">
            <q-tooltip> Crear oferta </q-tooltip>
          </q-btn>
        </q-btn-group>
      </template>
      <template #cell-nombre="{ val, row }">
        <div
          style="
            font-size: 13px;
            display: block;
            word-wrap: break-word;
            white-space: normal;
          ">
          <b>{{ row.nombre }}</b>
        </div>
        <div class="flex" v-if="row.variedades?.length > 0">
          <q-badge
            v-for="variedad in row.variedades"
            :key="variedad._id"
            color="darkblue"
            class="mr-1 mb-1 lowercase">
            {{ variedad.marca?.nombre }}
          </q-badge>
        </div>
        <div v-else><span class="aIngresar">Registrar una marca</span></div>
        <p style="white-space: normal">
          <span v-if="row.medida?.abreviacion"
            >Por {{ row.medida.abreviacion }}</span
          ><span v-else class="aIngresar">Elegir la medida</span> -
          <span v-if="row.categoria?.nombre"
            >En: {{ row.categoria.nombre }}</span
          ><span v-else class="aIngresar">Elegir la categoria</span>
        </p>
        <!-- <h1 v-if="row.nombre" class="tooltip">
        {{
          row.nombre.length > 30 ? row.nombre.slice(0, 30) + '...' : row.nombre
        }}
        <span
          class="tooltiptext shadow-lg text-blue-500 font-semibold bg-white px-4 py-1"
          >{{ row.nombre }}</span
        >
      </h1> -->
      </template>
    </Tabla>
  </NuxtLayout>

  <Popup v-model="estado.modal.formProductoBasico" titulo="Nuevo producto">
    <template #body>
      <formProductoBasico @crearObjeto="handleProductoCreado" />
    </template>
  </Popup>

  <Popup v-model="estado.modal.crearOferta" titulo="Nueva Oferta">
    <template #body>
      <formOfertaProducto
        :config="{ productoId: estado.productoSeleccionado }"
        @crearObjeto="handleOfertaSimpleCreada" />
    </template>
  </Popup>

  <Popup v-model="estado.modal.alertaIncompleto" titulo="Producto incompleto">
    <template #body>
      <div>
        Por favor entre los datos siguientes antes de crear una oferta :
        <q-list>
          <q-item v-if="estado.productoIncompleto?.includes('imagen')" v-ripple>
            <q-item-section avatar>
              <q-avatar color="green" text-color="white"> I </q-avatar>
            </q-item-section>
            <q-item-section>Suba una imagen</q-item-section>
          </q-item>
          <q-item
            v-if="estado.productoIncompleto?.includes('variedad')"
            v-ripple>
            <q-item-section avatar>
              <q-avatar color="green" text-color="white"> M </q-avatar>
            </q-item-section>
            <q-item-section>Registre por lo menos una marca</q-item-section>
          </q-item>
          <q-item v-if="estado.productoIncompleto?.includes('medida')" v-ripple>
            <q-item-section avatar>
              <q-avatar color="green" text-color="white"> U </q-avatar>
            </q-item-section>
            <q-item-section>Elija una medida básica</q-item-section>
          </q-item>
          <q-item
            v-if="estado.productoIncompleto?.includes('categoria')"
            v-ripple>
            <q-item-section avatar>
              <q-avatar color="green" text-color="white"> C </q-avatar>
            </q-item-section>
            <q-item-section>Elija una categoria</q-item-section>
          </q-item>
        </q-list>
      </div>
    </template>
  </Popup>
</template>

<script setup lang="ts">
import { useProductos } from './productos.composable';
const {
  estado,
  store,
  authStore,
  router,
  productoIncompleto,
  handleProductoCreado,
  handleOfertaSimpleCreada,
  productoOfertas
} = useProductos();

// otros imports
import ProductoImage from '@/assets/img/noHayProducto.png';
import formProductoBasico from '@/modulos/almacen/forms/formProductoBasico.vue';
import formOfertaProducto from '@/modulos/ofertas/forms/formOfertaProducto.vue';
import type { CategoriaSelectOpcion } from '../../almacen.interface';

// opciones
const selectCategoriaFiltro = computed(() => {
  let options = [];
  if (store.categoriaArbol) {
    for (const cat of store.categoriaArbol.hijas) {
      const idsHijas = [];
      const hijas = [];
      for (const subcat of cat.hijas) {
        hijas.push(<CategoriaSelectOpcion>{
          label: subcat.nombre,
          value: [subcat._id],
          class: 'option'
        });
        idsHijas.push(subcat._id);
      }
      options.push(<CategoriaSelectOpcion>{
        label: cat.nombre,
        value: idsHijas
      });
      options = [...options, ...hijas];
    }
  }
  return options;
});

/**
 * Rows para la tabla
 */
const rowsTablaProductos = computed(() => {
  let filtered = store.productos;
  if (!filtered) return [];
  // filtro por completo
  if (estado.filtros.completud === 'soloCompletos') {
    filtered = filtered.filter(producto => !productoIncompleto(producto));
  }
  if (estado.filtros.completud == 'soloIncompletos') {
    filtered = filtered.filter(producto => productoIncompleto(producto));
  }
  // filtro por categoria
  if (
    estado.filtros.categoriaSeleccionada != null &&
    estado.filtros.categoriaSeleccionada !== ''
  ) {
    filtered = filtered.filter(producto =>
      estado.filtros.categoriaSeleccionada.includes(producto.categoria._id)
    );
  }
  // filtro por marca
  if (
    estado.filtros.marcaSeleccionada != null &&
    estado.filtros.marcaSeleccionada !== ''
  ) {
    filtered = filtered.filter(producto =>
      producto.variedades
        .map(variedad => variedad.marca._id)
        .includes(estado.filtros.marcaSeleccionada)
    );
  }
  // filtro por buscar que no discrimine maiusculas de minusculas y acentos

  if (estado.filtros.buscar != null) {
    const regex = new RegExp(`${estado.filtros.buscar}`, 'i');
    filtered = filtered.filter(producto => {
      return regex.test(
        producto.nombre +
          producto.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      );
    });
  }

  return filtered;
});

// mount
onMounted(async () => {
  store.getCategorias();
  store.productos = await store.getProductos();
  for (const producto of store.productos) {
    const ofertas = productoOfertas(producto._id);
    // @ts-ignore
    producto.numOfertas = ofertas ? ofertas.length : '-';
  }
  try {
    estado.filtros.marcaOpciones = (await buscarVarios(GqlBuscarMarcas)).map(
      marca => ({
        value: marca._id,
        label: marca.nombre
      })
    );
  } catch (err) {
    errFailback(err);
  }
});

// sockets
const { $socket } = useNuxtApp();
onBeforeMount(() => {
  $socket.on('cambiosProductos', async (data: any) => {});
  $socket.on('cambiosOfertas', async (data: any) => {
    await store.refreshProductos();
  });
});
onBeforeUnmount(() => {
  // $socket.off('cambiosProductos');
  $socket.off('cambiosOfertas');
});

// configuracion de la tabla
const columnsTablaProducto = ref([
  {
    name: 'imagen',
    label: 'Imagen',
    imagen: true,
    align: 'center',
    field: (row: any) => row.imagen?.cloudinaryUrl
  },

  {
    name: 'nombre',
    required: true,
    slot: true,
    label: 'Nombre',
    align: 'left',
    field: (row: any) => row.nombre,
    sortable: true
  },
  {
    name: 'estado',
    label: 'Modif.',
    align: 'right',
    field: (row: any) => row._modificado,
    slot: true,
    sortable: true
  },
  {
    name: 'acciones',
    label: 'Accion',
    align: 'center',
    slot: true
  }
]);
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
.aIngresar {
  color: orange;
}
</style>
