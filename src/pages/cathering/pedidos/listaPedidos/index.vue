<template>
  <Navigation label="pedidos" icon="group" />
  <!-- <code>{{ estado.pedidosEntidad }}</code> -->
  <div>
    <q-tabs v-model="tab" inline-label no-caps dense class="mb-3">
      <q-tab
        name="proveedor"
        icon="bi-cart4"
        label="Pedidos Proveedor"
        @click="buscarPedidos"
      />
      <q-tab name="puntos" icon="bi-box-seam" label="Pedidos Puntos" />
      <q-tab name="historial" icon="bi-calendar-date" label="Historial" />
    </q-tabs>
    <q-tab-panels
      v-model="tab"
      animated
      transition-prev="jump-up"
      transition-next="jump-up"
      class="bg-transparent"
    >
      <!-- VER PEDIDOS PROVEEDOR -->
      <q-tab-panel name="proveedor" class="flex justify-center items-center">
        <div class="flex flex-col gap-2 justify-center items-center">
          <h1 v-if="estado.pedidosEntidad.length === 0">No hay pedido😯...</h1>
          <Item
            v-for="punto in estado.pedidosEntidad"
            :key="punto._id"
            :href="`listaPedidos/${punto._id}`"
            :title="punto._id"
            class="w-[400px] max-sm:w-full"
            :title2="formatearFecha(punto.estado[0].fecha)"
          >
            <template v-slot:actions>
              <div class="flex">
                <h1 class="text-orange-500 font-bold">
                  {{ punto.estadoItems }}
                </h1>
                <q-btn
                  dense
                  round
                  icon="edit"
                  flat
                  color="blue"
                  padding="4px"
                  size="12px"
                />
                <q-btn
                  dense
                  round
                  icon="print"
                  flat
                  color="orange"
                  padding="4px"
                  size="12px"
                />
              </div>
            </template>
          </Item>
        </div>
      </q-tab-panel>
      <!-- VER PEDIDOS PUNTOS -->
      <q-tab-panel name="puntos">
        <!-- NEW FORMAT -->
        <q-tabs v-model="tabPuntos" inline-label no-caps dense>
          <q-tab
            class="[&>div>div]:font-bold"
            name="pPuntos"
            label="Pedidos Puntos"
            @click="buscarPedidos"
          />
          <q-tab
            class="[&>div>div]:font-bold"
            name="pGlobal"
            label="Pedido global"
          />
        </q-tabs>

        <q-tab-panels
          v-model="tabPuntos"
          animated
          transition-prev="jump-up"
          transition-next="jump-up"
          class="bg-transparent"
        >
          <!-- PEDIDOS PUNTOS -->
          <q-tab-panel name="pPuntos" class="flex justify-center">
            <div class="w-full max-w-[400px] mx-auto">
              <div class="flex justify-between items-center mb-4">
                <h1 class="font-bold">Pedidos por Aceptar:</h1>

                <span
                  class="flex gap-2"
                  v-if="estado.pedidosSinAceptar.length > 0"
                >
                  <q-btn
                    class="text-orange-500"
                    icon="warning"
                    dense
                    size="11px"
                    flat
                    round
                  />
                  <!-- <q-btn
                    color="primary"
                    label="Directo"
                    padding="0px 10px"
                    no-caps
                    @click="aceptarTodosLosPedidosDirectos"
                  />
                  <q-btn
                    color="primary"
                    label="Solicitud"
                    padding="0px 10px"
                    no-caps
                    @click="aceptarTodosLosPedidosSolicitables"
                  /> -->
                </span>
              </div>
              <h1 v-if="estado.pedidosSinAceptar.length === 0">
                No hay pedidos😯...
              </h1>

              <Item
                v-for="punto in estado.pedidosSinAceptar"
                :key="punto._id"
                :title="punto.comprador.nombre"
                class="w-full max-sm:w-full"
                :href="`listaPedidos/${punto._id}`"
              >
                <template v-slot:actions>
                  <div class="flex">
                    <!-- <h1 class="text-orange-500 font-bold">
                  {{ punto.estadoItems }}
                </h1> -->
                    <!-- <q-btn
                      dense
                      round
                      icon="check"
                      flat
                      color="green"
                      padding="4px"
                      size="12px"
                      @click="aceptarTodoPedido(punto._id)"
                      ><q-tooltip class="bg-gray-400-500"
                        >Aceptar pedido</q-tooltip
                      ></q-btn
                    > -->
                    <q-btn
                      dense
                      round
                      icon="print"
                      flat
                      color="orange"
                      padding="4px"
                      size="12px"
                      class="no-print"
                      @click="imprimir"
                      ><q-tooltip class="bg-gray-400-500"
                        >Imprimir pedido</q-tooltip
                      ></q-btn
                    >
                  </div>
                </template>
              </Item>
              <h1 class="font-bold">Pedidos Aceptados:</h1>
              <h1 v-if="estado.pedidosAceptados.length === 0">
                No hay pedidos😯...
              </h1>
              <Item
                v-for="punto in estado.pedidosAceptados"
                :key="punto._id"
                :href="`listaPedidos/${punto._id}`"
                :title="punto.comprador.nombre"
                class="w-[400px] max-sm:w-full"
                :title2="formatearFecha(punto.estado[0].fecha)"
              >
                <template v-slot:actions>
                  <div class="flex">
                    <h1 class="text-orange-500 font-bold">
                      {{ punto.estadoItems }}
                    </h1>
                    <q-btn
                      dense
                      round
                      icon="print"
                      flat
                      color="orange"
                      padding="4px"
                      size="12px"
                      class="no-print"
                      @click="imprimir"
                    />
                  </div>
                </template>
              </Item>
            </div>
          </q-tab-panel>
          <!-- PEDIDOS GLOBAL -->
          <q-tab-panel name="pGlobal">
            <div class="">
              <div
                class="flex gap-3 items-center"
                style="margin: 0 0 10px 0 !important"
              >
                <h1 class="font-extrabold text-lg uppercase">
                  Pedidos Solicitables
                </h1>
                <q-btn
                  color="primary"
                  label="Aceptar todos"
                  padding="0px 10px"
                  no-caps
                  @click="aceptarTodosLosPedidosSolicitables"
                />
              </div>
              <TableSimple
                :rows="storePedido.pedidosSolicitado"
                :columns="pedidoGlobal"
                dense
              >
                <!-- ACTIONS -->
                <template #body-cell-actions="{ props }">
                  <q-td :props="props">
                    <q-btn
                      color="orange"
                      icon="bi-check2-circle"
                      dense
                      flat
                      round
                      size="12px"
                      padding="2px"
                      @click="ofertaPreparado(props.row)"
                      ><q-tooltip class="bg-gray-400-500"
                        >Preparado</q-tooltip
                      ></q-btn
                    >
                    <q-btn
                      color="primary"
                      icon="bi-eye"
                      dense
                      flat
                      round
                      size="12px"
                      padding="2px"
                      @click="verPedidoPuntos(props.row)"
                      ><q-tooltip class="bg-gray-400-500"
                        >Ver Producto</q-tooltip
                      ></q-btn
                    >
                  </q-td>
                </template>
              </TableSimple>
              <div
                class="flex gap-3 items-center"
                style="margin: 0 0 10px 0 !important"
              >
                <h1 class="font-extrabold text-lg uppercase">
                  Pedidos Directos
                </h1>
                <q-btn
                  color="primary"
                  label="Aceptar todos"
                  padding="0px 10px"
                  no-caps
                  @click="aceptarTodosLosPedidosDirectos"
                />
              </div>
              <TableSimple
                :rows="storePedido.pedidosDirecto"
                :columns="pedidoGlobal"
                dense
              >
                <!-- ACTIONS -->
                <template #body-cell-actions="{ props }">
                  <q-td :props="props">
                    <q-btn
                      color="orange"
                      icon="bi-check2-circle"
                      dense
                      flat
                      round
                      size="12px"
                      padding="2px"
                      @click="ofertaPreparado(props.row)"
                      ><q-tooltip class="bg-gray-400-500"
                        >Preparado</q-tooltip
                      ></q-btn
                    >
                    <q-btn
                      color="primary"
                      icon="bi-eye"
                      dense
                      flat
                      round
                      size="12px"
                      padding="2px"
                      @click="verPedidoPuntos(props.row)"
                      ><q-tooltip class="bg-gray-400-500"
                        >Ver Producto</q-tooltip
                      ></q-btn
                    >
                  </q-td>
                </template>
              </TableSimple>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-tab-panel>
      <!-- VER HISTORIAL DE PEDIDOS -->
      <q-tab-panel name="historial">
        <div class="flex justify-center">
          <q-input
            dense
            filled
            v-model="date"
            mask="date"
            :rules="['date']"
            class="w-[250px]"
            clearable
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>

  <!-- MODAL -->
  <q-dialog v-model="estado.modal.isShowPedidos" persistent>
    <q-card class="w-[370px]" style="padding: 0.5rem !important">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-lg font-semibold">Pedidos puntos</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <h1 class="bg-gray-300 text-center my-2">puntos</h1>
        <div
          class="flex items-center gap-1 mb-[6px]"
          v-for="punto in estado.pedidoPuntos"
          :key="punto"
        >
          <h1 class="font-bold">{{ punto.nombre }}</h1>
          <h1 class="font-bold">{{ punto.cantidad }}</h1>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
definePageMeta({
  layout: 'cathering',
});
import { ref, onMounted } from 'vue';
import { aceptados, porAceptar } from '@/mocks/puntos.json';
import { usePedido } from '@/composables/punto/usePedido';
import { pedidoGlobal } from '~/helpers/columns';

const {
  buscarPedidos2,
  estado,
  formatearFecha,
  aceptarTodoPedido,
  buscarPedidos,
  aceptarTodosLosPedidosSolicitables,
  storePedido,
  aceptarTodosLosPedidosDirectos,
  verPedidoPuntos,
  ofertaPreparado,
} = usePedido();

const tab = ref('puntos');
const tabPuntos = ref('pGlobal');
const date = ref('2020/07/08');

onMounted(() => {
  buscarPedidos2();
});

const imprimir = () => {
  console.log('imprimir');
  let printContents = document.getElementById('imprimir').innerHTML;
  let originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;

  window.print();

  document.body.innerHTML = originalContents;
};
</script>

<style lang="scss" scoped>
@media print {
  .no-print {
    display: none;
  }
}
</style>
