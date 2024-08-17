<template>
  <NuxtLayout
    :name="authStore.getNegocio.tipo === 'PUNTO' ? 'punto' : 'cathering'"
    titulo="Gestion de tesoreria"
    :navegacion="[{ label: 'Tesoreria', to: 'tesoreria' }]">
    <Tabla
      disableExpand
      :rows="rowsTabla"
      :columns="columnsTabla"
      :defaultImage="EntidadImage">
      <template #dropdown>
        <div class="w-full flex" style="align-items: center">
          <input-text
            label="Buscar"
            labelAdentro
            @update="(v) => (estado.filtros.buscar = v as string)"
            noSlot />
        </div>
      </template>
      <template #cell-actions="{ row }">
        <q-btn-group push @click="e => e.stopPropagation()">
          <btnAccion
            icono="visibility black"
            @click="
              store.entidad = row.entidad;
              goTo(router, 'tesoreriaDetalle', { id: row.entidad._id });
            " />
        </q-btn-group>
      </template>
    </Tabla>

    <popup v-model="estado.showModal.detalles" titulo="Detalles">
      <template #body>
        <p>Esta semana</p>
        <pre>{{ estado.row.semanaActual.map(p => p.porPagar) }}</pre>
        <p>Semanas anteriores</p>
        <pre>{{ estado.row.semanasAnteriores.map(p => p.porPagar) }}</pre>
      </template>
    </popup>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useTesoreria } from './tesoreria';
const { estado, store, authStore, router, rowsTabla } = useTesoreria();
import EntidadImage from '@/assets/img/noHayMarca.png';

const columnsTabla = [
  // {
  //  TODO Image
  // }
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
    field: (row: any) => row.semanaActual.length,
    sortable: true
  },
  {
    name: 'pedidosSemanaAnterior',
    label: 'Semana anterior',
    align: 'left',
    field: (row: any) => row.semanasAnteriores.length,
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
