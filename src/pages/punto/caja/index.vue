<template>
  <Navigation label="Caja" icon="group" />

  <h1 class="font-extrabold text-xl">Deudas Pedidos</h1>
  <Table badge :rows="pedidosCaja" :columns="tesoreriaCobrar" dense>
    <!-- BADGE -->
    <template #rows-badge="{ props }">
      <q-tr :props="props">
        <q-td key="entidad" :props="props">
          {{ props.row.entidad }}
        </q-td>
        <q-td key="pedidosAnteriores" :props="props">
          <!-- {{ props.row.pedidosAnteriores.length }} -->

          <div class="flex gap-2 justify-center items-center">
            <p>
              Total:
              <span v-if="props.row.pedidosAnteriores.length > 0">
                {{
                  props.row.pedidosAnteriores.reduce(
                    (total, pedido) => total + pedido.porPagar,
                    0,
                  )
                }}
                Bs
              </span>
              <span v-else>0</span>
            </p>
            <q-btn
              color="green-7"
              label="D"
              dense
              padding="0 3px"
              class="font-bold text-[12px]"
              ><q-tooltip> Ver detalle </q-tooltip></q-btn
            >
          </div>
          <!-- POPUT -->
          <q-popup-edit
            v-model="props.row.pedidosAnteriores"
            anchor="bottom end"
            self="bottom end"
            class="flex flex-col gap-[3px]"
          >
            <p class="text-center font-bold">{{ props.row.entidad }}</p>
            <div
              v-for="(pedido, index) in props.row.pedidosAnteriores"
              :key="pedido._id"
            >
              <!-- <p>{{ obtenerNombreMes(pedido.pedido._creado) }}</p> -->
              <div
                v-if="
                  index === 0 ||
                  obtenerNombreMes(pedido.pedido._creado) !==
                    obtenerNombreMes(
                      props.row.pedidosAnteriores[index - 1].pedido._creado,
                    )
                "
                class="font-bold bg-gray-200"
              >
                {{ obtenerNombreMes(pedido.pedido._creado) }}
              </div>
              <div class="flex gap-3">
                <p>{{ pedido.pedido.items.length }}producto</p>
                <p>{{ pedido.porPagar }}bs</p>
                <!-- <p v-if="pedido.items">{{ pedido.items }}</p> -->
              </div>
            </div>
          </q-popup-edit>
        </q-td>
        <q-td key="pedidosSemanaActual" :props="props">
          <!-- {{ props.row.pedidosSemanaActual.length }} -->
          <div class="flex gap-2 justify-center items-center">
            <p>
              Total:
              <span v-if="props.row.pedidosSemanaActual.length > 0">
                {{
                  props.row.pedidosSemanaActual.reduce(
                    (total, pedido) => total + pedido.porPagar,
                    0,
                  )
                }}
                Bs
              </span>
              <span v-else>0</span>
            </p>
            <q-btn
              color="green-7"
              label="D"
              dense
              padding="0 3px"
              class="font-bold text-[12px]"
              ><q-tooltip> Ver detalle </q-tooltip></q-btn
            >
          </div>
          <q-popup-edit
            v-model="props.row.pedidosSemanaActual"
            anchor="bottom end"
            self="bottom end"
            class="flex flex-col gap-[3px]"
          >
            <!-- <h1 class="font-bold">MES</h1> -->
            <!-- <p>{{ props.row.pedidosSemanaActual }}</p> -->
            <p class="text-center font-bold">{{ props.row.entidad }}</p>
            <div
              v-for="pedido in props.row.pedidosSemanaActual"
              :key="pedido._id"
            >
              <p class="font-bold bg-gray-200">
                {{ obtenerDiaSemana(pedido.pedido._creado) }}
              </p>
              <div class="flex gap-3">
                <p>{{ pedido.pedido.items.length }}producto</p>
                <p>{{ pedido.porPagar }}bs</p>
              </div>
            </div>
          </q-popup-edit>
        </q-td>
        <q-td key="total" :props="props">
          <p v-if="props.row.pedidosAnteriores.length > 0">
            {{
              props.row.pedidosAnteriores.reduce(
                (total, pedido) => total + pedido.porPagar,
                0,
              ) +
              props.row.pedidosSemanaActual.reduce(
                (total, pedido) => total + pedido.porPagar,
                0,
              )
            }}
            Bs
          </p>
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
              color="pink-4"
              icon="local_atm"
              dense
              flat
              rounded
              padding="0 3px"
              class="font-bold text-[14px]"
              @click="abrirPagar(props.row)"
              ><q-tooltip> Pagar </q-tooltip></q-btn
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
  layout: 'punto',
});

import cajaPunto from '@/mocks/cajaPunto.json';
import { tesoreriaCobrar } from '~/helpers/columns';
import { onMounted, ref, watch } from 'vue';

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

const getTable = () => {
  // Obtener la fecha de inicio y fin de la semana actual
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(startOfWeek.getDate() - today.getDay()); // Lunes de la semana actual
  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + (6 - today.getDay())); // Domingo de la semana actual

  console.log(startOfWeek);
  console.log(endOfWeek);
  // Filtrar los pedidos de la semana actual
  pedidosCaja.value = cajaPunto
    .map((entidad) => {
      return {
        entidad: entidad.entidad,
        pedidosSemanaActual: entidad.pedidos.filter((pedido) => {
          const fechaPedido = new Date(pedido.pedido._creado);
          return fechaPedido >= startOfWeek && fechaPedido <= endOfWeek;
        }),
        pedidosAnteriores: entidad.pedidos.filter((pedido) => {
          const fechaPedido = new Date(pedido.pedido._creado);
          return fechaPedido < startOfWeek;
        }),
      };
    })
    .filter(
      (entidad) =>
        entidad.pedidosSemanaActual.length > 0 ||
        entidad.pedidosAnteriores.length > 0,
    );
  console.log(pedidosCaja.value);
};
const obtenerNombreMes = (fechaPedido) => {
  const meses = [
    'ENERO',
    'FEBRERO',
    'MARZO',
    'ABRIL',
    'MAYO',
    'JUNIO',
    'JULIO',
    'AGOSTO',
    'SEPTIEMBRE',
    'OCTUBRE',
    'NOVIEMBRE',
    'DICIEMBRE',
  ];
  const fecha = new Date(fechaPedido);
  const nombreMes = meses[fecha.getMonth()];
  return nombreMes;
};
const obtenerDiaSemana = (fechaPedido) => {
  const diasSemana = [
    'DOMINGO',
    'LUNES',
    'MARTES',
    'MIERCOLES',
    'JUEVES',
    'VIERNES',
    'SABADO',
  ];
  const fecha = new Date(fechaPedido);
  const nombreDia = diasSemana[fecha.getDay()];
  return nombreDia;
};

const abrirPagar = (fila) => {
  console.log('first');
  console.log(fila);
  isShowPagar.value = true;
  pedidoPagar.value.entidad = fila.entidad;
  // pedidoPagar.value.saldoTotal = fi

  let totalPedidosPorPagar = 0;

  for (const pedido of fila.pedidosSemanaActual) {
    totalPedidosPorPagar += pedido.porPagar;
  }

  for (const pedido of fila.pedidosAnteriores) {
    totalPedidosPorPagar += pedido.porPagar;
  }
  pedidoPagar.value.saldoTotal = totalPedidosPorPagar;
  pedidoPagar.value.nuevoSaldo = totalPedidosPorPagar - monto.value;
};

const filter = ref('');

watch(monto, () => {
  pedidoPagar.value.nuevoSaldo = pedidoPagar.value.saldoTotal - monto.value;
});
onMounted(() => {
  getTable();
});
</script>
