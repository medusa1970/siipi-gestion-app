<template>
  <tabla disableExpand :columns="columnsTabla" :rows="rowsTabla">
    <template #cell-actions="{ row }">
      <q-btn-group push @click="e => e.stopPropagation()">
        <q-btn
          @click="
            () => {
              estado.configEdit = row.cantidadMin ? row : store.oferta;
              estado.modal.formModificarPrecio = true;
            }
          "
          icon="edit"
          class="p-1"
          color="black"
          size="sm" />
        <q-tooltip> Eliminar marca </q-tooltip>
        <q-btn
          v-if="row.cantidadMin > 1"
          icon="delete"
          class="p-1"
          color="red"
          size="sm"
          @click="borrarOfertaPrecio(row)" />
        <q-tooltip> Eliminar precio </q-tooltip>
      </q-btn-group>
    </template>
  </tabla>
  <div class="flex">
    <q-btn
      @click="() => (estado.modal.formCrearPrecio = true)"
      icon="add"
      label="Agregar precio por mayor"
      color="green"
      no-caps
      padding="4px 10px" />
  </div>
  <popup v-model="estado.modal.formCrearPrecio" titulo="Agregar un precio">
    <template #body>
      <formPrecio
        :preciosProveedor="estado.preciosProveedor"
        @crearObjeto="handlePrecioCreado" />
    </template>
  </popup>

  <popup
    v-model="estado.modal.formModificarPrecio"
    titulo="Modificar un precio">
    <template #body>
      <formPrecio
        :preciosProveedor="estado.preciosProveedor"
        :edicion="estado.configEdit"
        @modificarObjeto="handlePrecioModificado" />
    </template>
  </popup>
</template>

<script setup>
import { usePrecioTab } from './preciosTab.composable';
import formPrecio from '@/modulos/ofertas/forms/formPrecio.vue';
const {
  estado,
  store,
  borrarOfertaPrecio,
  handlePrecioCreado,
  handlePrecioModificado
} = usePrecioTab();

// Rows para la tabla
const rowsTabla = computed(() => {
  let rows = [
    {
      _esOferta: true,
      cantidadMin: 1,
      precioConFactura: store.oferta.precioConFactura,
      precioSinFactura: store.oferta.precioSinFactura
    },
    ...(store.oferta.preciosPorMayor ?? [])
  ];
  // TODO ORDENAR LOS PRECIOS
  return rows.sort((a, b) => a.cantidadMin - b.cantidadMin);
});

// Columnas
const columnsTabla = [
  {
    name: 'cantidad',
    label: 'A partir de...',
    field: row => row.cantidadMin
  },
  {
    name: 'precioSinFactura',
    label: 'Precio sin factura',
    field: row => row.precioSinFactura,
    format: value => (value != null ? `${value} bs` : 'a ingresar')
  },
  {
    name: 'precioConFactura',
    label: 'Precio con factura',
    field: row => row.precioConFactura,
    format: value => (value != null ? `${value} bs` : 'a ingresar')
  },
  {
    name: 'actions',
    label: '',
    align: 'center',
    slot: true
  }
];
</script>
