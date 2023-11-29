<template>
  <div>
    <Navigation label="Productos" icon="list_alt" />
    <Table badge :rows="productos" :columns="columnsProductos" dense>
      <template #dropdown>
        <q-btn
          icon-right="add"
          color="green"
          label="Agregar producto"
          no-caps
          style="padding: 7px 15px"
          @click="agregarProducto()"
        />
      </template>
      <!-- BADGE -->
      <template #rows-badge="{ props }">
        <q-tr :props="props">
          <q-td key="nombre" :props="props">
            {{ props.row.nombre }}
          </q-td>
          <q-td key="descripcion" :props="props">
            {{ props.row.descripcion }}
          </q-td>
          <q-td key="presentacionBasica" :props="props">
            {{ props.row.presentacionBasica }}
          </q-td>
          <q-td key="presentaciones" :props="props">
            <div class="flex gap-1">
              <div v-for="(p, index) in props.row.presentaciones" :key="index">
                <q-badge color="blue" class="capitalize">
                  {{ p.nombre }}
                </q-badge>
              </div>
            </div>
          </q-td>
          <q-td key="tags" :props="props">
            <div class="flex gap-1">
              <div v-for="(p, index) in props.row.tags" :key="index">
                <q-badge color="green" class="capitalize">
                  {{ p }}
                </q-badge>
              </div>
            </div>
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              color="primary"
              icon="edit"
              round
              dense
              flat
              @click="editProduct(props.row)"
            />
            <q-btn
              color="red"
              icon="delete"
              round
              dense
              flat
              @click="borrarProducto(props.row)"
            />
          </q-td>
        </q-tr>
      </template>
    </Table>
  </div>

  <!-- MODAL AGREGAR PRODUCTO -->
  <Dialog
    v-model="test"
    title="Agregar producto"
    :handle-submit="crearProducto"
  >
    <template #inputsDialog>
      <q-input v-model="producto.nombre" type="text" label="Nombre" />
      <q-input v-model="producto.descripcion" type="text" label="Descripcion" />
      <q-select
        v-model="producto.tags"
        multiple
        :options="tags"
        use-chips
        stack-label
        label="Tags"
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
        label="presentacion básica"
        ><template v-slot:prepend> <q-icon name="straighten" /> </template
      ></q-input>

      <span
        style="
          display: flex;
          gap: 10px;
          justify-content: center;
          align-items: center;
        "
      >
        <q-input
          color="secondary"
          label="Presentaciones"
          v-model="combinedName"
          readonly
          style="flex: 1 0 auto"
          ><template v-slot:prepend>
            <q-icon name="bi-box-seam-fill" /> </template
        ></q-input>
        <q-btn
          size="14px"
          icon="add"
          color="primary"
          round
          style="height: 14px"
          @click="() => (isAddPresentation = true)"
        ></q-btn>
      </span>
    </template>
  </Dialog>

  <!-- MODAL AGREGAR PRESENTACION -->
  <Dialog
    v-model="isAddPresentation"
    title="Agregar presentaciones"
    card-big
    :handle-submit="savePresentations"
  >
    <template #inputsDialog>
      <span
        style="
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
        "
      >
        <q-btn
          color="primary"
          dense
          no-caps
          label="Agregar fila"
          @click="addRowsIntTable"
        />
      </span>
      <table @click="isProve = true" class="table">
        <thead>
          <tr>
            <th>Presentacion</th>
            <th style="width: 150px">Cantidad</th>
            <th style="width: 20px">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(presentacion, index) in producto.presentaciones"
            :key="index"
          >
            <td>
              <q-input
                v-model="presentacion.nombre"
                filled
                dense
                emit-value
                label="Nombre"
                onfocus="this.select()"
              />
            </td>
            <td>
              <q-input
                v-model.number="presentacion.cantidad"
                filled
                dense
                type="number"
                onfocus="this.select()"
              />
            </td>
            <td>
              <q-btn
                icon="delete"
                flat
                round
                color="red"
                dense
                size="12px"
                @click="removeItemTable(index)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </Dialog>

  <!-- MODAL EDITAR PRODUCTO -->
  <Dialog
    v-model="isEditProduct"
    title="Editar producto"
    :handle-submit="crearProducto"
  >
    <template #inputsDialog>
      <q-input v-model="producto.nombre" type="text" label="Nombre" />
      <q-input v-model="producto.descripcion" type="text" label="Descripcion" />
      <q-select
        v-model="producto.tags"
        multiple
        :options="tags"
        use-chips
        stack-label
        label="Tags"
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
        label="presentacion básica"
        ><template v-slot:prepend> <q-icon name="straighten" /> </template
      ></q-input>

      <span
        style="
          display: flex;
          gap: 10px;
          justify-content: center;
          align-items: center;
        "
      >
        <q-input
          color="secondary"
          label="Presentaciones"
          v-model="combinedName"
          readonly
          style="flex: 1 0 auto"
          ><template v-slot:prepend>
            <q-icon name="bi-box-seam-fill" /> </template
        ></q-input>
        <q-btn
          size="14px"
          icon="add"
          color="primary"
          round
          style="height: 14px"
          @click="() => (isAddPresentation = true)"
        ></q-btn>
      </span>
    </template>
  </Dialog>
  <Dialog v-model="isAddPrueba" title="Agregar presentacion">
    <template #inputsDialog>
      <q-input v-model="producto.nombre" type="text" label="presentacion" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
// import { Productos } from '@/mocks/data.json';
import { columnsProductos } from '@/helpers/columns';
import { ref, onMounted } from 'vue';
import {
  showLoading,
  hideLoading,
  ApiError,
  NotifySucess
} from '@/helpers/message.service';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { productStore } from '@/stores/producto.store';
import type { Presentacion } from '~/interfaces/product.interface';

const useProduct = productStore();
const router = useRouter();
const $q = useQuasar();
const test = ref(false);
const isAddPresentation = ref(false);
const productos = ref([]);
const producto = ref({
  nombre: '',
  descripcion: '',
  tags: [],
  presentacionBasica: '',
  presentaciones: [{ nombre: '', cantidad: 0 }]
});
const isProve = ref(false);
const isEditProduct = ref(false);
const isAddPrueba = ref(false);

const tags = ['empanadas', 'Masas', 'Embutidos', 'pedazos'];

const getAllProductos = async () => {
  try {
    showLoading();
    const { productoBuscar } = await GqlBuscarProductos({
      busqueda: {}
    });
    //@ts-ignore
    productos.value = productoBuscar;
    hideLoading();
  } catch (error) {
    ApiError(error);
  }
};

const crearProducto = async () => {
  console.log(producto.value);
  try {
    showLoading();
    await GqlCrearProducto({
      datos: producto.value
    });
    getAllProductos();
    NotifySucess('Producto creado');
    hideLoading();
    test.value = false;
  } catch (error) {
    ApiError(error);
  }
};

const addRowsIntTable = () => {
  producto.value.presentaciones.push({
    nombre: '',
    cantidad: 0
  });
};
const removeItemTable = (index: number) => {
  producto.value.presentaciones.splice(index, 1);
};

const savePresentations = () => {
  isAddPresentation.value = false;
};

const combinedName = computed(() => {
  const name = producto.value.presentaciones.map((p) => {
    return p.nombre;
  });
  return name.join(', ');
});

const borrarProducto = (row: { _id: string; nombre: string }) => {
  $q.dialog({
    title: `Eliminar ${row.nombre}`,
    message: '¿Está seguro de eliminar este producto?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await GqlBorrarProducto({ busqueda: { _id: row._id } });
    NotifySucess('Producto eliminado correctamente');
    getAllProductos();
    // articles.value = articles.value.filter((user) => user._id !== row._id);
  });
};

const editarProducto = (row: any) => {
  isEditProduct.value = true;
  console.log(row);
  producto.value.nombre = row.nombre;
  producto.value.descripcion = row.descripcion;
  producto.value.tags = row.tags;
  producto.value.presentacionBasica = row.presentacionBasica;
  producto.value.presentaciones = row.presentaciones;
};
const editProduct = (row: any) => {
  console.log(row);
  useProduct.product = row;
  useProduct.isEdit = true;
  router.push('productos/detailProduct');
};
const agregarProducto = () => {
  useProduct.isEdit = false;
  useProduct.product = {
    _id: '',
    nombre: '',
    descripcion: '',
    tags: [],
    presentacionBasica: '',
    presentaciones: []
  };
  router.push('productos/detailProduct');
};

onMounted(() => {
  getAllProductos();
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
  .cell-image {
    width: 70px;
    height: 70px;
  }
}
</style>
