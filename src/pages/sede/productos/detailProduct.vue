<template>
  <Navigation
    label="Productos"
    icon="list_alt"
    label2="DetalleProducto"
    href="/sede/productos"
  />

  <!-- TABS -->
  <q-tabs
    v-model="estado.tab"
    inline-label
    outside-arrows
    mobile-arrows
    class="bg-grey-7 text-white shadow-2"
    align="justify"
    no-caps
  >
    <div class="!flex h-full">
      <q-btn icon="arrow_back" flat />
      <q-btn icon="apps_outage" flat />
    </div>
    <q-tab name="datosBasicos" icon="storefront" label="Datos basicos" />
    <q-tab name="marcas" icon="group" label="Marca" />
    <q-tab name="medidas" icon="folder_copy" label="Medidas & Empaque" />
    <q-tab name="proveedores" icon="query_stats" label="Proveedores" />
  </q-tabs>
  <q-tab-panels
    v-model="estado.tab"
    animated
    style="height: calc(100vh - 115px)"
  >
    <q-tab-panel name="datosBasicos" animated>
      <div class="grid grid-cols-2 gap-6">
        <div class="col-span-1 !p-0 flex flex-col gap-4">
          <q-input
            v-model="producto.datosBasicos.nombre"
            type="text"
            label="Nombre"
            filled
          />
          <div class="select-container">
            <select
              id="two-level-select"
              class="bg-grey-3 text-grey-7 rounded-[4px] shadow-sm text-base block w-full py-4 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              v-model="producto.datosBasicos.categoria"
            >
              <option value="" disabled selected>
                Selecciona una categoria
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
          <q-input
            v-model="producto.datosBasicos.comentario"
            type="text"
            label="Comentario"
            filled
          />
          <q-input
            v-model="producto.datosBasicos.tiempoVida"
            type="text"
            label="Tiempo de vida"
            filled
          />
          <q-file
            v-model="imagen"
            label="Seleccionar imagen"
            accept=".jpg, .png, .jpge"
            max-total-size="560000"
            @rejected="onRejected"
            counter
            filled
            hint="Tamaño máximo de imagen 540KB"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="cloud_upload" @click.stop.prevent />
            </template>
          </q-file>
        </div>

        <div class="col-span-1 !p-0">
          <q-card style="width: 100%; height: 400px; margin: auto">
            <q-img
              style="width: 100%; height: 100%; object-fit: cover"
              :src="imagePreview"
              ><div class="absolute-bottom">
                <div class="text-h6 text-center">IMAGEN</div>
              </div></q-img
            >
          </q-card>
        </div>
      </div>
      <q-btn
        color="primary"
        label="Editar informacion"
        no-caps
        class="block mx-auto mt-5"
        @click="editarDatosBasicos"
      />
    </q-tab-panel>
    <q-tab-panel name="marcas" animated>
      <h1 class="font-extrabold text-xs">MARCAS:</h1>
      <Table :columns="marcas" style="border: 1px solid gray">
        <template #dropdown>
          <q-btn
            color="primary"
            icon="add"
            label="Agregar marca"
            no-caps
            @click="estado.modal.isAddMarca = true"
          />
        </template>
      </Table>
    </q-tab-panel>
    <q-tab-panel name="medidas" animated>
      <div class="flex flex-col mt-3 mb-3">
        <h1 class="font-extrabold text-xs">MEDIDAS BASICAS:</h1>

        <div class="!flex flex-row w-full gap-3 items-center">
          <q-select
            color="primary"
            v-model="brandSelected"
            :options="optionsBrand"
            label="Seleccionar medida basica"
            option-label="name"
            emit-value
            use-input
            outlined
            dense
            input-debounce="0"
            hide-selected
            fill-input
            onfocus="this.select()"
            class="w-full"
          >
            <template v-slot:append>
              <q-icon
                style="margin: 0"
                name="close"
                @click.stop.prevent="brandSelected = ''"
                class="cursor-pointer q-mr-md"
              />
            </template>
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
          <q-btn
            size="12px"
            icon="add"
            color="primary"
            round
            style="height: 16px"
            @click="isAddBrand = true"
          ></q-btn>
        </div>
      </div>

      <h1 class="font-extrabold text-xs">EMPAQUES:</h1>
      <Table :columns="marcas" style="border: 1px solid gray">
        <template #dropdown>
          <q-btn
            color="primary"
            icon="add"
            label="Agregar empaques"
            no-caps
            @click="estado.modal.isAddEmpaque = true"
          />
        </template>
      </Table>
    </q-tab-panel>

    <q-tab-panel name="proveedores" animated>
      <h1 class="font-extrabold text-xs">PROVEEDORES:</h1>

      <Table :columns="proveedores" style="border: 1px solid gray">
        <template #dropdown>
          <q-btn
            color="primary"
            icon="add"
            label="Agregar proveedores"
            no-caps
            @click="estado.modal.isAddProveedor = true"
          />
        </template>
      </Table>
    </q-tab-panel>
  </q-tab-panels>

  <!-- DIALOG -->
  <Dialog
    v-model="estado.dialog.isAddPresentation"
    :title="
      estado.dialog.isEditPresentation
        ? 'Editar presentacion'
        : 'Agregar presentacion'
    "
    :handle-submit="
      estado.dialog.isEditPresentation
        ? modificarPresentacion
        : agregarPresentacion
    "
  >
    <template #inputsDialog>
      <div class="flex flex-col gap-2">
        <q-input
          v-model="estado.presentacion.nombre"
          type="text"
          label="Nombre"
          outlined
          dense
        />
        <q-input
          v-model.number="estado.presentacion.cantidad"
          type="number"
          label="cantidad"
          outlined
          dense
        />
      </div>
    </template>
  </Dialog>

  <!-- PRODUCTO MARCA -->
  <Dialog2
    v-model="estado.modal.isAddMarca"
    title="Agregar marca"
    label-btn="Crear"
  >
    <template #inputsDialog>
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">MARCA</h1>

      <div class="flex flex-col gap-2 mt-3">
        <div class="!flex flex-row w-full gap-3 items-center">
          <q-select
            color="primary"
            v-model="brandSelected"
            :options="optionsBrand"
            label="Seleccionar marca"
            option-label="name"
            emit-value
            use-input
            outlined
            dense
            input-debounce="0"
            hide-selected
            fill-input
            onfocus="this.select()"
            class="w-full"
          >
            <template v-slot:append>
              <q-icon
                style="margin: 0"
                name="close"
                @click.stop.prevent="brandSelected = ''"
                class="cursor-pointer q-mr-md"
              />
            </template>
            <template v-slot:prepend>
              <q-icon name="branding_watermark" />
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
            size="12px"
            icon="add"
            color="primary"
            round
            style="height: 16px"
            @click="isAddBrand = true"
          ></q-btn>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <q-input
            v-model="text"
            type="text"
            label="Minimo"
            outlined
            dense
            clearable
            required
          />
          <q-input
            v-model="text"
            type="text"
            label="Maximo"
            outlined
            dense
            clearable
            required
          />
        </div>
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
      </div>
    </template>
  </Dialog2>

  <!-- EMPAQUES  -->
  <Dialog2
    v-model="estado.modal.isAddEmpaque"
    title="Agregar empaque"
    label-btn="Crear"
  >
    <template #inputsDialog>
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">Empaque</h1>

      <div class="flex flex-col gap-2 mt-3">
        <div class="!flex flex-row w-full gap-3 items-center">
          <q-select
            color="primary"
            v-model="brandSelected"
            :options="optionsBrand"
            label="Seleccionar empaque"
            option-label="name"
            emit-value
            use-input
            outlined
            dense
            input-debounce="0"
            hide-selected
            fill-input
            onfocus="this.select()"
            class="w-full"
          >
            <template v-slot:append>
              <q-icon
                style="margin: 0"
                name="close"
                @click.stop.prevent="brandSelected = ''"
                class="cursor-pointer q-mr-md"
              />
            </template>
            <template v-slot:prepend>
              <q-icon name="bi-box2" />
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
            size="12px"
            icon="add"
            color="primary"
            round
            style="height: 16px"
            @click="isAddBrand = true"
          ></q-btn>
        </div>
        <div class="!flex flex-row w-full gap-3 items-center">
          <q-select
            color="primary"
            v-model="brandSelected"
            :options="optionsBrand"
            label="Seleccionar marca"
            option-label="name"
            emit-value
            use-input
            outlined
            dense
            input-debounce="0"
            hide-selected
            fill-input
            onfocus="this.select()"
            class="w-full"
          >
            <template v-slot:append>
              <q-icon
                style="margin: 0"
                name="close"
                @click.stop.prevent="brandSelected = ''"
                class="cursor-pointer q-mr-md"
              />
            </template>
            <template v-slot:prepend>
              <q-icon name="branding_watermark" />
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
            size="12px"
            icon="add"
            color="primary"
            round
            style="height: 16px"
            @click="isAddBrand = true"
          ></q-btn>
        </div>
        <q-input
          v-model="text"
          type="text"
          label="Abreviacion"
          outlined
          dense
          clearable
          required
        />
        <q-input
          v-model="text"
          type="text"
          label="Cantidad"
          outlined
          dense
          clearable
          required
        />
      </div>
    </template>
  </Dialog2>

  <!-- PRODUCTO PROVEEDOR -->
  <Dialog2
    v-model="estado.modal.isAddProveedor"
    title="Agregar proveedores"
    label-btn="Crear"
  >
    <template #inputsDialog>
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">PROVEEDORES</h1>

      <div class="flex flex-col gap-2 mt-3">
        <div class="!flex flex-row w-full gap-3 items-center">
          <q-select
            color="primary"
            v-model="brandSelected"
            :options="optionsBrand"
            label="Seleccionar proveedor"
            option-label="name"
            emit-value
            use-input
            outlined
            dense
            input-debounce="0"
            hide-selected
            fill-input
            onfocus="this.select()"
            class="w-full"
          >
            <template v-slot:append>
              <q-icon
                style="margin: 0"
                name="close"
                @click.stop.prevent="brandSelected = ''"
                class="cursor-pointer q-mr-md"
              />
            </template>
            <template v-slot:prepend>
              <q-icon name="branding_watermark" />
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
            size="12px"
            icon="add"
            color="primary"
            round
            style="height: 16px"
            @click="isAddBrand = true"
          ></q-btn>
        </div>
        <div class="!flex flex-row w-full gap-3 items-center">
          <q-select
            color="primary"
            v-model="brandSelected"
            :options="optionsBrand"
            label="Seleccionar marca"
            option-label="name"
            emit-value
            use-input
            outlined
            dense
            input-debounce="0"
            hide-selected
            fill-input
            onfocus="this.select()"
            class="w-full"
          >
            <template v-slot:append>
              <q-icon
                style="margin: 0"
                name="close"
                @click.stop.prevent="brandSelected = ''"
                class="cursor-pointer q-mr-md"
              />
            </template>
            <template v-slot:prepend>
              <q-icon name="branding_watermark" />
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
            size="12px"
            icon="add"
            color="primary"
            round
            style="height: 16px"
            @click="isAddBrand = true"
          ></q-btn>
        </div>
        <q-input
          v-model="text"
          type="text"
          label="Identificativo"
          outlined
          dense
          clearable
          required
        />
        <q-input
          v-model="text"
          type="text"
          label="Precios"
          outlined
          dense
          clearable
          required
        />
      </div>
    </template>
  </Dialog2>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useProducts } from '@/composables/sede/useProducts';
import { marcas, proveedores } from '~/helpers/columns';

const {
  tags,
  agregarProducto,
  editProductBasicInfo,
  estado,
  useProduct,
  modalAgregarPresentacion,
  agregarPresentacion,
  modalEditarPresentacion,
  modificarPresentacion,
  borrarPresentacion,
  getCategoria,
  imagen,
  imagePreview,
  selectedFile,
  producto,
  editarDatosBasicos,
} = useProducts();

definePageMeta({
  layout: 'sede',
});

const imageSrc = ref(
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8EgZkQGSD3pNxbv7Rh6RVWvXT2oDaZxf_bg&usqp=CAU',
);
const uploader = ref(null);

const pickFiles = () => {
  uploader.value.pickFiles();
};

const onAdded = (files) => {
  console.log(files);
  const reader = new FileReader();
  reader.onload = (e) => {
    console.log(reader);
    imageSrc.value = e.target.result;
  };
  reader.readAsDataURL(files[0]);
};

onMounted(() => {
  getCategoria();
});
</script>

<style scoped>
.q-tab {
  padding: 0 10px;
  margin-bottom: 0px;
  /* border: 2px solid red; */
}
</style>
