<template>
  <Navigation2
    :nav="[{ label: 'Pedidos', to: 'listaPedidos' }]"
    titulo="Gestion de pedidos" />
  <!-- TABS MENU -->
  <q-tabs v-model="tab" inline-label no-caps dense class="mb-3">
    <q-tab name="puntos" icon="bi-box-seam" label="Pedidos Puntos" />
    <q-tab name="global" icon="bi-box-seam" label="Pedido Global" />
    <q-tab name="historial" icon="bi-calendar-date" label="Historial" />
  </q-tabs>

  <!-- TAB PANELS INFORMACION -->
  <q-tab-panels
    v-model="tab"
    animated
    transition-prev="jump-up"
    transition-next="jump-up"
    class="bg-transparent">
    <!-- VER PEDIDOS PUNTOS -->
    <q-tab-panel
      name="puntos"
      class="flex flex-col justify-center items-center">
      <div class="w-full max-w-[400px] max-sm:w-[350px] mx-auto">
        <q-btn
          color="primary"
          label="prueba impresora"
          no-caps
          padding="2px 10px"
          @click="pruebaImpresora" />
        <div class="flex justify-between items-center mb-4">
          <h1 class="font-bold">Pedidos por Aceptar:</h1>

          <span class="flex gap-2" v-if="estado.pedidosSinAceptar.length > 0">
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
          :title2="formateadorFecha(punto.estado[0]._creado)">
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
                @click="imprimir(punto)" />
            </div>
          </template>
        </Item>
        <h1 class="font-bold">Pedidos Aceptados:</h1>
        <h1 v-if="estado.pedidosAceptados.length === 0">No hay pedidos😯...</h1>
        <Item
          v-for="punto in estado.pedidosAceptados"
          :key="punto._id"
          :href="`listaPedidos/${punto._id}`"
          :title="punto.comprador.nombre"
          class="w-[400px] max-sm:w-full"
          :title2="formateadorFecha(punto.estado[0]._creado)">
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

    <!-- VER PEDIDO GLOBAL -->
    <q-tab-panel name="global">
      <!-- TABS -->
      <q-tabs v-model="tabPuntos" inline-label no-caps dense>
        <q-tab class="[&>div>div]:font-bold" name="areaGlobal" label="Global" />
        <q-tab
          class="[&>div>div]:font-bold"
          name="panaderia"
          label="Panaderia"
          @click="obtenerOfertas(estado.panaderia)" />
        <q-tab
          class="[&>div>div]:font-bold"
          name="reposteria"
          label="Reposteria"
          @click="obtenerOfertas(estado.reposteria)" />
        <q-tab
          class="[&>div>div]:font-bold"
          name="envasados"
          label="Envasados"
          @click="obtenerOfertas(estado.envasados)" />
        <q-tab
          class="[&>div>div]:font-bold"
          name="embotellados"
          label="Embotellados"
          @click="obtenerOfertas(estado.embotellados)" />
        <q-tab
          class="[&>div>div]:font-bold"
          name="siinple"
          label="Siinple"
          @click="obtenerOfertas(estado.siinple)" />
      </q-tabs>
    </q-tab-panel>

    <!-- VER HISTORIAL DE PEDIDOS -->
    <q-tab-panel
      name="historial"
      class="flex flex-col justify-center items-center">
      <Historial />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import Puntos from '../puntos/Puntos.vue';
import Global from '../global/Global.vue';
import Historial from '../historial/Historial.vue';
import { useListaPedidos } from './listaPedidos.composable';

definePageMeta({
  layout: 'cathering'
});

const { estado, buscarPedidos2, obtenerOfertas } = useListaPedidos();

const tab = ref('puntos');
const tabPuntos = ref('areaGlobal');
</script>
