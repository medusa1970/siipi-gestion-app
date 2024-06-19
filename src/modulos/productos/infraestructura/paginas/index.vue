<template>
  <div>
    <!--
      BREADCRUMB
      -->

    <Navigation label="Productos" icon="list_alt" />

    <!--
      TITLE
      -->

    <h1 class="text-lg font-extrabold uppercase text-center">
      Gestion de productos
    </h1>

    <!--
      TABLE
      -->

    <Table badge :rows="productos" :columns="columnsProductos" dense>
      <!-- BADGE -->
      <template #dropdown>
        <q-btn
          icon-right="add"
          color="green"
          label="Crear producto"
          no-caps
          style="font-size: 14.5px"
          padding="4px 10px"
          @click="show_crearProductoBasico = true"
        />
      </template>

      <!-- BADGE -->
      <template #rows-badge="{ props }">
        <q-tr :props="props">
          <q-td
            key="imagen"
            :props="props"
            class="cursor-pointer"
            @click="verImagen(props.row.imagen)"
          >
            <q-img
              v-if="props.row.imagen"
              :src="props.row.imagen.cloudinaryUrl"
              spinner-color="black"
              class="cell-image"
              width="40px"
              height="40px"
            />
            <q-img
              v-else
              :src="ProductoImage"
              spinner-color="black"
              class="cell-image"
              width="40px"
              height="40px"
            />
          </q-td>
          <q-td key="modificado" :props="props">
            <h1 :class="props.row._modificado ? '' : 'text-green-800'">
              {{ fechaHora(props.row._modificado ?? props.row._creado) }}
            </h1>
          </q-td>
          <q-td key="nombre" :props="props">
            {{ props.row.nombre }}
          </q-td>
          <q-td key="medida" :props="props">
            {{ props.row.medida?.nombre ?? '(a ingresar)' }}
          </q-td>
          <q-td key="categoria" :props="props">
            {{ props.row.categoria?.nombre ?? '(desconocido)' }}
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              color="primary"
              icon="visibility"
              round
              dense
              padding="1px"
              size="11px"
              @click="mostrarInformacionProducto(props.row)"
            >
              <q-tooltip> Ver informacion producto </q-tooltip>
            </q-btn>

            <q-btn
              color="orange"
              icon="edit"
              round
              dense
              padding="1px"
              size="10px"
              @click="esEditarProducto(props.row)"
            >
              <q-tooltip> Editar producto </q-tooltip></q-btn
            >
          </q-td>
        </q-tr>
      </template>
    </Table>
  </div>

  <!-- 
    MODAL
    crearProductoBasico 
  -->

  <Dialog2
    v-model="show_crearProductoBasico"
    title="Crear producto"
    label-btn="Crear"
    :handle-submit="crearProductoBasico"
  >
    <template #inputsDialog>
      <!--h1 class="text-center bg-gray-300 font-bold py-[2px]">DATOS BASICOS</h1-->
      <p>
        <b>Por favor asegúrese que el producto todavía no existe</b> ayudándose
        del buscador.
      </p>

      <!-- nombre -->
      <div>
        <input-text
          label="Texto"
          info="Por favor antes de crear un producto, asegúrese que no existe todavá. Ayúdese del buscador de la tabla."
          @update="(v) => (datos_crearProductoBasico.nombre = v)"
          requerido
        />
      </div>

      <!-- Categoria -->
      <div>
        <input-dropdown
          label="Categoria"
          :options="categoriaOptions"
          info="La categoría existe solamente a fines de ubicar facilmente el producto en administracion. Para crear una nueva categoria, vaya al menu Logistica > Categorías."
          @update="(v) => (datos_crearProductoBasico.categoria = v)"
          requerido
        />
      </div>

      <!-- Imagen -->
      <div>
        <input-image
          label="Imagen"
          info="Por favor elija una foto del producto solo, que se distinga claramente ante un fondo claro y unido. Prefiera un formato cuadrado."
          @update="
            (v) =>
              (datos_crearProductoBasico.imagen = {
                data: v,
                mimetype: 'image/png',
              })
          "
          icono="photo_camera"
        />
      </div>

      <!-- Comentario -->
      <div>
        <input-textarea
          labeproductoServicel="Textarea"
          info="Agregue cualquier información adicional que sea útil registrar junto con el producto."
          @update="(v) => (datos_crearProductoBasico.comentario = v)"
        />
      </div>
    </template>
  </Dialog2>

  {{ crearProducto }}
</template>

<script setup lang="ts">
import ProductoImage from '@/assets/img/producto.png';
import { columnsProductos } from '~/helpers/columns';
import { useProducto } from '~/modulos/productos/negocio/useProducto';
import { useProductoStore } from '~/modulos/productos/negocio/useProductoStore';

// types
import type { CrearProductoBasico } from '~/modulos/productos/negocio/producto.interface';
import type { Producto } from '~/modulos/productos/aplicacion/productoApi.interface';

// composables
const productoService = useProducto();
const productoStore = useProductoStore();

// layout
definePageMeta({
  layout: 'cathering',
});

// Refs y reactives
const row = ref('');
const options = ref([]);
const productos = ref(await productoStore.getProductos());
// productos.value = await productoStore.getProductos();
const categoriaOptions = ref(await productoService.categoriaSelectOptions());

// MODAL crearProductoBasico
const show_crearProductoBasico = ref(false);
const init_crearProductoBasico = {
  nombre: '',
  categoria: '',
  comentario: null,
  imagen: null,
} as CrearProductoBasico;
const datos_crearProductoBasico = ref(init_crearProductoBasico);
const crearProductoBasico = async () => {
  productoService.crearProductoBasico(datos_crearProductoBasico.value);
  show_crearProductoBasico.value = false;
  Object.assign(datos_crearProductoBasico, init_crearProductoBasico);
};

// subscriptions
// productoStore.$subscribe((mutation, state) => {
//   if (mutation.payload.productos) {
//     productos.value = state.productos;
//   }
// });
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
