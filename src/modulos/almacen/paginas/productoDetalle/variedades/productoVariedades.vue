<template>
  <Tabla
    :rows="rowsTabla"
    :disableExpand="true"
    :columns="
    [
  {
    name: 'marca',
    required: true,
    label: 'Marca',
    align: 'left',
    field: (row: any) => row.marca?.nombre,
    sortable: true,
  },
  {
    name: 'alertas',
    required: true,
    label: 'Alertas',
    align: 'left',
    slot:true,
    field: (row: any) => row.cantidadLimite + row.inventarioLimite + row.cantidadMaxPedido,
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right',
    slot: true,
  },
]"
  >
    <template #dropdown>
      <div class="flex">
        <input-text
          label="Buscar"
          labelAdentro
          @update="(v) => (estado.filtros.buscarFiltro = v as string)"
          class="col-span-1"
          porDefecto=""
          noSlot
        />
        <q-btn
          @click="() => (estado.modal.formVariedadCrear = true)"
          icon="add"
          color="green"
          no-caps
          padding="4px 10px"
        />
      </div>
    </template>
    <template #body-cell-alertas="{ row }">
      <div class="space-y-[-4px]">
        <h1><b>stock:</b> {{ row.cantidadLimite }}</h1>
        <h1><b>inventario:</b> {{ row.inventarioLimite }}</h1>
        <h1><b>cantidad max:</b> {{ row.cantidadMaxPedido }}</h1>
      </div>
    </template>
    <template #body-cell-actions="{ row }">
      <q-btn-group push @click="(e) => e.stopPropagation()">
        <q-btn
          @click="modalEditarMarca(row)"
          class="p-1"
          color="black"
          size="sm"
          icon="edit"
        />
        <q-btn
          icon="delete"
          class="p-1"
          color="red"
          size="sm"
          @click="borrarProductoMarca(row)"
        >
          <q-tooltip> Eliminar marca </q-tooltip>
        </q-btn>
      </q-btn-group>
    </template>
    <!-- <template #body-expand="{ row }">
      <pre>{{ row }}</pre>
    </template> -->
  </Tabla>

  <Popup
    v-model="estado.modal.formVariedadModificar"
    titulo="Modificar la marca"
  >
    <template #body>
      <formVariedad
        :edicion="estado.variedad"
        @modificarObjeto="handleVariedadModificada"
      />
    </template>
  </Popup>

  <Popup
    v-model="estado.modal.formVariedadCrear"
    titulo="Registrar nueva marca"
  >
    <template #body>
      <formVariedad @crearObjeto="handleVariedadCreada" />
    </template>
  </Popup>
</template>

<script setup lang="ts">
import formVariedad from '@/modulos/almacen/forms/formVariedad.vue';
import { useProductoVariedades } from './productoVariedades.composable';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';
const { $socket } = useNuxtApp();
const {
  estado,
  store,
  handleVariedadCreada,
  handleVariedadModificada,
  borrarProductoMarca,
} = useProductoVariedades();

/**
 * Rows para la tabla
 */
const rowsTabla = computed(() => {
  let filtered = store.producto?.variedades;
  if (!filtered) return [];
  if (estado.filtros.buscarFiltro != null) {
    const regex = new RegExp(`${estado.filtros.buscarFiltro}`, 'i');
    filtered = filtered.filter((variedad) => {
      return regex.test(
        variedad.marca.nombre +
          variedad.marca.nombre
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''),
      );
    });
  }
  return filtered;
});

const modalEditarMarca = (row: any) => {
  estado.variedad = row;
  estado.modal.formVariedadModificar = true;
};
</script>

<style lang="scss" scoped></style>
