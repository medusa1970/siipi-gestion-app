<template>
  <div>
    <Navigation label="Stock" icon="folder" />
    Alertas
    <q-radio color="orange" no-caps label="Todos" v-model="filter" val="" />
    <q-radio
      color="orange"
      no-caps
      label="Cantidad"
      v-model="filter"
      val="!cantidad!"
    />
    <q-radio
      color="orange"
      no-caps
      label="Vencimiento"
      v-model="filter"
      val="!venciminento!"
    />
    <q-radio
      color="orange"
      no-caps
      label="Inventario"
      v-model="filter"
      val="!inventario!"
    />

    <Table
      :watchFilter="filter"
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
          label: 'Stock total',
          align: 'right',
          field: (row) => row.cantidadTotal,
          sortable: true,
        },
        {
          name: 'alertC',
          slot: true,
          required: true,
          label: '',
          align: 'center',
          field: (row) => (row.alertaC !== null ? '!cantidad!' : null),
          sortable: true,
        },
        {
          name: 'alertV',
          slot: true,
          required: true,
          label: '',
          align: 'center',
          field: (row) => (row.alertaV !== null ? '!venciminento!' : null),
          sortable: true,
        },
        {
          name: 'alertI',
          slot: true,
          required: true,
          label: '',
          align: 'center',
          field: (row) => (row.alertaI !== null ? '!inventario!' : null),
          sortable: true,
        },
        {
          name: 'actions',
          label: 'Acciones',
          align: 'right',
          slot: true,
        },
      ]"
      :defaultImage="ProductoImage"
    >
      <template #body-cell-venciminento="{ row }">
        <div v-if="row.alertaV !== null">
          {{ Math.floor(row.alertaV[0]) }} días
          <div v-if="row.alertaV <= 2">
            <q-icon name="report" color="red" size="sm" />
          </div>
          <div v-else-if="row.alertaV <= 5">
            <q-icon name="report" color="orange" size="sm" />
          </div>
        </div>
        <div v-else>-</div>
      </template>
      <template #body-cell-actions="{ row }">
        <q-btn-dropdown
          color="primary"
          flat
          dropdown-icon="menu"
          size="sm"
          @click="
            (e) => {
              e.stopPropagation();
            }
          "
        >
          <q-list>
            <q-item clickable v-close-popup @click="onItemClick">
              <q-item-section>
                <q-item-label>Hacer pedido</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="onItemClick">
              <q-item-section>
                <q-item-label>Hacer inventario</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-close-popup
              @click="goTo(router, 'producto', { id: row.producto._id })"
            >
              <q-item-section>
                <q-item-label>Modificar</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </template>
      <template #body-cell-alertC="{ val, row }">
        <div v-if="row.alertaC != null">
          <q-icon name="report" color="red" size="sm" />
        </div>
      </template>
      <template #body-cell-alertV="{ val, row }">
        <div v-if="row.alertaV != null">
          <q-icon name="report" color="red" size="sm" />
        </div>
      </template>
      <template #body-cell-alertI="{ val, row }">
        <div v-if="val">
          <q-icon name="report" color="red" size="sm" />
        </div>
      </template>
      <template #body-cell-cantidad="{ val, row }">
        {{ row.cantidadTotal }} {{ row.producto.medida.abreviacion }}
      </template>
      <template #body-expand="{ row }">
        <div class="text-left">
          <pre>{{ row.stock }}</pre>
        </div>
      </template>
    </Table>
  </div>
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
import Table from '@/components/input/Table.vue';
import { ref } from 'vue';
const router = useRouter();
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
const filter = ref('');

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
