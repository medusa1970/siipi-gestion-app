<template>
  <!--
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
  -->

  <div class="flex justify-between">
    <p class="self-center">
      Pedidos del {{ lunes(0).getDate() }}/{{ lunes(0).getMonth() }} al
      {{ lunes(1).getDate() }}/{{ lunes(1).getMonth() }} de 2024
    </p>
    <q-btn label="Imprimir" color="black" @click="printSemana1" />
  </div>
  <Tabla
    :rows="rows1"
    :columns="columnsTabla"
    :footer="footer1"
    :paginacion="0">
    <template #body-expand="{ row }">
      <p>Numero de items en el pedido : {{ row.items.length }}</p>
      <div v-if="row.transacciones.length">
        <p>Pagos</p>
        <q-list dense>
          <q-item v-for="transaccion of row.transacciones">
            {{ transaccion.total }} bs el
            {{ fechaMes(transaccion.transaccion._creado) }} (transaccion #{{
              transaccion.transaccion._id
            }})
          </q-item>
        </q-list>
      </div>
      <p v-else>No hay pago todavia</p>
    </template>
    <template #cell-monto="{ val, row }"> {{ val }}</template>
    <template #cell-pagado="{ val, row }">
      <div v-if="row.precio > row.pagado">{{ val }}</div>
      <div v-else>
        <q-icon name="check" size="20px" color="green" />
      </div>
    </template>
    <template #cell-porPagar="{ val, row }">
      <div v-if="row.precio > row.pagado">{{ val }}</div>
      <div v-else>
        <q-icon name="check" size="20px" color="green" />
      </div>
    </template>
    <template #cell-fecha="{ val, row }"> </template>
    <template #cell-actions="{ row }">
      <q-btn-group push @click="e => e.stopPropagation()">
        <btnAccion icono="help green" @click="" />
      </q-btn-group>
    </template>
  </Tabla>

  <p>Pedidos anteriores</p>
  <Tabla
    :rows="rows2"
    :columns="columnsTabla"
    :footer="footer1"
    :paginacion="0">
    <template #body-expand="{ row }">
      <p>Numero de items en el pedido : {{ row.items.length }}</p>
      <div v-if="row.transacciones.length">
        <p>Pagos</p>
        <q-list dense>
          <q-item v-for="transaccion of row.transacciones">
            {{ transaccion.total }} bs el
            {{ fechaMes(transaccion.transaccion._creado) }} (transaccion #{{
              transaccion.transaccion._id
            }})
          </q-item>
        </q-list>
      </div>
      <p v-else>No hay pago todavia</p>
    </template>
    <template #cell-monto="{ val, row }"> {{ val }}</template>
    <template #cell-pagado="{ val, row }">
      <div v-if="row.precio > row.pagado">{{ val }}</div>
      <div v-else>
        <q-icon name="check" size="20px" color="green" />
      </div>
    </template>
    <template #cell-porPagar="{ val, row }">
      <div v-if="row.precio > row.pagado">{{ val }}</div>
      <div v-else>
        <q-icon name="check" size="20px" color="green" />
      </div>
    </template>
    <template #cell-fecha="{ val, row }"> </template>
    <template #cell-actions="{ row }">
      <q-btn-group push @click="e => e.stopPropagation()">
        <btnAccion icono="help green" @click="" />
      </q-btn-group>
    </template>
  </Tabla>
</template>

<script setup lang="ts">
import { lunes } from '~/modulos/empresa/empresa.store';
import { useTesoreriaDebido } from './tesoreriaDebido';
const { estado, rows1, rows2, printSemana1 } = useTesoreriaDebido();

const columnsTabla = [
  {
    name: 'fecha',
    label: 'Fecha',
    align: 'left',
    field: (row: any) =>
      new Date(row._creado).toLocaleDateString('es-ES', {
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit'
      }),
    sortable: true
  },
  // {
  //   name: 'items',
  //   label: 'Items',
  //   align: 'left',
  //   field: (row: any) => row.items.length,
  //   sortable: true
  // },
  {
    name: 'monto',
    label: 'Valor',
    align: 'center',
    slot: true,
    field: (row: any) => row.precio,
    format: value => value + ' bs'
  },
  {
    name: 'pagado',
    label: 'Pagado',
    align: 'center',
    slot: true,
    field: (row: any) => row.pagado,
    format: value => value + ' bs'
  },
  {
    name: 'porPagar',
    label: 'Por pagar',
    align: 'center',
    slot: true,
    field: (row: any) => row.pagado - row.precio,
    format: value => value + ' bs'
  }
  // {
  //   name: 'actions',
  //   label: '',
  //   align: 'center',
  //   slot: true
  // }
];

const footer1 = [
  {
    value: 'TOTAL',
    align: 'left'
  },
  {
    align: 'center',
    value: rows1.value.reduce((total, row) => total + row.precio, 0) + ' bs'
  },
  {
    align: 'center',
    value: rows1.value.reduce((total, row) => total + row.pagado, 0) + ' bs'
  },
  {
    align: 'center',
    value:
      rows1.value.reduce((total, row) => total - row.precio + row.pagado, 0) +
      ' bs'
  }
  // {}
];

const footer2 = [
  {
    value: 'TOTAL',
    align: 'left'
  },
  {
    align: 'center',
    value: rows2.value.reduce((total, row) => total + row.precio, 0) + ' bs'
  },
  {
    align: 'center',
    value: rows2.value.reduce((total, row) => total + row.pagado, 0) + ' bs'
  },
  {
    align: 'center',
    value:
      rows2.value.reduce((total, row) => total - row.precio + row.pagado, 0) +
      ' bs'
  }
  // {}
];
</script>
