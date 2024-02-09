<template>
  <div>
    <div class="border-[1px] p-4 border-slate-400">
      <h1 class="font-semibold text-base mb-3">Información basica:</h1>
      <div
        class="flex flex-col items-center justify-center bg-gray-200 w-32 h-32 cursor-pointer"
      >
        <input type="file" class="hidden" id="fileInput" />
        <label
          for="fileInput"
          class="flex items-center justify-center text-gray-500"
        >
          <q-icon name="add" size="xs" />
        </label>
        <span class="text-gray-500">Subir imagen</span>
      </div>
      <span class="flex gap-8 items-center my-3">
        <span class="flex flex-col gap-2 w-80">
          <q-input
            v-model="estado.oferta.nombre"
            type="text"
            label="Nombre"
            outlined
            dense
          />
          <q-select
            v-model="estado.oferta.grupos"
            multiple
            outlined
            dense
            use-chips
            stack-label
            label="Grupos"
            :options="tags"
          >
            <template v-slot:selected-item="scope">
              <q-chip
                removable
                dense
                @remove="scope.removeAtIndex(scope.index)"
                :tabindex="scope.tabindex"
                color="green"
                text-color="white"
                class="p-3"
                >{{ scope.opt }}</q-chip
              >
            </template>
          </q-select>
          <q-input
            v-model.number="estado.oferta.precio"
            type="number"
            label="Precio"
            outlined
            dense
          />
        </span>
        <q-input
          class="w-1/2"
          v-model="estado.oferta.descripcion"
          type="textarea"
          label="Descripcion"
          outlined
          dense
        />
      </span>
      <!-- <q-btn
        color="secondary"
        label="Crear oferta"
        no-caps
        v-if="estado.modal.isCreatedOferta === false"
        @click="crearOferta"
      /> -->
      <q-btn
        color="secondary"
        :label="
          storeOferta.isEdit === false ? 'Crear oferta' : 'Editar información'
        "
        no-caps
        @click="storeOferta.isEdit === false ? crearOferta() : editarOferta()"
      />
      <!-- <q-btn color="secondary" label="Editar información" no-caps class="mb-3" /> -->
    </div>

    <br />
    <!-- <code>{{ storeOferta.oferta }}</code> -->
    <div v-if="storeOferta.isEditIngrediente === true">
      <div class="border-[1px] p-4 border-slate-400">
        <div class="flex gap-3 mb-3 items-center">
          <span class="leading-none">
            <h1 class="font-semibold text-base">Ingredientes</h1>
            <p style="font-size: 12px" class="text-gray-500">
              Producto con diferente ingredientes
            </p>
          </span>
          <q-btn
            icon="add"
            dense
            round
            color="primary"
            size="12px"
            @click="abrirModalIngredientes"
          />
        </div>
        <DragDrop
          :lista="estado.oferta.ingredientes"
          item-key="_tipo"
          @edit="editarIngrediente"
        />
      </div>
      <br />
      <div class="border-[1px] p-4 border-slate-400">
        <div class="flex gap-3 mb-3 items-center">
          <span class="leading-none">
            <h1 class="font-semibold text-base">Preparados</h1>
            <p style="font-size: 12px" class="text-gray-500">
              Producto con diferentes preparados
            </p>
          </span>
          <q-btn icon="add" dense round color="primary" size="12px" />
        </div>
        <DragDrop :lista="condiciones" item-key="tipo" />
      </div>
      <br />
      <!-- <div class="border-[1px] p-4 border-slate-400">
        <div class="flex gap-3 mb-3 items-center">
          <span class="leading-none">
            <h1 class="font-semibold text-base">Condiciones</h1>
            <p style="font-size: 12px" class="text-gray-500">
              Producto con diferentes condiciones
            </p>
          </span>
          <q-btn icon="add" dense round color="primary" size="12px" />
        </div>
        <DragDrop :lista="condiciones" item-key="tipo" />
      </div> -->
    </div>
  </div>

  <!-- MODAL ELEGIR INGREDIENTE-->
  <q-dialog v-model="estado.modal.isAddIngredient" persistent>
    <q-card class="w-[370px]">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-lg font-semibold">Agregar ingredienets</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <div class="flex flex-col gap-2">
          <q-btn color="primary" label="Productos Fijos" dense @click="test" />
          <q-btn color="secondary" label="Productos Eleccion" dense />
          <q-btn color="orange" label="Productos en grupos" dense />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- AGREGAR PRODUCTO FIJO -->
  <Dialog
    v-model="estado.modal.isAddIngredientProduct"
    :title="
      storeOferta.isEdit === false
        ? 'Agregar producto fijo'
        : 'Editar producto fijo'
    "
    :handle-submit="
      storeOferta.isEdit === false
        ? crearIngredienteProducto
        : editarIngredienteProducto
    "
  >
    <template #inputsDialog>
      <q-select
        v-model="estado.productoFijo.producto"
        :options="estado.productos"
        label="Seleccionar producto"
        option-label="nombre"
        style="width: 100%; flex: 1 0 auto"
        dense
        onfocus="this.select()"
        filled
      >
        <template v-slot:append>
          <q-icon
            style="margin: 0"
            name="close"
            @click.stop.prevent="estado.productoFijo.producto = ''"
            class="cursor-pointer q-mr-md"
          />
        </template>
        <template v-slot:prepend>
          <q-icon name="bi-cart-plus" />
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No hay resultados
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <span class="grid grid-cols-3 gap-2 mt-2">
        <q-btn
          color="primary"
          label="Imp. prest."
          no-caps=""
          @click="estado.modal.isImportPresentation = true"
        />
        <q-input
          class="col-span-2"
          v-model.number="estado.productoFijo.presentacion"
          type="number"
          label="Cantidad"
          dense
          filled
          onfocus="this.select()"
          ><template v-slot:append>
            <q-icon
              style="margin: 0"
              name="close"
              @click.stop.prevent="estado.productoFijo.presentacion = ''"
              class="cursor-pointer q-mr-md"
            /> </template
        ></q-input>
      </span>
    </template>
  </Dialog>

  <!-- IMPORTAR PRESENTACION -->
  <Dialog
    v-model="estado.modal.isImportPresentation"
    title="Importar presentacion"
    :handle-submit="importarPresentacion"
    close-manual
  >
    <template #inputsDialog>
      <q-select
        v-model="estado.productoFijo.import"
        :options="estado.productoFijo.producto.presentaciones"
        label="Seleccionar presentacion"
        option-label="nombre"
        style="width: 100%; flex: 1 0 auto; margin-top: 10px"
        dense
        onfocus="this.select()"
        filled
      >
        <template v-slot:append>
          <q-icon
            style="margin: 0"
            name="close"
            @click.stop.prevent="estado.productoFijo.import = ''"
            class="cursor-pointer q-mr-md"
          />
        </template>
        <template v-slot:prepend>
          <q-icon name="bi-box-seam" />
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No hay resultados
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </template>
  </Dialog>
</template>

<script setup>
definePageMeta({
  layout: 'marca',
});
import { ref, onMounted } from 'vue';
import DragDrop from '@/components/DrogDrop.vue';
import { useOferta } from '@/composables/marca/useOferta';

const {
  estado,
  crearOferta,
  abrirModalIngredientes,
  obtenerTodosProductos,
  crearIngredienteProducto,
  importarPresentacion,
  storeOferta,
  editarOferta,
  editarIngrediente,
  editarIngredienteProducto,
  test,
} = useOferta();

//STORE
if (storeOferta.oferta) {
  estado.oferta = storeOferta.oferta;
}

const tags = ['empanadas', 'Masas', 'Embutidos', 'pedazos'];
const ingredientes = ref([
  { producto: 'Empanada😀', cantidad: 2, unidad: 'unidad' },
  { producto: 'Masa', cantidad: 2, unidad: 'unidad' },
  { producto: 'Embutido', cantidad: 2, unidad: 'unidad' },
]);
const condiciones = ref([
  { tipo: 'Fecha', valor: '14 de sep.' },
  { tipo: 'Dias', valor: 'lunes' },
  { tipo: 'Cantidad', valor: '25' },
]);

// const drag = ref(false);
const removeAt = (idx) => {
  ingredientes.value.splice(idx, 1);
};

onMounted(() => {
  obtenerTodosProductos();
});
</script>
