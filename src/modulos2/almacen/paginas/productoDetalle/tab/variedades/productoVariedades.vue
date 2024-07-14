<template>
  <Tabla
    :rows="rowsTabla"
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
          @update="(v) => (estado.filtros.buscarFiltro = v)"
          class="col-span-1"
          label="Buscar"
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
    <template #body-cell-actions="{ row }">
      <q-btn-group push @click="(e) => e.stopPropagation()">
        <q-btn
          @click="
            () => {
              estado.variedad = row;
              estado.modal.formVariedadModificar = true;
            }
          "
          class="p-1"
          color="black"
          size="sm"
          icon="edit"
        />
      </q-btn-group>
    </template>
    <template #body-expand="{ row }">
      <pre>{{ row }}</pre>
    </template>
  </Tabla>

  <popup
    titulo="Modificar la marca"
    v-model="estado.modal.formVariedadModificar"
  >
    <template #body>
      <crearVariedadComp
        :productoID="store.producto._id"
        :edicion="estado.variedad"
        @modificar:variedad="handleVariedadModificada"
      />
    </template>
  </popup>

  <popup
    titulo="Registrar nueva marca"
    v-model="estado.modal.formVariedadCrear"
  >
    <template #body>
      <crearVariedadComp
        :productoID="store.producto._id"
        @crear:variedad="handleVariedadCreada"
      />
    </template>
  </popup>
</template>

<script setup lang="ts">
import crearVariedadComp from '@/modulos2/almacen/forms/formVariedad.vue';
import { useProductoVariedades } from './productoVariedades.composable';
const { estado, store, handleVariedadCreada, handleVariedadModificada } =
  useProductoVariedades();

/**
 * Rows para la tabla
 */
const rowsTabla = computed(() => {
  let filtered = store.producto.variedades;
  // filtro para buscar que no discrimine maiusculas de minusculas y acentos
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
</script>

<style lang="scss" scoped></style>
