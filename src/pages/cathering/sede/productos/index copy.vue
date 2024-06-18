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
        <b>Por favor asegúrese que el producto todavía no existe</b> ayudándose
        del buscador.
      </p>

      <!-- nombre -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-input
            label="Nombre *"
            v-model="producto.datosBasicos.nombre"
            class="w-full"
            type="text"
            filled
            required
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="Por favor antes de crear un producto, asegúrese que no existe todavá. Ayúdese del buscador de la tabla."
          />
        </div>
      </div>

      <!-- Categoria -->
      <div class="flex" style="justify-content: space-between; margin: 15px 0">
        <div style="flex-grow: 1">
          <q-select
            label="Categoria *"
            v-model="producto.datosBasicos.categoria"
            :options="options"
            class="w-full"
            map-options
            dense
            filled
            required
          >
            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
                :class="scope.opt.class"
              >
                <q-item-section>{{ scope.opt.label }}</q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div>
          <BotonDetalle
            mensaje="La categoría existe solamente a fines de ubicar facilmente el producto en administracion. Para crear una nueva categoria, vaya al menu Logistica > Categorías."
          />
        </div>
      </div>

      <!-- Imagen -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <q-img
          style="width: 150px; height: 150px; object-fit: cover"
          v-if="imagePreview"
          :src="imagePreview"
        ></q-img>
        <div style="flex-grow: 1">
          <q-file
            class="w-full"
            v-model="imagen"
            label="Imagen *"
            accept=".jpg, .png, .jpge"
            max-total-size="560000"
            @rejected="onRejected"
            counter
            filled
            hint="Tamaño máximo de imagen 540KB"
            clearable
            dense
            required
          >
            <template v-slot:prepend>
              <q-icon name="photo_camera" @click.stop.prevent />
            </template>
          </q-file>
        </div>
        <div>
          <BotonDetalle
            mensaje="Por favor elija una foto del producto solo, que se distinga claramente ante un fondo claro y unido. Prefiera un formato cuadrado."
          />
        </div>
      </div>

      <!-- Comentario -->
      <div class="flex" style="justify-content: space-between; margin: 10px 0">
        <div style="flex-grow: 1">
          <q-input
            class="w-full"
            v-model="producto.datosBasicos.comentario"
            type="textarea"
            label="Comentario"
            filled
            dense
          />
        </div>
        <div>
          <BotonDetalle
            mensaje="Agregue cualquier información adicional que sea útil registrar junto con el producto."
          />
        </div>
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
        <p>{{ producto.informacion?.nombre }}</p></span
      >
      <span class="flex gap-2 items-center"
        ><h1 class="font-bold text-xs">COMENTARIO:</h1>
        <p>{{ producto.informacion?.comentario }}</p></span
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
        <p v-if="producto.informacion?.medida">
          {{ producto.informacion?.medida?.nombre }}
        </p>
        <p v-else>sin medida basica...</p>
      </span>
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
/**
 * Layout
 */

definePageMeta({
  layout: 'cathering',
});

/**
 * Imports
 */

import { ref, onMounted } from 'vue';
import { columnsProductos } from '~/helpers/columns';
import Producto from '@/assets/img/producto.png';

/**
 * Refs
 */

// const isDoubleClick = ref(false);
const row = ref('');
const options = ref([]);

// const ControladorFila = (props) => {
//   row.value = props.row;
//   isDoubleClick.value = true;
// };

/**
 * Services
 */

const {
  getAllProductos,
} = useProducto();

/**
 * Hooks
 */

onMounted(async () => {
  getAllProductos();
  await getCategoria();

  options.value = [];
  for (const cat of estado.categorias.hijas) {
    options.value.push({
      label: `${cat.nombre} (${cat.hijas.length})`,
      value: cat._id,
      disable: true,
      class: 'title',
    });
    for (const subcat of cat.hijas) {
      options.value.push({
        label: subcat.nombre,
        value: subcat,
        class: 'option',
      });
    }
  }
  producto.datosBasicos.categoria = null;
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
