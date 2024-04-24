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
            :title="punto.vendedor.nombre"
            class="w-[400px] max-sm:w-full"
            :title2="formateadorFecha(punto.estado[0].fecha)"
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
            @click="handlePedidoGlobal"
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
            <div class="w-full max-w-[400px] max-sm:w-[350px] mx-auto">
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
                    @click="mostrarEntidadSinPedidos"
                    ><q-tooltip class="no-print bg-gray-400-500"
                      >Entidades sin pedidos</q-tooltip
                    ></q-btn
                  >
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
                :title2="formateadorFecha(punto.estado[0].fecha)"
              >
                <template v-slot:actions>
                  <div class="flex">
                    <q-btn
                      dense
                      round
                      icon="print"
                      flat
                      color="orange"
                      padding="4px"
                      size="12px"
                      class="no-print"
                      @click="imprimir(punto)"
                      ><q-tooltip class="no-print bg-gray-400-500"
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
                :title2="formateadorFecha(punto.estado[0].fecha)"
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
                      @click="imprimir(punto)"
                      ><q-tooltip class="no-print bg-gray-400-500"
                        >Imprimir pedido</q-tooltip
                      ></q-btn
                    >
                  </div>
                </template>
              </Item>
            </div>
          </q-tab-panel>
          <!-- PEDIDOS GLOBAL -->
          <q-tab-panel name="pGlobal">
            <!-- <div class="flex justify-center">
              <q-btn
                no-caps
                padding="2px 10px"
                color="primary"
                label="orden global"
                @click="filtroPedidosGlobal"
              />
            </div> -->
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
              <!-- <code>{{ storePedido.pedidosSolicitado }}</code> -->
              <TableSimple
                :rows="storePedido.pedidosSolicitado"
                :columns="pedidoGlobal"
                dense
                badge
              >
                <!-- BADGE -->
                <template #rows-badge="{ props }">
                  <q-tr
                    :props="props"
                    :class="[
                      props.row.estado.some((e) => e.estado === 'preparado') &&
                        '!text-gray-300 !font-bold',
                    ]"
                  >
                    <q-td key="nombre" :props="props">
                      {{ props.row.oferta.nombre }}
                    </q-td>
                    <q-td key="pedido" :props="props">
                      {{ props.row.cantidad }}
                      <!-- {{ props.row.items[0] }} -->
                    </q-td>
                    <q-td key="cantidadPedido" :props="props">
                      {{ props.row.cantidad * props.row.oferta.cantidad }}
                      ({{ props.row.presentacionBasica }})
                      <!-- {{ props.row.items[0] }} -->
                    </q-td>
                    <q-td key="cantidadStock" :props="props">
                      {{ props.row.stockEntidad }}
                      ({{ props.row.presentacionBasica }})
                    </q-td>
                    <q-td key="diferencia" :props="props">
                      {{ props.row.stockEntidad - props.row.cantidad }}
                    </q-td>
                    <q-td key="actions" :props="props">
                      <div class="flex justify-end">
                        <q-btn
                          v-if="props.row.stockEntidad - props.row.cantidad < 0"
                          :class="[
                            'text-orange-500',
                            props.row.estado.some(
                              (e) => e.estado === 'ajustado',
                            ) && '!text-gray-300 !font-bold',
                          ]"
                          icon="bi-wrench-adjustable"
                          dense
                          flat
                          round
                          size="10px"
                          padding="2px"
                          @click="ajustarOferta(props.row)"
                          ><q-tooltip class="bg-gray-400-500"
                            >Ajustar</q-tooltip
                          ></q-btn
                        >
                        <q-btn
                          :class="[
                            'text-green-500',
                            props.row.estado.some(
                              (e) => e.estado === 'preparado',
                            ) && '!text-gray-300 !font-bold',
                          ]"
                          icon="bi-check2-circle"
                          dense
                          flat
                          round
                          size="12px"
                          padding="2px"
                          :disable="
                            props.row.estado.some(
                              (e) => e.estado === 'preparado',
                            )
                          "
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
                      </div>
                    </q-td>
                  </q-tr>
                </template>
              </TableSimple>
              <div
                class="flex gap-3 items-center"
                style="margin: 0 0 10px 0 !important"
              >
                <!-- <code>{{
                  storePedido.pedidosDirecto.map((pedido) => pedido.estado)
                }}</code> -->
                <h1 class="font-extrabold text-lg uppercase">
                  Pedidos Directos
                </h1>
                <!-- v-if="
                    storePedido.pedidosDirecto.every((pedido) =>
                      pedido.estado.some(
                        (estado) => estado.estado === 'preparado',
                      ),
                    )

                    NO FUNCIONA ARREGLAR
                  " -->
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
                badge
              >
                <!-- BADGE -->
                <template #rows-badge="{ props }">
                  <q-tr
                    :props="props"
                    :class="[
                      props.row.estado.some((e) => e.estado === 'preparado') &&
                        '!text-gray-300 !font-bold',
                    ]"
                  >
                    <q-td key="nombre" :props="props">
                      {{ props.row.oferta.nombre }}
                    </q-td>
                    <q-td key="pedido" :props="props">
                      {{ props.row.cantidad }}
                      <!-- {{ props.row.items[0] }} -->
                    </q-td>
                    <q-td key="cantidadPedido" :props="props">
                      {{ props.row.cantidad * props.row.oferta.cantidad }}
                      ({{ props.row.presentacionBasica }})
                      <!-- {{ props.row.items[0] }} -->
                    </q-td>
                    <q-td key="cantidadStock" :props="props">
                      {{ props.row.stockEntidad }}
                      ({{ props.row.presentacionBasica }})
                    </q-td>
                    <q-td key="diferencia" :props="props">
                      {{ props.row.stockEntidad - props.row.cantidad }}
                    </q-td>
                    <q-td key="actions" :props="props">
                      <div class="flex justify-end">
                        <q-btn
                          v-if="props.row.stockEntidad - props.row.cantidad < 0"
                          :class="[
                            'text-orange-500',
                            props.row.estado.some(
                              (e) => e.estado === 'ajustado',
                            ) && '!text-gray-300 !font-bold',
                          ]"
                          icon="bi-wrench-adjustable"
                          dense
                          flat
                          round
                          size="10px"
                          padding="2px"
                          @click="ajustarOferta(props.row)"
                          ><q-tooltip class="bg-gray-400-500"
                            >Ajustar</q-tooltip
                          ></q-btn
                        >
                        <q-btn
                          :class="[
                            'text-green-500',
                            props.row.estado.some(
                              (e) => e.estado === 'preparado',
                            ) && '!text-gray-300 !font-bold',
                          ]"
                          color="green-5"
                          icon="bi-check2-circle"
                          dense
                          flat
                          round
                          size="12px"
                          padding="2px"
                          :disable="
                            props.row.estado.some(
                              (e) => e.estado === 'preparado',
                            )
                          "
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
                      </div>
                    </q-td>
                  </q-tr>
                </template>
                <!-- ACTIONS -->
                <!-- <template #body-cell-actions="{ props }">
                  <q-td :props="props">
                    <q-btn
                      v-if="props.row.stockEntidad - props.row.cantidad < 0"
                      :class="[
                        'text-orange-500',
                        props.row.estado.some((e) => e.estado === 'ajustado') &&
                          '!text-gray-300 !font-bold',
                      ]"
                      icon="bi-wrench-adjustable"
                      dense
                      flat
                      round
                      size="10px"
                      padding="2px"
                      @click="ajustarOferta(props.row)"
                      ><q-tooltip class="bg-gray-400-500"
                        >Ajustar</q-tooltip
                      ></q-btn
                    >
                    <q-btn
                      :class="[
                        'text-green-500',
                        props.row.estado.some(
                          (e) => e.estado === 'preparado',
                        ) && '!text-gray-300 !font-bold',
                      ]"
                      color="green-5"
                      icon="bi-check2-circle"
                      dense
                      flat
                      round
                      size="12px"
                      padding="2px"
                      :disable="
                        props.row.estado.some((e) => e.estado === 'preparado')
                      "
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
                </template> -->
              </TableSimple>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-tab-panel>
      <!-- VER HISTORIAL DE PEDIDOS -->
      <q-tab-panel
        name="historial"
        class="flex flex-col justify-center items-center"
      >
        <q-input
          dense
          filled
          readonly
          v-model="date"
          mask="date"
          :rules="['date']"
          class="w-[250px] !my-2"
          clearable
        >
          <template v-slot:append>
            <!-- <q-btn icon="check" label="OK" @click="onClick" /> -->
            <q-icon name="bi-calendar-day" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="date" :options="dateOption">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <div
          class="flex flex-col gap-2 justify-center items-center max-sm:w-[350px]"
        >
          <h1 v-if="estado.pedidosFiltrados.length === 0">
            No hay pedido😯...
          </h1>
          <Item
            v-for="punto in estado.pedidosFiltrados"
            :key="punto._id"
            :href="`listaPedidos/${punto._id}`"
            :title="punto.comprador.nombre"
            class="w-[400px] max-sm:w-full"
            :title2="formateadorFecha(punto.estado[0].fecha)"
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
                />
              </div>
            </template>
          </Item>
        </div>
      </q-tab-panel>
    </q-tab-panels>
    <!-- IMPRESION -->
    <div
      id="divParaImprimir"
      v-if="pedidoSeleccionado"
      class="w-[283px] border-[1px] [&>p]:!text-[10px] !p-2"
    >
      <h1 class="text-center font-bold !text-[13px]">Siipi Factura</h1>
      <p>Origen: {{ pedidoSeleccionado.comprador.nombre }}</p>
      <p>Destino: {{ pedidoSeleccionado.vendedor.nombre }}</p>
      <p>
        Responsable: {{ pedidoSeleccionado.estado[0].persona.nombre }}
        {{ pedidoSeleccionado.estado[0].persona.apellido }}
      </p>
      <p>Fecha: {{ formateadorFecha(pedidoSeleccionado.estado[0].fecha) }}</p>
      <p class="text-center">
        ------------------------------------------------
      </p>
      <h1 class="font-bold !text-[11px]">Productos:</h1>
      <div v-for="item in pedidoSeleccionado.items" :key="item._id">
        <div class="flex gap-2 !text-[10px]">
          <p>{{ item.cantidad }}</p>
          <p>{{ item.oferta.nombre }}</p>
        </div>
      </div>
    </div>
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
        <!-- <h1 class="bg-gray-300 text-center my-2">puntos</h1> -->
        <table class="w-full !my-2">
          <thead class="bg-blue-600 text-white">
            <tr>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Ruta</th>
              <th>Orden</th>
            </tr>
          </thead>
          <tbody class="[&>tr]:border-b-[1px]">
            <tr
              v-for="punto in estado.pedidoPuntos"
              :key="punto"
              class="text-center"
            >
              <td>{{ punto.nombre }}</td>
              <td>{{ punto.cantidad }}</td>
              <td>{{ punto.ruta }}</td>
              <td>{{ punto.orden }}</td>
            </tr>
          </tbody>
        </table>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- MODAL -->
  <q-dialog v-model="estado.modal.isShowEntidad" persistent>
    <q-card class="w-[370px]" style="padding: 0.5rem !important">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-lg font-bold">
          {{ estado.entidadesSinPedidos.length }} Entidades sin pedidos
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <!-- <h1 class="bg-gray-300 text-center my-2">
          {{ estado.entidadesSinPedidos.length }} entidades
        </h1> -->
        <div v-for="entidad in estado.entidadesSinPedidos" :key="entidad">
          <h1>{{ entidad.nombre }}</h1>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
definePageMeta({
  layout: 'cathering',
});
import { ref, onMounted, watch } from 'vue';
import { aceptados, porAceptar } from '@/mocks/puntos.json';
import { usePedido } from '@/composables/punto/usePedido';
import { pedidoGlobal } from '~/helpers/columns';
import { formateadorFecha } from '@/helpers/fecha';

const {
  buscarPedidos2,
  estado,
  aceptarTodoPedido,
  buscarPedidos,
  aceptarTodosLosPedidosSolicitables,
  storePedido,
  aceptarTodosLosPedidosDirectos,
  verPedidoPuntos,
  ofertaPreparado,
  ajustarOferta,
  handlePedidoGlobal,
  mostrarEntidadSinPedidos,
  filtroHistorial,
  filtroPedidosGlobal,
} = usePedido();

const tab = ref('puntos');
const tabPuntos = ref('pGlobal');
const date = ref(new Date().toLocaleDateString('en-CA').replace(/-/g, '/'));
const pedidoSeleccionado = ref(null);
const imprimir = (pedido) => {
  pedidoSeleccionado.value = pedido;

  setTimeout(() => {
    const divParaImprimir = document.getElementById('divParaImprimir');

    divParaImprimir.style.display = 'block';
    window.print();
    document.body.style.display = 'block';
    divParaImprimir.style.display = 'none';
  }, 200);
};
const dateOption = (date) => {
  // console.log(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(date) <= today;
};

watch(date, (value) => {
  // console.log(value);
  // console.log(date.value);
  filtroHistorial(value);
});
onMounted(async () => {
  await buscarPedidos2();
  filtroHistorial(new Date().toLocaleDateString('en-CA').replace(/-/g, '/'));
});
</script>

<style lang="scss" scoped>
@media print {
  /* Ocultar la URL del navegador en la impresión */
  #url {
    display: none;
  }

  @page :left {
    margin: 0.5cm;
  }

  @page :right {
    margin: 0.8cm;
  }
  .no-print {
    display: none;
  }
}
</style>
