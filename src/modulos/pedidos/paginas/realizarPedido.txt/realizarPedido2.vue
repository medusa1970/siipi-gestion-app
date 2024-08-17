<template>
  <NuxtLayout
    :name="authStore.getNegocio.tipo === 'PUNTO' ? 'punto' : 'cathering'"
    titulo="Gestion de productos"
    :navegacion="[{ label: 'Productos', to: 'productos' }]">
    <Tabla
      :disableExpand="true"
      dense
      :rows="rowsTablaProductos"
      :columns="columnsTablaProducto"
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
            @update="(v) => (estado.filtros.buscarFiltro = v as string)"
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

          <!-- <input-checkbox
            label="Seleccionados ya"
            labelAdentro
            @update="v => (estado.filtros.seleccionados = v)"
            noSlot /> -->
        </div>
      </template>
      <template #cell-acciones="{ row }">
        <input type="number" @input="handleInputChange2($event, row)" min="0" />
      </template>
      <template #cell-nombre="{ val, row }">
        {{ row.nombre }}
      </template>
    </Tabla>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useRealizarPedido2 } from './realizarPedido2.composable';
const {
  estado,
  storePedidos,
  storeAlmacen,
  authStore,
  router,
  handleInputChange2,
  productoIncompleto
} = useRealizarPedido2();

// otros imports
import ProductoImage from '@/assets/img/noHayProducto.png';
import formProductoBasico from '@/modulos/almacen/forms/formProductoBasico.vue';
import formOfertaProducto from '@/modulos/ofertas/forms/formOfertaProducto.vue';
import type { CategoriaSelectOpcion } from '~/modulos/almacen/almacen.interface';

// opciones
const selectCategoriaFiltro = computed(() => {
  let options = [];
  if (storeAlmacen.categoriaArbol) {
    for (const cat of storeAlmacen.categoriaArbol.hijas) {
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
  let filtered = storeAlmacen.productos;
  if (!filtered) return [];

  // solo completos
  filtered = filtered.filter(producto => !productoIncompleto(producto));

  // filtro por seleccionados
  if (estado.filtros.seleccionados) {
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

  if (estado.filtros.buscarFiltro != null) {
    const regex = new RegExp(`${estado.filtros.buscarFiltro}`, 'i');
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
  storeAlmacen.getCategorias();
  storeAlmacen.getProductos();
});

// configuracion de la tabla
const columnsTablaProducto = ref([
  {
    name: 'acciones',
    label: 'Accion',
    align: 'center',
    slot: true
  },
  {
    name: 'nombre',
    required: true,
    slot: true,
    label: 'Nombre',
    align: 'left',
    field: (row: any) => row.nombre,
    sortable: true
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
