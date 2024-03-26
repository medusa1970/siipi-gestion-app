<template>
  <div>
    <Navigation
      label="Ofertas"
      icon="list_alt"
      href="/sede/ofertas"
      label2="DetailOferta"
    />
    <div class="p-2">
      <h1 class="font-semibold text-base mb-3">Información basicaa:</h1>
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
      <!-- INPUTS -->
      <div class="w-full grid grid-cols-6 gap-2 my-4">
        <q-input
          class="col-span-2"
          v-model="estado.oferta.nombre"
          type="text"
          label="Nombre"
          outlined
          dense
          clearable
        />
        <q-input
          class="col-span-2"
          v-model.number="estado.oferta.precio"
          type="number"
          label="Precio"
          outlined
          dense
          clearable
        />
        <q-input
          class="col-span-2"
          v-model="estado.oferta.catalogo"
          label="Catalogo"
          outlined
          dense
          clearable
          disable
        />
        <!-- <q-select
          class="col-span-2"
          v-model="estado.oferta.catalogo"
          :options="estado.catalogos && estado.catalogos.hijas"
          label="Seleccionar catalogo"
          option-label="nombre"
          style="width: 100%; flex: 1 0 auto"
          dense
          onfocus="this.select()"
          clearable
          outlined
        >
        </q-select> -->
        <div v-if="estado.catalogos" class="col-span-6 flex flex-col">
          <h1 class="font-bold">Seleccionar catalogo:</h1>
          <div class="flex gap-2 flex-wrap">
            <div v-for="catalogo in estado.catalogos.hijas" :key="catalogo">
              <q-btn
                color="primary"
                :label="catalogo.nombre"
                no-caps
                padding="0 10px"
                size="13px"
                @click="abrirModalCatalogo(catalogo)"
              />
            </div>
          </div>
        </div>
        <q-input
          class="col-span-6"
          v-model="estado.oferta.descripcion"
          type="textarea"
          label="Descripcion"
          outlined
          dense
        />
        <q-select
          class="col-span-3"
          v-model="estado.productoFijo.producto"
          :options="estado.productos"
          label="Seleccionar productosss"
          option-label="nombre"
          style="width: 100%; flex: 1 0 auto"
          dense
          onfocus="this.select()"
          clearable
          outlined
          emit-value
          use-input
          input-debounce="0"
        >
          <template v-slot:prepend>
            <q-icon name="bi-cart-plus" />
          </template>
        </q-select>
        <q-btn
          v-if="estado.productoFijo.producto"
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
          clearable
          onfocus="this.select()"
          outlined
        ></q-input>
      </div>
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
    <!-- <div>
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
    </div> -->
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

  <!-- SELECCIONAR CATALOGO -->
  <Dialog
    v-model="estado.modal.isShowCatalogo"
    title="Seleccionar catalogo"
    close-manual
  >
    <template #inputsDialog>
      <q-list
        class="rounded-borders w-[350px]"
        v-for="categoria in estado.catalogoSeleccionado.hijas"
        :key="categoria.nombre"
      >
        <q-expansion-item
          expand-separator
          icon="category"
          :label="categoria.nombre"
          dense
        >
          <q-list
            v-for="(item, index) in categoria.hijas"
            :key="index"
            class=""
          >
            <q-item clickable dense>
              <q-item-section side @click="elegirCatalogo(item._id)">
                <h1 class="ml-11">{{ item.nombre }}</h1>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </q-list>
    </template>
  </Dialog>
</template>

<script setup>
definePageMeta({
  layout: 'sede',
});
import { ref, onMounted } from 'vue';
import DragDrop from '@/components/DrogDrop.vue';
import { useOferta } from '@/composables/marca/useOferta';
import { ofertaService } from '~/services/marca/ofertas.service';

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
  obtenerTodoCatalagos,
  abrirModalCatalogo,
  elegirCatalogo,
  pruebaProducto,
} = useOferta();

//STORE
if (storeOferta.oferta) {
  let { producto, cantidad, ...oferta } = storeOferta.oferta;
  estado.oferta = oferta;
  estado.productoFijo.producto = storeOferta.oferta.producto;
  estado.productoFijo.presentacion = storeOferta.oferta.cantidad;
}

const catalogos = ['catalogo Siipime', 'catalogo compra proveedor'];
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

onMounted(async () => {
  obtenerTodoCatalagos();
  obtenerTodosProductos();
  // const { catalogoArbol } = await ofertaService.buscarCatalogos();
  // estado.catalogos = catalogoArbol.hijas.map((item) => {
  //   return {
  //     id: item._id,
  //     nombre: item.nombre,
  //   };
  // });
});
</script>
