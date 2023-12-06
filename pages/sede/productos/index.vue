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
    console.log(productos.value);
    hideLoading();
  } catch (error) {
    ApiError(error);
  }
};

// const crearProducto = async () => {
//   console.log(producto.value);
//   try {
//     showLoading();
//     await GqlCrearProducto({
//       datos: producto.value
//     });
//     getAllProductos();
//     NotifySucess('Producto creado');
//     hideLoading();
//     test.value = false;
//   } catch (error) {
//     ApiError(error);
//   }
// };

// const combinedName = computed(() => {
//   const name = producto.value.presentaciones.map((p) => {
//     return p.nombre;
//   });
//   return name.join(', ');
// });

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

const editProduct = (row: any) => {
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
