<template>
  <div>
    <q-btn
      class="display-block mx-auto mt-1 mr-4"
      color="primary"
      label="Recibir un pago en efectivo"
      dense
      no-caps
      padding="3px 20px"
      @click="estado.showModal.recibirPagoEfectivo = true" />
    <q-btn
      class="display-block mx-auto mt-1 mr-4"
      color="primary"
      label="Recibir un pago por Giro"
      dense
      no-caps
      padding="3px 20px"
      @click="estado.showModal.recibirPagoGiro = true" />
    <!-- <q-btn
      class="display-block mx-auto mt-1"
      color="primary"
      label="Recibir un pago por QR"
      dense
      no-caps
      padding="3px 20px"
      @click="estado.showModal.recibirPagoQR = true" /> -->
  </div>
  <Tabla :rows="rowsTabla" :columns="columnsTabla">
    <template #dropdown>
      <div class="w-full flex" style="align-items: center">
        <input-text
          label="Buscar"
          labelAdentro
          @update="(v) => (estado.filtros.buscar = v as string)"
          noSlot />
      </div>
    </template>
    <template #body-cell-actions="{ row }">
      <q-btn-group push @click="e => e.stopPropagation()">
        <q-btn
          icon="help"
          class="p-1"
          color="green"
          size="sm"
          @click="e => {}" />
      </q-btn-group>
    </template>
    <template #body-expand="{ row }">
      <pre>{{ row }}</pre>
    </template>
  </Tabla>

  <!-- <Popup v-model="estado.showModal.recibirPagoQR" titulo="Pago QR">
    <template #body>
      <RecibirPagoQR @pagoRecibido="handlePagoQR" />
    </template>
  </Popup> -->
  <Popup v-model="estado.showModal.recibirPagoGiro" titulo="Pago Giro">
    <template #body>
      <RecibirPagoGiro @pagoRecibido="handlePagoGiro" />
    </template>
  </Popup>
  <Popup v-model="estado.showModal.recibirPagoEfectivo" titulo="Pago EFECTIVO">
    <template #body>
      <RecibirPagoEfectivo @pagoRecibido="handlePagoEfectivo" />
    </template>
  </Popup>
</template>

<script setup lang="ts">
// import RecibirPagoQR from '@/modulos/empresa/forms/formRecibirPagoQR.vue';
import RecibirPagoGiro from '@/modulos/empresa/forms/formRecibirPagoGiro.vue';
import RecibirPagoEfectivo from '@/modulos/empresa/forms/formRecibirPagoEfectivo.vue';
import { useTesoreriaPagos } from './tesoreriaPagos';
const {
  estado,
  authStore,
  store,
  router,
  rowsTabla,
  handlePagoEfectivo,
  handlePagoGiro
  // handlePagoQR
} = useTesoreriaPagos();

const columnsTabla = [
  {
    name: 'fecha',
    label: 'Fecha',
    align: 'left',
    field: (row: any) => fechaMes(row._creado),
    sortable: true
  },
  {
    name: 'monto',
    label: 'Monto',
    align: 'left',
    field: (row: any) => row.monto,
    sortable: true
  },
  {
    name: 'modalidad',
    label: 'Modalidad',
    align: 'left',
    field: (row: any) => row.modalidad,
    sortable: true
  },
  {
    name: 'estado',
    label: 'estado',
    align: 'left',
    field: (row: any) => row.estado,
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
