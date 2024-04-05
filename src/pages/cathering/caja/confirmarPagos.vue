<template>
  <Navigation label="confirmar pagos" icon="group" />

  <h1 class="font-extrabold text-xl">Pedidos confirmar pagos</h1>
  <Table badge :rows="cajaPendiente" :columns="tesoreriaPendiente" dense>
    <!-- BADGE -->
    <template #rows-badge="{ props }">
      <q-tr :props="props">
        <q-td key="entidad" :props="props">
          {{ props.row.entidad }}
        </q-td>
        <q-td key="_creado" :props="props">
          {{ formatearFecha(props.row._creado) }}
        </q-td>
        <q-td key="monto" :props="props"> {{ props.row.monto }} Bs </q-td>
        <q-td key="tipo" :props="props">
          {{ props.row.tipo }}
        </q-td>
        <q-td key="actions" :props="props">
          <div class="flex justify-end">
            <q-btn
              color="blue"
              icon="print"
              dense
              flat
              rounded
              padding="0 3px"
              class="font-bold text-[12px]"
              ><q-tooltip> Imprimir </q-tooltip></q-btn
            >
            <q-btn
              color="green-6"
              label="Validar"
              dense
              no-caps
              padding="0 5px"
              class="text-[14px]"
              @click="validarPago(props.row)"
              ><q-tooltip> Validar pago </q-tooltip></q-btn
            >
          </div>
        </q-td>
      </q-tr>
    </template>
  </Table>

  <!-- PAGAR -->
  <Dialog2 v-model="isShowPagar" title="Realizar Pago" labelBtn="Confirmar">
    <template #inputsDialog>
      <div class="">
        <h1 class="uppercase font-extrabold">{{ pedidoPagar.entidad }}</h1>
        <p>Saldo Actual: {{ pedidoPagar.saldoTotal }}Bs</p>
        <section class="flex gap-2 items-center">
          <p>Va a pagar:</p>
          <input
            v-model.number="monto"
            type="number"
            onfocus="this.select()"
            class="w-[80px] test border-[1px] border-gray-400 px-2 py-1 outline-none bg-transparent"
          />
        </section>
        <p>Nuevo saldo: {{ pedidoPagar.nuevoSaldo }}Bs</p>
        <q-option-group v-model="shape" :options="options" inline dense />
      </div>
    </template>
  </Dialog2>
</template>
<script setup>
//@ts-ignore
definePageMeta({
  layout: 'cathering',
});

import cajaPendiente from '@/mocks/cajaPendiente.json';
import { tesoreriaPendiente } from '~/helpers/columns';
import { onMounted, ref, watch } from 'vue';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useQuasar } from 'quasar';
import { NotifySucessCenter } from '~/helpers/message.service';
const $q = useQuasar();

console.log(cajaPendiente);
const pedidosCaja = ref([]);
const isShowPagar = ref(false);
const shape = ref('transferencia');
const options = [
  { label: 'QR code', value: 'qr' },
  { label: 'Transferencia', value: 'transferencia' },
];
const pedidoPagar = ref({
  entidad: '',
  monto: 0,
  saldoTotal: 0,
  nuevoSaldo: 0,
});
const monto = ref(0);

const validarPago = (fila) => {
  console.log('first');
  $q.dialog({
    title: `${fila.entidad}`,
    message: '¿Estas seguro de validar su pago?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    NotifySucessCenter('Pago aceptado correctamente');
  });
};
const formatearFecha = (date) => {
  return format(new Date(date), 'dd/MM/yyyy, EEEE', { locale: es });
};

const filter = ref('');

watch(monto, () => {
  pedidoPagar.value.nuevoSaldo = pedidoPagar.value.saldoTotal - monto.value;
});
</script>
