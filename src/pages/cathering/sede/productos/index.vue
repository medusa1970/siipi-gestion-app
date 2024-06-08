<template>
  <div>
    <Navigation label="Productos" icon="list_alt" />
    <h1 class="text-lg font-extrabold uppercase text-center">
      Gestion de productos
    </h1>
    <Table badge :rows="estado.productos" :columns="columnsProductos" dense>
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
          <q-td key="imagen" :props="props" class="">
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
              {{ fechaMes(props.row._modificado) }}
            </h1>
          </q-td>
          <q-td key="nombre" :props="props">
            {{ props.row.nombre }}
          </q-td>
          <q-td key="medida" :props="props">
            {{ props.row.medida.nombre }}
          </q-td>
          <q-td key="categoria" :props="props">
            {{ props.row.categoria && props.row.categoria.nombre }}
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
              @click="estado.modal.isDetailProduct = true"
            />

            <q-btn
              color="primary"
              icon="edit"
              round
              dense
              flat
              padding="1px"
              size="10px"
              @click="esEditarProducto(props.row)"
            />
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

  <!-- DIALOG DOUBLECLICK -->
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

  <!-- CREAR PRODUCTO BASICO -->
  <Dialog2
    v-model="estado.modal.isAddProduct"
    title="Crear producto"
    label-btn="Crear"
    :handle-submit="crearProductoBasico"
  >
    <template #inputsDialog>
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">DATOS BASICOS</h1>
      <q-file
        v-model="imagen"
        label="Seleccionar imagen"
        accept=".jpg, .png, .jpge"
        max-total-size="560000"
        @rejected="onRejected"
        counter
        outlined
        dense
        hint="Tamaño máximo de imagen 540KB"
        clearable
      >
        <template v-slot:prepend>
          <q-icon name="cloud_upload" @click.stop.prevent />
        </template>
      </q-file>
      <div
        v-if="imagePreview"
        style="width: 200px; height: 200px; margin: auto"
      >
        <q-img
          style="width: 100%; height: 100%; object-fit: cover"
          :src="imagePreview"
        ></q-img>
      </div>
      <q-input
        v-model="producto.datosBasicos.nombre"
        type="text"
        label="Nombre*"
        outlined
        dense
        clearable
        required
      />
      <!-- <code>{{ estado.categorias.hijas }}</code> -->
      <div class="select-container">
        <select
          id="two-level-select"
          class="border border-gray-400 rounded-[4px] shadow-sm text-base block w-full py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          v-model="producto.datosBasicos.categoria"
        >
          <option value="" disabled selected>Selecciona una categoria</option>
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
      <!-- EXTRAS -->
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">EXTRAS</h1>
      <q-input
        v-model="producto.datosBasicos.comentario"
        type="text"
        label="Comentario"
        outlined
        dense
        clearable
        required
      />
    </template>
  </Dialog2>

  <!-- PRODUCTO MARCA -->
  <Dialog2
    v-model="estado.modal.esCrearMarcaProducto"
    title="Crear producto"
    label-btn="Crear"
  >
    <template #inputsDialog>
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">MARCA</h1>
      <q-btn
        color="orange-7"
        icon="add"
        label="Agregar marca"
        dense
        no-caps
        padding="2px 10px"
      />

      <div
        class="mt-2 border border-gray-400 rounded-md px-3 py-2 grid grid-cols-[1fr_auto]"
      >
        <section>
          <h1>Marca: BELEN</h1>
          <h1>Imagen: vaso-belen.png</h1>
          <h1>Min: 30</h1>
          <h1>Max: 300</h1>
        </section>
        <section class="flex flex-col justify-center items-center">
          <q-btn color="primary" icon="edit" flat rounded dense size="12px" />
          <q-btn color="red" icon="delete" flat rounded dense size="13px" />
        </section>
      </div>
    </template>
  </Dialog2>

  <!-- PRODUCTO MEDIDAS & EMPAQUES -->
  <Dialog2
    v-model="estado.modal.esCrearMedidaProducto"
    title="Crear producto"
    label-btn="Crear"
  >
    <template #inputsDialog>
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">
        MEDIDAS & EMPAQUES
      </h1>
      <div class="row items-center" style="width: 100%">
        <q-select
          v-model="text"
          :options="estado.categorias.hijas"
          label="Medida basica"
          option-label="nombre"
          style="width: 100%; flex: 1 0 auto"
          use-input
          hide-selected
          fill-input
          dense
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="straighten" />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No hay resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <q-btn
        color="orange-7"
        icon="add"
        label="Agregar empaque"
        dense
        no-caps
        padding="2px 10px"
      />

      <div
        class="mt-2 border border-gray-400 rounded-md px-3 py-2 grid grid-cols-[1fr_auto]"
      >
        <section>
          <h1>Marca: BELEN</h1>
          <h1>Empaque: Tira</h1>
          <h1>Abreviacion: Tir</h1>
          <h1>Cantidad: 100 unidades</h1>
        </section>
        <section class="flex flex-col justify-center items-center">
          <q-btn color="primary" icon="edit" flat rounded dense size="12px" />
          <q-btn color="red" icon="delete" flat rounded dense size="13px" />
        </section>
      </div>
    </template>
  </Dialog2>

  <!-- PRODUCTO PROVEEDORES -->
  <Dialog2
    v-model="estado.modal.isAddProveedor"
    title="Crear producto"
    label-btn="Crear"
  >
    <template #inputsDialog>
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">PROVEEDORES</h1>

      <q-btn
        color="orange-7"
        icon="add"
        label="Agregar proveedor"
        dense
        no-caps
        padding="2px 10px"
      />

      <div
        class="mt-2 border border-gray-400 rounded-md px-3 py-2 grid grid-cols-[1fr_auto]"
      >
        <section>
          <h1>Proveedor: Martin</h1>
          <h1>Marca: BELEN</h1>
          <h1>Identificativo: BELEN-300</h1>
          <div>
            <table class="w-full border-collapse border border-black">
              <thead>
                <tr>
                  <th class="border border-black">Desde</th>
                  <th class="border border-black">Con Factura</th>
                  <th class="border border-black">Sin Factura</th>
                </tr>
              </thead>
              <tbody>
                <tr class="text-center">
                  <td class="border border-black">1</td>
                  <td class="border border-black">0.10</td>
                  <td class="border border-black">0.95</td>
                </tr>
                <tr class="text-center">
                  <td class="border border-black">100</td>
                  <td class="border border-black">0.95</td>
                  <td class="border border-black">0.90</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section class="flex flex-col justify-center items-center">
          <q-btn color="primary" icon="edit" flat rounded dense size="12px" />
          <q-btn color="red" icon="delete" flat rounded dense size="13px" />
        </section>
      </div>
    </template>
  </Dialog2>

  <!-- PRODUCTO PROVEEDORES -->
  <Dialog2
    v-model="estado.modal.isDetailProduct"
    title="Detalle producto"
    no-btn=""
  >
    <template #inputsDialog>
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">
        DETALLE DE PRODUCTO
      </h1>
      <h1>MORINGA</h1>
      <h1>moringa siipi</h1>
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
