<template>
  <!-- <div class="p-2">
    <h1 class="font-semibold text-base mb-3">Información basicaa:</h1>
    <! -- INPUTS -- >
    <form
      @submit.prevent="
        storeOferta.isEdit === false ? crearOferta() : editarOferta()
      "
    >
      <h1 class="text-lg font-extrabold uppercase text-center mb-3">
        {{ storeOferta.isEdit === true ? 'Editar Oferta' : 'Agregar Oferta' }}
      </h1>
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
      <div class="w-full grid grid-cols-6 gap-2 my-4">
        <q-input
          class="col-span-2"
          v-model="estado.oferta.nombre"
          type="text"
          label="Nombre*"
          outlined
          dense
          clearable
          required
        />
        <q-input
          class="col-span-2"
          v-model="estado.oferta.abreviacion"
          label="Abreviacion"
          outlined
          dense
          clearable
        />
        <q-input
          class="col-span-2"
          v-model.number="estado.oferta.precio"
          type="number"
          label="Precio*"
          outlined
          dense
          clearable
          required
        />

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
          class="col-span-3"
          v-model="estado.oferta.catalogoNombre"
          label="Catalogo*"
          outlined
          dense
          clearable
          disable
          required
        />
        <q-input
          class="col-span-3"
          v-model="estado.oferta.descripcion"
          type="textarea"
          label="Descripcion"
          outlined
          dense
        />
        <q-select
          class="col-span-3"
          v-model="estado.productoFijo.producto"
          :options="optionsProducts"
          label="Seleccionar producto"
          option-label="nombre"
          style="width: 100%; flex: 1 0 auto"
          outlined
          @filter="filterProductos"
          onfocus="this.select()"
          use-input
          hide-selected
          fill-input
          dense
          clearable
        >
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
      <q-btn
        color="secondary"
        :label="
          storeOferta.isEdit === false ? 'Crear oferta' : 'Editar información'
        "
        no-caps
        type="submit"
      />
    </form>
  </div> -->

  <Navigation
    label="Productos"
    icon="list_alt"
    label2="producto.datosBasicos.nombre"
    href="/cathering/sede/ofertas"
  />

  <!--
    TABS
    -->

  <q-tabs
    v-model="estado.tab"
    inline-label
    outside-arrows
    mobile-arrows
    class="bg-grey-7 text-white shadow-2"
    align="justify"
    no-caps
  >
    <q-tab name="datosBasicos" icon="storefront" label="Datos basicos" />
    <q-tab v-if="soloAlmacen" name="productos" icon="group" label="Productos" />
    <q-tab
      v-if="soloAlmacenAdquisicion"
      name="precios"
      icon="folder_copy"
      label="Precios"
    />
    <q-tab name="acciones" icon="delete" label="Borrar" />
  </q-tabs>
</template>

<script setup>
definePageMeta({
  layout: 'cathering',
});
import { ref, onMounted } from 'vue';
import DragDrop from '@/components/DrogDrop.vue';
import { useOferta } from '@/composables/marca/useOferta';
import { ofertaService } from '~/services/ofertas.service';
import { useAuth } from '~/composables/auth/useAuth';

// Verificacion de permisos
const { checkPermisos } = useAuth();
if (!checkPermisos(['ALMACEN', 'ADQUISICION', 'TODO'])) {
  console.log('No tiene el acceso para esta pagina');
}
const soloAlmacen = ref(checkPermisos(['ALMACEN']));
const soloAdquisicion = ref(checkPermisos(['ADQUISICION']));
const soloAlmacenAdquisicion = ref(checkPermisos(['ADQUISICION', 'ALMACEN']));

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
  imagen,
  imagePreview,
  optionsProducts,
  filterProductos,
} = useOferta();

//STORE
if (storeOferta.oferta) {
  let { producto, cantidad, ...oferta } = storeOferta.oferta;
  estado.oferta = oferta;
  estado.productoFijo.producto = storeOferta.oferta.producto;
  estado.productoFijo.presentacion = storeOferta.oferta.cantidad;
  estado.productoFijo.ingredienteID = storeOferta.oferta.idIngrediente;
  console.log(storeOferta.oferta);
  if (storeOferta.oferta.imagen)
    //@ts-ignore
    imagePreview.value = storeOferta.oferta.imagen;
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
  // const catalogoArbol = await ofertaService.buscarCatalogos();
  // estado.catalogos = catalogoArbol.hijas.map((item) => {
  //   return {
  //     id: item._id,
  //     nombre: item.nombre,
  //   };
  // });
});
</script>

<style scoped>
.q-tab {
  padding: 0 10px;
  margin-bottom: 0px;
  /* border: 2px solid red; */
}
</style>
