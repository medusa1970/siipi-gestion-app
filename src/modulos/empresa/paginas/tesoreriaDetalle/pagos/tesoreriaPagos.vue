<template>
  <div>
    <q-btn
      :disable="estado.porPagar <= 0"
      class="display-block mx-auto mt-1 mr-4"
      color="primary"
      label="Pago en efectivo"
      dense
      no-caps
      padding="3px 20px"
      @click="estado.showModal.recibirPagoEfectivo = true" />
    <q-btn
      :disable="estado.porPagar <= 0"
      class="display-block mx-auto mt-1 mr-4"
      color="primary"
      label="Pago por Giro"
      dense
      no-caps
      padding="3px 20px"
      @click="estado.showModal.recibirPagoGiro = true" />
    <q-btn
      :disable="estado.porPagar <= 0"
      class="display-block mx-auto mt-1 mr-4"
      color="primary"
      label="Canjear cupón"
      dense
      no-caps
      padding="3px 20px"
      @click="estado.showModal.recibirPagoCupon = true" />
    <!-- <q-btn
      class="display-block mx-auto mt-1"
      color="primary"
      label="Recibir un pago por QR"
      dense
      no-caps
      padding="3px 20px"
      @click="estado.showModal.recibirPagoQR = true" /> -->
  </div>
  <Tabla :rows="rowsTabla" :columns="columnsTabla" :paginacion="10">
    <template #dropdown>
      <!--       <div class="w-full flex" style="align-items: center">
        <input-text
          label="Buscar"
          labelAdentro
          @update="(v) => (estado.filtros.buscar = v as string)"
          noSlot />
      </div> -->
      <div
        style="
          display: grid;
          grid-gap: 16px;
          margin: 0;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          width: 100%;
        ">
        <input-select
          label="Modalidad"
          labelAdentro
          @update="v => (estado.filtros.modalidad = v)"
          :opciones="[
            { value: 'GIRO', label: 'Por giro' },
            { value: 'EFECTIVO', label: 'En efectivo' },
            { value: 'CUPON', label: 'Canjeamiento de cupon' }
          ]"
          noSlot />

        <input-select
          label="Estado"
          labelAdentro
          @update="v => (estado.filtros.estado = v)"
          :opciones="[
            { value: 'CONFIRMADO', label: 'Confirmados' },
            { value: 'PENDIENTE', label: 'Pendientes' },
            { value: 'RECHAZADO', label: 'Rechazados' }
          ]"
          noSlot />
      </div>
    </template>
    <template #cell-actions="{ row }">
      <q-btn-group push @click="e => e.stopPropagation()">
        <btnAccion
          icono="receipt_long orange"
          tooltip="Imprimir factura"
          @click="goTo(router, 'empleado', { id: row._id })">
        </btnAccion>
        <btnAccion
          v-if="row.estado === 'PENDIENTE'"
          icono="task_alt green"
          tooltip="Confirmar"
          @click="goTo(router, 'empleado', { id: row._id })">
        </btnAccion>
        <btnAccion
          v-if="row.estado === 'PENDIENTE'"
          icono="cancel red"
          tooltip="Rechazar"
          @click="goTo(router, 'empleado', { id: row._id })">
        </btnAccion>
      </q-btn-group>
    </template>
    <template #body-expand="{ row }">
      <p>Comentario : {{ row.comentario }}</p>
      <p>Glosa : {{ row.glosa }}</p>
      <div v-if="row.pedidos.length">
        <p>Pedidos</p>
        <q-list dense>
          <q-item v-for="pedido of row.pedidos">
            {{ pedido.total }} bs (pedido #{{ pedido.pedido._id }})
          </q-item>
        </q-list>
      </div>
    </template>
  </Tabla>

  <!-- <Popup v-model="estado.showModal.recibirPagoQR" titulo="Pago QR">
    <template #body>
      <RecibirPagoQR @pagoRecibido="handlePagoQR" />
    </template>
  </Popup> -->
  <Popup v-model="estado.showModal.recibirPagoCupon" titulo="Canjear Cupón">
    <template #body>
      <RecibirPagoCupon
        :porPagar="estado.porPagar"
        @pagoRecibido="handlePagoCupon" />
    </template>
  </Popup>
  <Popup v-model="estado.showModal.recibirPagoGiro" titulo="Pago Giro">
    <template #body>
      <RecibirPagoGiro
        :porPagar="estado.porPagar"
        @pagoRecibido="handlePagoGiro" />
    </template>
  </Popup>
  <Popup v-model="estado.showModal.recibirPagoEfectivo" titulo="Pago EFECTIVO">
    <template #body>
      <RecibirPagoEfectivo
        :porPagar="estado.porPagar"
        @pagoRecibido="handlePagoEfectivo" />
    </template>
  </Popup>
</template>

<script setup lang="ts">
// import RecibirPagoQR from '@/modulos/empresa/forms/formRecibirPagoQR.vue';
import RecibirPagoGiro from '@/modulos/empresa/forms/formRecibirPagoGiro.vue';
import RecibirPagoCupon from '@/modulos/empresa/forms/formRecibirPagoCupon.vue';
import RecibirPagoEfectivo from '@/modulos/empresa/forms/formRecibirPagoEfectivo.vue';
import { useTesoreriaPagos } from './tesoreriaPagos';
const {
  estado,
  router,
  store,
  rowsTabla,
  handlePagoEfectivo,
  handlePagoGiro,
  handlePagoCupon
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
