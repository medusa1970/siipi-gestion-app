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
        <q-input
          v-model="producto.nombre"
          type="text"
          label="Nombre"
          outlined
          dense
        />
        <q-select
          v-model="producto.tags"
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
          v-model="producto.presentacionBasica"
          type="text"
          label="Presentacion básica"
          outlined
          dense
        />
      </span>
      <q-input
        class="w-1/2"
        v-model="producto.descripcion"
        type="textarea"
        label="Descripcion"
        outlined
        dense
      />
    </span>
    <q-btn
      v-if="useProduct.isEdit === true"
      color="secondary"
      label="Editar información"
      no-caps
      class="mb-3"
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
        @click="dialog.isAddPresentation = true"
      />
    </div>
    <div class="flex gap-2 items-center">
      <span
        v-for="presentacion in producto.presentaciones"
        class="bg-[#1976D2] rounded-full py-[2px] px-3 text-white capitalize"
      >
        <q-icon name="bi-cake" />
        {{ presentacion.nombre }}
        <q-btn
          color="white"
          icon="edit"
          round
          dense
          text-color="primary"
          size="sm"
          class="mx-1"
          @click="editPresentation(presentacion)"
        />
        <q-btn
          color="white"
          text-color="primary"
          icon="close"
          round
          dense
          size="sm"
          @click="deletePresentation(presentacion)"
        />
      </span>
    </div>
    <br />
    <q-btn
      color="secondary"
      :label="
        useProduct.isEdit === true ? 'Editar Presentacion' : 'Agregar Producto'
      "
      @click="useProduct.isEdit === true ? editPresentation : agregarProducto()"
      no-caps
    />
  </div>
  <!-- DIALOG -->
  <Dialog
    v-model="dialog.isAddPresentation"
    :title="
      dialog.isEditPresentation ? 'Editar presentacion' : 'Agregar presentacion'
    "
    :handle-submit="
      dialog.isEditPresentation ? updatePresentation : savePresentation
    "
  >
    <template #inputsDialog>
      <div class="flex flex-col gap-2">
        <q-input
          v-model="presentacion.nombre"
          type="text"
          label="Nombre"
          outlined
          dense
        />
        <q-input
          v-model.number="presentacion.cantidad"
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
import { ref } from 'vue';
import { productStore } from '@/stores/producto.store';
import type { Presentacion, Product } from '@/interfaces/product.interface';
import Dialog from '@/components/Dialog.vue';
import {
  showLoading,
  hideLoading,
  ApiError,
  NotifySucess
} from '@/helpers/message.service';
import { useRouter } from 'vue-router';

const useProduct = productStore();
const router = useRouter();
const image = ref(null);
const producto = ref<Product>({
  _id: '',
  nombre: '',
  descripcion: '',
  tags: [],
  presentacionBasica: '',
  presentaciones: []
});
const presentacion = ref<Presentacion>({
  nombre: '',
  cantidad: 0
});
const vanilla = ref(true);
const dialog = ref({
  isAddPresentation: false,
  isEditPresentation: false
});
const tags = ['empanadas', 'Masas', 'Embutidos', 'pedazos'];

if (useProduct.product) {
  producto.value = useProduct.product;
}
const savePresentation = () => {
  producto.value.presentaciones.push({
    nombre: presentacion.value.nombre,
    cantidad: presentacion.value.cantidad
  });
  dialog.value.isAddPresentation = false;
};
const deletePresentation = (presentacion: Presentacion) => {
  const index = producto.value.presentaciones.findIndex(
    (p) => p.nombre === presentacion.nombre
  );
  if (index !== -1) {
    producto.value.presentaciones.splice(index, 1);
  }
};
const editPresentation = (p: Presentacion) => {
  dialog.value.isAddPresentation = true;
  dialog.value.isEditPresentation = true;
  presentacion.value.nombre = p.nombre;
  presentacion.value.cantidad = p.cantidad;
};
const updatePresentation = () => {
  console.log(presentacion.value);
  dialog.value.isAddPresentation = false;
  dialog.value.isEditPresentation = false;
};
const agregarProducto = async () => {
  delete producto.value._id;
  console.log(producto.value);
  try {
    showLoading();
    await GqlCrearProducto({
      datos: producto.value
    });
    NotifySucess('Producto creado');
    hideLoading();
    router.push('/sede/productos');
  } catch (error) {
    ApiError(error);
  }
};
</script>
