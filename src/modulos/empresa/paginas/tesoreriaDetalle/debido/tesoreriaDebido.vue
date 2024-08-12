<template>
  <p>Buscar</p>
  <br />
  <div class="w-full flex" style="align-items: center">
    <input-text
      label="Buscar"
      labelAdentro
      @update="(v) => (estado.filtros.buscar = v as string)"
      noSlot />
  </div>
  <br />
  <p>Esta semana</p>
  <Tabla :rows="rows1" :columns="columnsTabla" :footer="footer1">
    <template #body-cell-actions="{ row }">
      <q-btn-group push @click="e => e.stopPropagation()">
        <btnAccion icono="help green" @click="" />
      </q-btn-group>
    </template>
    <template #body-expand="{ row }">
      <pre>{{ row }}</pre>
    </template>
  </Tabla>
  <br />
  <p>Semanas anteriores</p>
  <Tabla :rows="rows2" :columns="columnsTabla" :footer="footer2" dense>
    <template #body-cell-actions="{ row }">
      <q-btn-group push @click="e => e.stopPropagation()">
        <btnAccion icono="help green" @click="" />
      </q-btn-group>
    </template>
    <template #body-expand="{ row }">
      <pre>{{ row }}</pre>
    </template>
  </Tabla>
</template>

<script setup lang="ts">
import { useTesoreriaDebido } from './tesoreriaDebido';
const { estado, rows1, rows2, footer1, footer2 } = useTesoreriaDebido();

const columnsTabla = [
  {
    name: 'fecha',
    label: 'Fecha',
    align: 'left',
    field: (row: any) => fechaMes(row._creado),
    sortable: true
  },
  {
    name: 'items',
    label: 'Items',
    align: 'left',
    field: (row: any) => row.items.length,
    sortable: true
  },
  {
    name: 'monto',
    label: 'Monto',
    align: 'left',
    field: (row: any) => '100bs',
    sortable: true
  },
  {
    name: 'porPagar',
    label: 'Por Pagar',
    align: 'left',
    field: (row: any) => '0bs',
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
