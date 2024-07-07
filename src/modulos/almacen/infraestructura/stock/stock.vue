<template>
  <div>
    <Navigation label="Stock" icon="folder" />

    <Table3
      :rows="rowsParaMostrar"
      :columns="[
        {
          name: 'imagen',
          label: 'Imagen',
          imagen: true,
          align: 'left',
          field: (row) => row.producto.imagen?.cloudinaryUrl,
        },
        {
          name: 'producto',
          required: true,
          label: 'Producto',
          align: 'left',
          field: (row) => row.stock.producto.nombre,
          sortable: true,
        },
        {
          name: 'cantidad',
          slot: true,
          required: true,
          label: 'Cantidad:',
          align: 'right',
          field: (row) => row.cantidadTotal,
          sortable: true,
        },
        {
          name: 'venciminento',
          slot: true,
          required: true,
          label: 'Vence en:',
          align: 'left',
          field: (row) => row.alertaV,
          sortable: true,
        },
        {
          name: 'actions',
          label: 'Acciones',
          align: 'right',
        },
      ]"
      :filter="filter"
      :defaultImage="ProductoImage"
    >
      <template #body-cell-venciminento="{ row }">
        <div v-if="row.alertaV !== null">
          {{ Math.floor(row.alertaV) }} días
          <div v-if="row.alertaV <= 2">
            <q-icon name="report" color="red" size="sm" />
          </div>
          <div v-else-if="row.alertaV <= 5">
            <q-icon name="report" color="orange" size="sm" />
          </div>
        </div>
        <div v-else>-</div>
      </template>
      <template #body-cell-cantidad="{ row }">
        {{ row.cantidadTotal }} {{ row.producto.medida.abreviacion }}
        <div v-if="row.alertaC">
          <q-icon name="report" color="red" size="sm" />
        </div>
      </template>
      <template #body-expand="{ row }">
        <div class="text-left">
          <pre>{{ row.stock.lotes }}</pre>
        </div>
      </template>
    </Table3>
  </div>

  <!-- DIALOG -->
  <Dialog
    v-model="estado.modal.isShowCantidad"
    title="Actualizar cantidad minima"
    :handle-submit="guardarCantidad"
  >
    <template #inputsDialog>
      <q-input
        v-model.number="estado.producto.cantidadMinima"
        type="text"
        label="Cantidad Minima"
        dense
      />
    </template>
  </Dialog>
</template>

<script setup>
// Layout y metadata
definePageMeta({
  layout: 'cathering',
});

// imports y inicializaciones
import ProductoImage from '@/assets/img/producto.png';
import { useStock } from './stock.composable';
import { useAlmacen } from '@/modulos/almacen/negocio/almacen.composable';
const almacen = useAlmacen();
const {
  estado,
  store,
  service,
  modalEditarCantidad,
  guardarCantidad,
  agregarListaInventario,
  obtenerTodoStock,
} = useStock();

// const { handleInputChange2 } = usePedido();
const toggleModal = (key) => {
  estado.modal[key] = !estado.modal[key];
  Object.keys(estado.modal).forEach((modalKey) => {
    if (modalKey !== key) {
      estado.modal[modalKey] = false;
    }
  });
};

const rowsParaMostrar = computed(() => {
  // if (estado.modal.isShowAlertProduct) {
  //   return estado.productosEnAlerta;
  // } else if (estado.modal.isShowVencidos) {
  //   return estado.productosVencidos;
  // } else if (estado.modal.isShowAllProducts) {
  //   return estado.stocks;
  // } else {
  //   return estado.stocks;
  // }
  return estado.stocks;
});

// Reactives y inicializaciones
onMounted(() => {
  obtenerTodoStock();
});
</script>
