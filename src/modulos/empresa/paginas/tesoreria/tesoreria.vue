<template>
  <NuxtLayout name="cathering">
    <Tabla
      disableExpand
      :rows="rowsTabla"
      :columns="columnsTabla"
      :defaultImage="ProveedorImage">
      <template #dropdown>
        <div class="w-full flex" style="align-items: center">
          <input-text
            label="Buscar"
            labelAdentro
            @update="(v) => (estado.filtros.buscar = v as string)"
            noSlot />
          <q-btn
            size="12px"
            icon="add"
            color="green"
            style="height: 16px; width: 16px; margin: 5px 10px"
            @click="() => (estado.modal.formCrearProveedor = true)" />
        </div>
      </template>
      <template #body-cell-actions="{ row }">
        <q-btn-group push @click="e => e.stopPropagation()">
          <q-btn
            icon="visibility"
            class="p-1"
            color="green"
            size="sm"
            @click="
              () => {
                estado.row = row;
                estado.showModal.detalles = true;
              }
            " />
        </q-btn-group>
      </template>
    </Tabla>

    <popup v-model="estado.showModal.detalles" titulo="Detalles">
      <template #body>
        <p>Esta semana</p>
        <pre>{{ estado.row.pedidosSemanaActual.map(p => p.porPagar) }}</pre>
        <p>Semanas anteriores</p>
        <pre>{{ estado.row.pedidosAnteriores.map(p => p.porPagar) }}</pre>
      </template>
    </popup>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useTesoreria } from './tesoreria.composable';
const { estado, store, authStore, router, rowsTabla } = useTesoreria();

provide('infoPagina', {
  titulo: 'Gestion de tesoreria',
  camino: [{ label: 'Tesoreria', to: 'tesoreria' }]
});

const columnsTabla = [
  {
    name: 'entidad',
    label: 'Entidad',
    align: 'left',
    field: (row: any) => row.entidad.nombre,
    sortable: true
  },
  {
    name: 'pedidosSemanaCorriente',
    label: 'Semana corriente',
    align: 'left',
    field: (row: any) => row.pedidosSemanaActual.length,
    sortable: true
  },
  {
    name: 'pedidosSemanaAnterior',
    label: 'Semana anterior',
    align: 'left',
    field: (row: any) => row.pedidosAnteriores.length,
    sortable: true
  },
  {
    name: 'actions',
    label: '',
    align: 'center',
    slot: true
  }
];
</script>
