<template>
  <Navigation label="Caja" icon="group" />

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
          </p>
        </q-td>
        <q-td key="actions" :props="props">
          <div class="flex gap-1 justify-end">
            <q-btn
              color="blue"
              label="I"
              dense
              padding="0 6px"
              class="font-bold text-[12px]"
              ><q-tooltip> Imprimir </q-tooltip></q-btn
            >
            <q-btn
              color="orange"
              label="M"
              dense
              padding="0 3px"
              class="font-bold text-[12px]"
              @click="multar(props.row)"
              ><q-tooltip> Multar </q-tooltip></q-btn
            >
            <q-btn
              color="red"
              label="B"
              dense
              padding="0 3px"
              class="font-bold text-[12px]"
              @click="bloquear(props.row)"
              ><q-tooltip> Bloquear </q-tooltip></q-btn
            >
            <q-btn
              color="pink-4"
              label="C"
              dense
              padding="0 3px"
              class="font-bold text-[12px]"
              @click="abrirCobrar(props.row)"
              ><q-tooltip> Cobrar </q-tooltip></q-btn
            >
          </div>
        </q-td>
      </q-tr>
    </template>
  </Table>

  <!-- COBRAR -->
  <Dialog2 v-model="isShowCobrar" title="Recibir efectivo" labelBtn="Confirmar">
    <template #inputsDialog>
      <div class="flex justify-center gap-3">
        <div class="flex flex-col">
          <h1>Seleccionar monto</h1>
          <span class="flex gap-1 items-center">
            <q-icon
              name="bi-calculator"
              size="25px"
              @click="isShowCalculator = true"
            />
            <input
              type="number"
              class="w-[90px] test border-[1px] border-gray-400 px-2 py-1 outline-none bg-transparent"
              v-model.number="totalCambio"
              disabled
            />
          </span>
        </div>
        <div class="flex flex-col">
          <h1>Seleccionar cambio</h1>
          <span class="flex gap-2 items-center">
            <q-icon name="bi-calculator" size="25px" />
            <input
              type="number"
              class="w-[90px] test border-[1px] border-gray-400 px-2 py-1 outline-none bg-transparent"
              v-model.number="montoCambio"
            />
          </span>
        </div>
      </div>
      <section class="flex justify-between [&>h1]:text-[13px] px-1 mt-1">
        <h1>Saldo Actual: {{ detalleCobro.saldoTotal }}Bs</h1>
        <h1>Nuevo saldo: 10.000</h1>
      </section>
      <hr class="border-gray-300" />
      <div class="flex gap-2 my-2">
        <div class="p-1">
          <h1 class="uppercase font-bold">
            {{ storeAuth.negocioElegido.nombre }}
          </h1>
          <div class="grid grid-cols-[1fr,1fr,auto] place-items-center gap-2">
            <q-input
              v-model="storeAuth.user.usuario"
              type="text"
              label="Usuario"
              dense
              disable
            />
            <q-input
              v-model="personaPro.contrasena"
              type="text"
              label="Contrasena"
              dense
              clearable
            />
            <q-btn color="primary" label="OK" dense rounded size="12px" />
          </div>
        </div>
        <div class="p-1">
          <h1 class="uppercase font-bold">{{ detalleCobro.entidad }}</h1>
          <div class="grid grid-cols-[1fr,1fr,auto] place-items-center gap-2">
            <q-input
              v-model="personaPun.usuario"
              type="text"
              label="Usuario"
              dense
              clearable
            />
            <q-input
              v-model="personaPun.contrasena"
              type="text"
              label="Contrasena"
              dense
              clearable
            />
            <q-btn color="primary" label="OK" dense rounded size="12px" />
          </div>
        </div>
      </div>
    </template>
  </Dialog2>

  <!-- CALCULADORE DE BILLETE -->
  <Dialog2 v-model="isShowCalculator" title="Calculadora de billetes" noBtn>
    <template #inputsDialog>
      <div class="grid grid-cols-2">
        <section
          v-for="(monto, index) in montos"
          :key="index"
          class="flex gap-2 [&>h1]:w-[50px]"
        >
          <h1>{{ monto }}Bs</h1>
          <input
            v-model="cantidades[index]"
            type="number"
            onfocus="this.select()"
            class="w-[70px] test border-[1px] border-gray-400 px-2 py-1 outline-none bg-transparent"
          />
        </section>
      </div>

      <!-- LOGICA PARA HACER EL TOTAL -->
      <h1 class="text-center mt-2 font-extrabold">TOTAL: {{ totalCambio }}</h1>
    </template>
  </Dialog2>
</template>
<script setup>
//@ts-ignore
definePageMeta({
  layout: 'cathering',
});

import caja from '@/mocks/caja.json';
import { tesoreriaCobrar } from '~/helpers/columns';
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { NotifySucessCenter } from '~/helpers/message.service';
import { authStore } from '~/stores/auth.store';

const storeAuth = authStore();
const $q = useQuasar();
// console.log(caja);
const pedidosCaja = ref([]);
const multa = ref();
const isShowCobrar = ref(false);
const isShowCalculator = ref(false);
const montoCobrar = ref();
const montoCambio = ref();
const personaPro = ref({
  usuario: '',
  contrasena: '',
});
const personaPun = ref({
  usuario: '',
  contrasena: '',
});
const montos = ref([200, 5, 100, 2, 50, 1, 20, 0.5, 10]); // Montos disponibles
const cantidades = ref(new Array(montos.value.length).fill(0)); // Cantidades ingresadas
const detalleCobro = ref({
  entidad: '',
  saldoTotal: 0,
});

const totalCambio = computed(() => {
  let total = 0;
  for (let i = 0; i < montos.value.length; i++) {
    total += montos.value[i] * cantidades.value[i];
  }
  return total;
});

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
  pedidosCaja.value = caja
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

const multar = (row) => {
  console.log('first');
  $q.dialog({
    title: `${row.entidad}`,
    message: '¿Quiere activar multa?',
    cancel: true,
    persistent: true,
    prompt: {
      model: multa,
      type: 'number',
      clearable: true,
      step: 2,
      label: 'Ingrese la cantidad',
      outlined: true,
      dense: true,
    },
  }).onOk(async () => {
    NotifySucessCenter('Multa agregado correctamente');
  });
};
const bloquear = (row) => {
  console.log('first');
  $q.dialog({
    title: `${row.entidad}`,
    message: '¿Quiere bloquear los pedidos?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    NotifySucessCenter('Multa agregado correctamente');
  });
};
const abrirCobrar = (fila) => {
  console.log('first');
  console.log(fila);
  isShowCobrar.value = true;
  detalleCobro.value.entidad = fila.entidad;
  // pedidoPagar.value.saldoTotal = fi

  let totalPedidosPorPagar = 0;

  for (const pedido of fila.pedidosSemanaActual) {
    totalPedidosPorPagar += pedido.porPagar;
  }

  for (const pedido of fila.pedidosAnteriores) {
    totalPedidosPorPagar += pedido.porPagar;
  }
  console.log(totalPedidosPorPagar);
  detalleCobro.value.saldoTotal = totalPedidosPorPagar;
  // pedidoPagar.value.nuevoSaldo = totalPedidosPorPagar - monto.value;
};

const filter = ref('');

onMounted(() => {
  getTable();
});
</script>
