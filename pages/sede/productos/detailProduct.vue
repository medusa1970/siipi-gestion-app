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
          :readonly="useProduct.isEdit"
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
        @click="openAddPresentation()"
      />
    </div>
    <DragDrop
      :lista="producto.presentaciones"
      item-key="nombre"
      @edit="editPresentation"
      @delete="deletePresentation"
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
    v-model="dialog.isAddPresentation"
    :title="
      dialog.isEditPresentation ? 'Editar presentacion' : 'Agregar presentacion'
    "
    :handle-submit="
      dialog.isEditPresentation ? updatePresentation : addPresentation
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
import { useQuasar } from 'quasar';
import DragDrop from '@/components/DrogDrop.vue';

const $q = useQuasar();
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
  _id: '',
  nombre: '',
  cantidad: 0
});
const presentacionNombre = ref('');
const dialog = ref({
  isAddPresentation: false,
  isEditPresentation: false,
  isTest: false
});
const tags = ['empanadas', 'Masas', 'Embutidos', 'pedazos'];

if (useProduct.product) {
  producto.value = useProduct.product;
}

const agregarProducto = async () => {
  delete producto.value._id;
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
const editProductBasicInfo = async () => {
  console.log(producto.value);
  //@ts-ignore
  const { presentaciones, _creado, _id, nombre, ...productoData } =
    producto.value;
  try {
    showLoading();
    console.log(useProduct.product._id);
    console.log(productoData);
    const { productoModificar } = await GqlModificarProductos({
      busqueda: { _id: useProduct.product._id },
      datos: productoData
    });
    console.log(productoModificar);
    producto.value = Object.assign(producto.value, productoModificar[0]);
    NotifySucess('información básica actualizada correctamente');
    hideLoading();
  } catch (error) {
    ApiError(error);
  }
};
const openAddPresentation = () => {
  dialog.value.isAddPresentation = true;
  presentacion.value = {
    _id: '',
    nombre: '',
    cantidad: 0
  };
};

// CRUD
const addPresentation = async () => {
  if (useProduct.isEdit) {
    try {
      showLoading();
      const { productoAgregarPresentacion: res } = await GqlAgregarPresentacion(
        {
          busqueda: { _id: useProduct.product._id },
          datos: {
            nombre: presentacion.value.nombre,
            cantidad: presentacion.value.cantidad
          }
        }
      );
      if (res) {
        producto.value.presentaciones.push(res);
      }
      NotifySucess('presentacion agregado correctamente');
      dialog.value.isAddPresentation = false;
      hideLoading();
    } catch (error) {
      ApiError(error);
    }
  } else {
    producto.value.presentaciones.push({
      nombre: presentacion.value.nombre,
      cantidad: presentacion.value.cantidad
    });
    dialog.value.isAddPresentation = false;
  }
};
const editPresentation = (p: Presentacion) => {
  dialog.value.isAddPresentation = true;
  dialog.value.isEditPresentation = true;
  presentacion.value._id = p._id;
  presentacion.value.nombre = p.nombre;
  presentacion.value.cantidad = p.cantidad;
  presentacionNombre.value = p.nombre;
};
const updatePresentation = async () => {
  if (useProduct.isEdit) {
    try {
      showLoading();
      const { productoModificarPresentacion: res } =
        await GqlModificarPresentacion({
          busqueda: { _id: useProduct.product._id },
          busquedaPresentacion: { nombre: presentacionNombre.value },
          datos: presentacion.value
        });
      if (res) {
        const index = producto.value.presentaciones.findIndex(
          (p) => p._id === presentacion.value._id
        );
        if (index !== -1)
          producto.value.presentaciones[index] = presentacion.value;
      }
      NotifySucess('Presentacion modificado correctamente');
      hideLoading();
      dialog.value.isAddPresentation = false;
      dialog.value.isEditPresentation = false;
    } catch (error) {
      ApiError(error);
    }
    presentacion.value = {
      _id: '',
      nombre: '',
      cantidad: 0
    };
  } else {
    const index = producto.value.presentaciones.findIndex(
      (p) => p.nombre === presentacionNombre.value
    );
    if (index !== -1) {
      producto.value.presentaciones[index] = presentacion.value;
    }
    presentacion.value = {
      _id: '',
      nombre: '',
      cantidad: 0
    };
    dialog.value.isEditPresentation = false;
    dialog.value.isAddPresentation = false;
  }
};
const deletePresentation = async (presentacion: Presentacion) => {
  if (useProduct.isEdit) {
    $q.dialog({
      title: `Eliminar ${presentacion.nombre}`,
      message: '¿Está seguro de eliminar esta presentacion?',
      cancel: true,
      persistent: true
    }).onOk(async () => {
      showLoading();
      const { productoBorrarPresentacion: res } = await GqlBorrarPresentacion({
        busqueda: { _id: useProduct.product._id },
        busquedaPresentacion: { nombre: presentacion.nombre }
      });
      hideLoading();
      NotifySucess('Presentacion eliminado correctamente');
      if (res) {
        const index = producto.value.presentaciones.findIndex(
          (p) => p._id === presentacion._id
        );
        if (index !== -1) {
          producto.value.presentaciones.splice(index, 1);
        }
      }
    });
  } else {
    const index = producto.value.presentaciones.findIndex(
      (p) => p.nombre === presentacion.nombre
    );
    if (index !== -1) {
      producto.value.presentaciones.splice(index, 1);
    }
  }
};
</script>
