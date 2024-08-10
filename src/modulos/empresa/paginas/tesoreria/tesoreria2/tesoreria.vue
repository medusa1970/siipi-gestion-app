<template>
  <NuxtLayout name="cathering">
    <Table
      badge
      :rows="estado.pedidosCaja"
      :columns="estado.tesoreriaCobrar"
      dense>
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
                      0
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
              class="flex flex-col gap-[3px]">
              <p class="text-center font-bold">{{ props.row.entidad }}</p>
              <div
                v-for="(pedido, index) in props.row.pedidosAnteriores"
                :key="pedido._id">
                <!-- <p>{{ obtenerNombreMes(pedido.pedido._creado) }}</p> -->
                <div
                  v-if="
                    index === 0 ||
                    obtenerNombreMes(pedido.pedido._creado) !==
                      obtenerNombreMes(
                        props.row.pedidosAnteriores[index - 1].pedido._creado
                      )
                  "
                  class="font-bold bg-gray-200">
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
                      0
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
              class="flex flex-col gap-[3px]">
              <!-- <h1 class="font-bold">MES</h1> -->
              <!-- <p>{{ props.row.pedidosSemanaActual }}</p> -->
              <p class="text-center font-bold">{{ props.row.entidad }}</p>
              <div
                v-for="pedido in props.row.pedidosSemanaActual"
                :key="pedido._id">
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
                  0
                ) +
                props.row.pedidosSemanaActual.reduce(
                  (total, pedido) => total + pedido.porPagar,
                  0
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
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useTesoreria } from './tesoreria.composable';
const { estado, store, authStore, router, getTable, totalCambio } =
  useTesoreria();

provide('infoPagina', {
  titulo: 'Gestion de tesoreria',
  camino: [{ label: 'Tesoreria', to: 'tesoreria' }]
});
</script>
