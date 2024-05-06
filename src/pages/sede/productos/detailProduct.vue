<template>
  <Navigation
    label="Productos"
    icon="list_alt"
    label2="DetalleProducto"
    href="/sede/productos"
  />
  <form @submit.prevent="agregarProducto()" class="p-2">
    <h1 class="text-lg font-bold mb-1">
      {{ useProduct.isEdit === true ? 'Editar Producto' : 'Agregar Producto' }}
    </h1>
    <!-- IMAGE -->
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
    <div v-if="imagePreview" style="width: 200px; height: 200px; margin: auto">
      <q-img
        style="width: 100%; height: 100%; object-fit: cover"
        :src="imagePreview"
      ></q-img>
    </div>
    <span class="flex flex-col gap-2 my-3 w-[50vw] max-sm:w-full">
      <q-input
        v-model="estado.producto.nombre"
        type="text"
        label="Nombre"
        outlined
        dense
        :readonly="useProduct.isEdit"
        clearable
        required
      />

      <span class="flex flex-row gap-2">
        <q-select
          v-model="estado.categoriaFija.categoria"
          :options="estado.categorias.hijas"
          label="Seleccionar categoria"
          option-label="nombre"
          style="width: auto; flex: 1 0 auto"
          dense
          onfocus="this.select()"
          outlined
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="category" />
          </template>
        </q-select>
        <q-select
          v-model="estado.producto.categoria"
          :options="estado.categoriaFija.categoria.hijas"
          label="Seleccionar subCategoria"
          option-label="nombre"
          style="width: auto; flex: 1 0 auto"
          dense
          onfocus="this.select()"
          outlined
          clearable
        >
          <!-- <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No hay resultados
              </q-item-section>
            </q-item>
          </template> -->
        </q-select>
      </span>

      <q-input
        v-model="estado.producto.presentacionBasica"
        type="text"
        label="Presentacion básica"
        outlined
        dense
        clearable
      />
      <q-input
        v-model="estado.producto.comentario"
        type="textarea"
        label="Comentario"
        outlined
        dense
        clearable
        required
      />
    </span>
    <q-btn
      v-if="useProduct.isEdit"
      color="secondary"
      label="Editar información básica"
      no-caps
      class="mb-3"
      @click="editProductBasicInfo()"
    />

    <div class="flex gap-3 mb-3 items-center">
      <span class="leading-none">
        <h1 class="font-semibold text-base">Agregar presentacion</h1>
        <p style="font-size: 12px" class="text-gray-500">
          Producto con diferente presentacion
        </p>
      </span>
      <q-btn
        icon="add"
        dense
        round
        color="primary"
        size="md"
        @click="modalAgregarPresentacion"
      />
    </div>
    <DragDrop
      :lista="estado.producto.presentaciones"
      item-key="nombre"
      @edit="modalEditarPresentacion"
      @delete="borrarPresentacion"
    />
    <br />
    <q-btn
      v-if="useProduct.isEdit === false"
      color="secondary"
      label="
        Agregar Producto
      "
      type="submit"
      no-caps
    />
  </form>
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
</template>

<script setup>
import { onMounted } from 'vue';
import { useProducts } from '@/composables/sede/useProducts';
import DragDrop from '@/components/DrogDrop.vue';

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
} = useProducts();

definePageMeta({
  layout: 'sede',
});

onMounted(() => {
  getCategoria();
});
</script>
