<template>
  <!-- TABS -->
  <q-tabs v-model="estado.tabPuntos" inline-label no-caps dense>
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

  <!-- PANELES -->
  <q-tab-panels
    v-model="estado.tabPuntos"
    animated
    transition-prev="jump-up"
    transition-next="jump-up"
    class="bg-transparent">
    <q-tab-panel name="areaGlobal" class="!p-2">
      <div>
        <!-- PEDIDOS SOLICITABLES -->
        <section
          class="flex gap-3 items-center"
          style="margin: 0 0 10px 0 !important">
          <h1 class="font-extrabold text-lg uppercase">Pedidos Solicitables</h1>
          <q-btn
            color="primary"
            label="Aceptar todos"
            padding="0px 10px"
            no-caps
            v-if="
              pedidoStore.pedidosSolicitado.every(pedido =>
                pedido.estado.some(estado => estado.estado === 'preparado')
              )
            "
            @click="aceptarTodosLosPedidosSolicitables" />
        </section>
        <TableSimple
          :rows="pedidoStore.pedidosSolicitado"
          :columns="pedidoGlobal"
          dense
          badge>
          <!-- BADGE -->
          <template #rows-badge="{ props }">
            <q-tr
              :props="props"
              :class="[
                props.row.estado.some(e => e.estado === 'preparado') &&
                  '!text-gray-300 !font-bold'
              ]">
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
                      props.row.estado.some(e => e.estado === 'ajustado') &&
                        '!text-gray-300 !font-bold'
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
                      props.row.estado.some(e => e.estado === 'preparado') &&
                        '!text-gray-300 !font-bold'
                    ]"
                    icon="bi-check2-circle"
                    dense
                    flat
                    round
                    size="12px"
                    padding="2px"
                    :disable="
                      props.row.estado.some(e => e.estado === 'preparado')
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

        <!-- PEDIDOS DIRECTOS -->
        <section
          class="flex gap-3 items-center"
          style="margin: 0 0 10px 0 !important">
          <h1 class="font-extrabold text-lg uppercase">Pedidos Directos</h1>
          <q-btn
            color="primary"
            label="Aceptar todos"
            padding="0px 10px"
            no-caps
            v-if="
              pedidoStore.pedidosDirecto.every(pedido =>
                pedido.estado.some(estado => estado.estado === 'preparado')
              )
            "
            @click="aceptarTodosLosPedidosDirectos" />
        </section>
        <TableSimple
          :rows="pedidoStore.pedidosDirecto"
          :columns="pedidoGlobal"
          dense
          badge>
          <!-- BADGE -->
          <template #rows-badge="{ props }">
            <q-tr
              :props="props"
              :class="[
                props.row.estado.some(e => e.estado === 'preparado') &&
                  '!text-gray-300 !font-bold'
              ]">
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
                      props.row.estado.some(e => e.estado === 'ajustado') &&
                        '!text-gray-300 !font-bold'
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
                      props.row.estado.some(e => e.estado === 'preparado') &&
                        '!text-gray-300 !font-bold'
                    ]"
                    color="green-5"
                    icon="bi-check2-circle"
                    dense
                    flat
                    round
                    size="12px"
                    padding="2px"
                    :disable="
                      props.row.estado.some(e => e.estado === 'preparado')
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
      </div>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { usePedidoGlobal } from './global.composable';
definePageMeta({
  layout: 'cathering'
});

const { estado, pedidoStore } = usePedidoGlobal();

const pedidoGlobal = [
  {
    name: 'nombre',
    required: true,
    label: 'Nombre(s)',
    align: 'left',
    field: (row: any) => row.oferta.nombre,
    sortable: true
  },
  {
    name: 'pedido',
    required: true,
    label: 'Pedido',
    align: 'center',
    field: (row: any) => row.cantidad,
    sortable: true
  },
  {
    name: 'cantidadPedido',
    required: true,
    label: 'Cantidad Pedido',
    align: 'center',
    field: (row: any) =>
      row.cantidad * row.oferta.cantidad + `(${row.presentacionBasica})`,
    sortable: true
  },
  {
    name: 'cantidadStock',
    required: true,
    label: 'Cantidad Stock',
    align: 'center',
    field: (row: any) => row.stockEntidad + `(${row.presentacionBasica})`,
    sortable: true
  },
  {
    name: 'diferencia',
    required: true,
    label: 'Diferencia',
    align: 'right',
    field: (row: any) => row.stockEntidad - row.cantidad,
    sortable: true
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right'
  }
];
console.log(pedidoGlobal);
</script>
