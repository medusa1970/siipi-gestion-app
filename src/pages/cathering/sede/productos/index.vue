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

    <Table badge :rows="estado.productos" :columns="columnsProductos" dense>
      <!-- BADGE -->
      <template #dropdown>
        <q-btn
          icon-right="add"
          color="green"
          label="Crear producto"
          no-caps
          style="font-size: 14.5px"
          padding="4px 10px"
          @click="estado.modal.isAddProduct = true"
        />
      </template>

      <!-- BADGE -->
      <template #rows-badge="{ props }">
        <q-tr :props="props">
          <q-td
            key="imagen"
            :props="props"
            class=""
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
              :src="Producto"
              spinner-color="black"
              class="cell-image"
              width="40px"
              height="40px"
            />
          </q-td>
          <q-td key="modificado" :props="props">
            <h1 v-if="props.row._modificado == null" class="text-green-800">
              Nuevo
            </h1>
            <h1 v-else>
              {{ fechaHora(props.row._modificado) }}
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
              color="orange"
              icon="visibility"
              round
              dense
              flat
              padding="1px"
              size="11px"
              @click="mostrarInformacionProducto(props.row)"
            >
              <q-tooltip> Ver informacion producto </q-tooltip>
            </q-btn>

            <q-btn
              color="primary"
              icon="edit"
              round
              dense
              flat
              padding="1px"
              size="10px"
              @click="esEditarProducto(props.row)"
            >
              <q-tooltip> Editar producto </q-tooltip></q-btn
            >
            <q-btn
              color="red"
              icon="delete"
              round
              dense
              flat
              padding="3px"
              size="10px"
              @click="borrarProducto(props.row)"
            />
          </q-td>
        </q-tr>
      </template>
    </Table>
  </div>

  <!--
      DIALOG DOUBLECLICK
      -->

  <q-dialog persistent>
    <q-card style="width: 200px" class="px-3 py-1">
      <div class="flex justify-between items-center">
        <h1 class="text-md font-bold truncate-7">{{ row.nombre }}</h1>
        <q-btn icon="close" flat round dense v-close-popup />
      </div>

      <div class="flex gap-2 mb-3 mt-2 justify-center">
        <q-btn
          color="primary"
          label="Editar"
          no-caps
          style="font-size: 14px; width: 70px"
          padding="4px 10px"
          @click="navegarDetalleProducto(row)"
        />
        <q-btn
          color="red"
          label="Eliminar"
          no-caps
          style="font-size: 14px; width: 70px"
          padding="4px 10px"
          @click="borrarProducto(row)"
        />
      </div>
    </q-card>
  </q-dialog>

  <!--
      CREAR PRODUCTO BASICO
      -->

  <Dialog2
    v-model="estado.modal.isAddProduct"
    title="Crear producto"
    label-btn="Crear"
    :handle-submit="crearProductoBasico"
  >
    <template #inputsDialog>
      <!--h1 class="text-center bg-gray-300 font-bold py-[2px]">DATOS BASICOS</h1-->
      <p>
        Entre los datos básicos del nuevo producto.
        <b>Por favor asegúrese que todavía no existe</b> ayudándose del
        buscador.
      </p>

      <h1 class="font-bold text-xs" style="margin-top: 10px">NOMBRE:</h1>
      <div class="flex">
        <q-input
          style="width: 90%"
          v-model="producto.datosBasicos.nombre"
          type="text"
          label="Nombre*"
          outlined
          dense
          clearable
          required
        />
        <BotonDetalle
          mensaje="Asegúrese que el producto todavía no existe por favor."
        />
      </div>

      <h1 class="font-bold text-xs" style="margin-top: 10px">IMAGEN:</h1>
      <div class="flex">
        <q-file
          style="width: 90%"
          v-model="imagen"
          label="Seleccionar imagen*"
          accept=".jpg, .png, .jpge"
          max-total-size="560000"
          @rejected="onRejected"
          counter
          outlined
          dense
          hint="Tamaño máximo de imagen 540KB"
          clearable
          required
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" @click.stop.prevent />
          </template>
        </q-file>
        <BotonDetalle
          mensaje="Elija una foto donde el producto este solo y con un fondo blanco."
        />
      </div>
      <div
        v-if="imagePreview"
        style="width: 200px; height: 200px; margin: auto"
      >
        <q-img
          style="width: 100%; height: 100%; object-fit: cover"
          :src="imagePreview"
        ></q-img>
      </div>

      <!-- <code>{{ estado.categorias.hijas }}</code> -->
      <h1 class="font-bold text-xs" style="margin-top: 10px">CATEGORIA:</h1>
      <div class="flex">
        <div class="select-container" style="width: 90%">
          <select
            id="two-level-select"
            class="border border-gray-400 rounded-[4px] shadow-sm text-base block w-full py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            v-model="producto.datosBasicos.categoria"
            required
          >
            <option value="" disabled selected>
              Selecciona una categoria*
            </option>
            <optgroup
              v-for="categoria in estado.categorias.hijas"
              :key="categoria"
              :label="`${categoria.nombre} ( ${categoria.hijas.length} )`"
            >
              <option
                v-for="subCategoria in categoria.hijas"
                :key="subCategoria"
                :value="subCategoria"
              >
                {{ subCategoria.nombre }}
              </option>
            </optgroup>
          </select>
        </div>
        <BotonDetalle
          mensaje="La categoría sirve solo a fines de ubicar facilmente el producto en administracion. Para crear una nueva categoria, vaya al menu Logistica > Categorías."
        />
      </div>

      <!-- EXTRAS -->
      <!-- <h1 class="text-center bg-gray-300 font-bold py-[2px]">EXTRAS</h1> -->
      <h1 class="font-bold text-xs" style="margin-top: 10px">COMENTARIO:</h1>
      <div class="flex">
        <q-input
          style="width: 90%"
          v-model="producto.datosBasicos.comentario"
          type="text"
          label="Comentario"
          outlined
          dense
          clearable
        />
        <BotonDetalle
          mensaje="Entre cualquier información adicional que sea útil registrar junto con el producto."
        />
      </div>
    </template>
  </Dialog2>

  <!-- 
    VER INFORMACION PRODUCTO
    -->

  <Dialog2
    v-model="estado.modal.esMostrarInformacionProducto"
    title="Informacion producto"
    no-btn
  >
    <template #inputsDialog>
      <!-- <h1 class="font-bold uppercase text-center mb-2 text-blue-800">
        {{ producto.informacion.nombre }}
      </h1> -->
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">DATOS BASICOS</h1>
      <span class="flex gap-2 items-center"
        ><h1 class="font-bold text-xs">NOMBRE:</h1>
        <p>{{ producto.informacion.nombre }}</p></span
      >
      <span class="flex gap-2 items-center"
        ><h1 class="font-bold text-xs">COMENTARIO:</h1>
        <p>{{ producto.informacion.comentario }}</p></span
      >
      <span class="flex gap-2 items-center"
        ><h1 class="font-bold text-xs">CATEGORIA:</h1>
        <p>{{ producto.informacion.categoria?.nombre }}</p></span
      >

      <!-- MARCAS -->
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">MARCAS</h1>
      <div
        v-for="variedad in producto.informacion.variedades"
        :key="variedad._id"
        class="border border-gray-400 p-1 mt-1 rounded-[4px] mb-1"
      >
        <span class="flex gap-2 items-center"
          ><h1 class="font-bold text-xs">MARCA:</h1>
          <p>{{ variedad.marca.nombre }}</p></span
        >
        <span class="flex gap-2 items-center"
          ><h1 class="font-bold text-xs">CANTIDAD MINIMA:</h1>
          <p>{{ variedad.cantidadMin }}</p></span
        >
        <span class="flex gap-2 items-center"
          ><h1 class="font-bold text-xs">CANTIDAD MAXIMA:</h1>
          <p>{{ variedad.cantidadMax }}</p></span
        >
      </div>
      <h1 v-if="producto.informacion.variedades.length == 0">Sin marcas ...</h1>

      <!-- MEDIDAS -->
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">
        MEDIDA & EMPAQUES
      </h1>
      <span class="flex gap-2 items-center"
        ><h1 class="font-bold text-xs">MEDIDA:</h1>
        <p>{{ producto.informacion.medida.nombre }}</p></span
      >
      <div
        v-for="empaque in producto.informacion.empaques"
        :key="empaque"
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
      <h1 v-if="producto.informacion.empaques.length == 0">Sin empaques ...</h1>
    </template>
  </Dialog2>

  <!--
     VER IMAGEN PRODUCTO
   -->

  <Dialog2 v-model="estado.modal.mostrarImagen" title="Imagen producto" no-btn>
    <template #inputsDialog>
      <q-img
        v-if="producto.imagenSrc"
        style="width: 100%; height: 100%; object-fit: cover"
        :src="producto.imagenSrc"
      ></q-img>
      <h1 v-else>No hay imagen...</h1>
    </template>
  </Dialog2>
</template>

<script setup>
definePageMeta({
  layout: 'cathering',
});
import { ref, onMounted } from 'vue';
import { useProducts } from '@/composables/sede/useProducts';
import { columnsProductos } from '~/helpers/columns';
import { fechaMes } from '@/helpers/fecha';
import { fechaHora } from '@/helpers/fecha';
import Producto from '@/assets/img/producto.png';

// const isDoubleClick = ref(false);
const row = ref('');

// const ControladorFila = (props) => {
//   row.value = props.row;
//   isDoubleClick.value = true;
// };

const {
  estado,
  getAllProductos,
  navegarDetalleProducto,
  modalAgregarProducto,
  borrarProducto,
  navegarCrearOferta,
  getCategoria,
  producto,
  imagen,
  imagePreview,
  crearProductoBasico,
  esEditarProducto,
  mostrarInformacionProducto,
  verImagen,
} = useProducts();

onMounted(() => {
  getAllProductos();
  getCategoria();
});
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
