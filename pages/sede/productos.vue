<template>
  <div>
    <Navigation label="Productos" icon="list_alt" />
    <Table badge :rows="productos" :columns="columnsProductos">
      <template #dropdown>
        <q-btn
          icon-right="add"
          color="green"
          label="Agregar producto"
          no-caps
          style="padding: 7px 15px"
          @click="() => (test = true)"
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
            <q-btn color="red" icon="more_horiz" flat round>
              <q-menu
                transition-show="rotate"
                transition-hide="rotate"
                anchor="top start"
                self="top right"
              >
                <q-list dense style="min-width: 100px">
                  <q-item clickable v-close-popup class="test">
                    <q-icon name="bi-box-seam-fill" size="20px" color="blue" />
                    <q-item-section class="font-bold"
                      >Agregar presentacion</q-item-section
                    >
                  </q-item>
                  <q-item clickable v-close-popup class="test">
                    <q-icon name="edit" size="20px" color="green" />
                    <q-item-section class="font-bold">Editar</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup class="test">
                    <q-icon name="delete" size="20px" color="red" />
                    <q-item-section class="font-bold">Eliminar</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
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
                v-model="presentacion.cantidad"
                filled
                dense
                emit-value
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
const options = ['Diario', 'Semanal', 'Mensual'];
const tags = ['empanadas', 'Masas', 'Embutidos', 'pedazos'];

const getAllProductos = async () => {
  try {
    showLoading();
    const { buscarProductos } = await GqlBuscarProductos({
      busqueda: {}
    });
    //@ts-ignore
    productos.value = buscarProductos;
    hideLoading();
  } catch (error) {
    ApiError(error);
  }
};

const crearProducto = async () => {
  // producto.value.presentaciones = producto.value.presentaciones.map((p) => {
  //   return {
  //     nombre: p.nombre,
  //     cantidad: parseInt(p.cantidad)
  //   };
  // });
  console.log(producto.value);
  try {
    showLoading();
    const { crearProducto } = await GqlCrearProducto({
      datos: producto.value
    });
    console.log(crearProducto);
    NotifySucess('Producto creado');
    hideLoading();
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
  console.log(producto.value.presentaciones);
  isAddPresentation.value = false;
};

const combinedName = computed(() => {
  const name = producto.value.presentaciones.map((p) => {
    return p.nombre;
  });
  return name.join(', ');
});

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
.table {
  width: 100%; /* La tabla ocupará el ancho completo del contenedor */
  border-collapse: collapse; /* Combina los bordes de las celdas */
  th,
  td {
    border: 1px solid #ccc; /* Añade bordes a las celdas */
    padding: 8px; /* Espaciado interno para el contenido */
    text-align: center; /* Centra el texto en las celdas */
    height: 42px;
  }

  th {
    background-color: #f2f2f2; /* Color de fondo para las celdas de encabezado */
  }
}
</style>
