<template>
  <div>
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
    <span class="flex gap-8 items-center my-3">
      <span class="flex flex-col gap-2 w-80">
        <h1>{{ estado.producto.nombre }}</h1>
        <q-input
          v-model="estado.producto.nombre"
          type="text"
          label="Nombre"
          outlined
          dense
          :readonly="useProduct.isEdit"
        />
        <q-select
          v-model="estado.producto.tags"
          multiple
          outlined
          dense
          use-chips
          stack-label
          label="Tags"
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
          v-model="estado.producto.presentacionBasica"
          type="text"
          label="Presentacion básica"
          outlined
          dense
        />
      </span>
      <q-input
        class="w-1/2"
        v-model="estado.producto.descripcion"
        type="textarea"
        label="Descripcion"
        outlined
        dense
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
<script setup lang="ts">
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
  borrarPresentacion
} = useProducts();
</script>
