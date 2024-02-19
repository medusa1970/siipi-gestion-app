<template>
  <div class="p-2">
    <h1 class="text-lg font-bold mb-1">
      {{ useProduct.isEdit === true ? 'Editar Producto' : 'Agregar Producto' }}
    </h1>
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
    <span class="flex flex-col gap-2 my-3 w-[50vw] max-sm:w-full">
      <q-input
        v-model="estado.producto.nombre"
        type="text"
        label="Nombre"
        outlined
        dense
        :readonly="useProduct.isEdit"
        clearable
      />

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
      @click="agregarProducto()"
      no-caps
    />
  </div>
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
} = useProducts();

definePageMeta({
  layout: 'sede',
});
</script>
