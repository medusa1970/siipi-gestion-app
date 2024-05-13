<template>
  <Navigation label="pedidos" icon="group" />
  <!-- <code>{{ estado.pedidosEntidad }}</code> -->
  <div>
    <!-- TABS MENU -->
    <q-tabs v-model="tab" inline-label no-caps dense class="mb-3">
      <q-tab
        name="proveedor"
        icon="bi-cart4"
        label="Pedidos Proveedor"
        @click="buscarPedidos"
      />
      <q-tab name="puntos" icon="bi-box-seam" label="Pedidos Puntos" />
      <q-tab name="global" icon="bi-box-seam" label="Pedido Global" />
      <q-tab name="historial" icon="bi-calendar-date" label="Historial" />
    </q-tabs>
    <!-- TABS RENDER PAGE -->
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
      <q-tab-panel
        name="puntos"
        class="flex flex-col justify-center items-center"
      >
        <div class="w-full max-w-[400px] max-sm:w-[350px] mx-auto">
          <q-btn
            color="primary"
            label="prueba impresora"
            no-caps
            padding="2px 10px"
            @click="pruebaImpresora"
          />
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
                />
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

      <!-- VER PEDIDO GLOBAL -->
      <q-tab-panel name="global">
        <!-- NEW FORMAT -->
        <q-tabs v-model="tabPuntos" inline-label no-caps dense>
          <q-tab
            class="[&>div>div]:font-bold"
            name="areaGlobal"
            label="Global"
          />
          <q-tab
            class="[&>div>div]:font-bold"
            name="panaderia"
            label="Panaderia"
            @click="obtenerOfertas(estado.panaderia)"
          />
          <q-tab
            class="[&>div>div]:font-bold"
            name="reposteria"
            label="Reposteria"
            @click="obtenerOfertas(estado.reposteria)"
          />
          <q-tab
            class="[&>div>div]:font-bold"
            name="envasados"
            label="Envasados"
            @click="obtenerOfertas(estado.envasados)"
          />
          <q-tab
            class="[&>div>div]:font-bold"
            name="embotellados"
            label="Embotellados"
            @click="obtenerOfertas(estado.embotellados)"
          />
          <q-tab
            class="[&>div>div]:font-bold"
            name="siinple"
            label="Siinple"
            @click="obtenerOfertas(estado.siinple)"
          />
        </q-tabs>

        <q-tab-panels
          v-model="tabPuntos"
          animated
          transition-prev="jump-up"
          transition-next="jump-up"
          class="bg-transparent"
        >
          <q-tab-panel name="areaGlobal" class="!p-2">
            <div>
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
                  v-if="
                    storePedido.pedidosSolicitado.every((pedido) =>
                      pedido.estado.some(
                        (estado) => estado.estado === 'preparado',
                      ),
                    )
                  "
                  @click="aceptarTodosLosPedidosSolicitables"
                />
              </div>
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
                  v-if="
                    storePedido.pedidosDirecto.every((pedido) =>
                      pedido.estado.some(
                        (estado) => estado.estado === 'preparado',
                      ),
                    )
                  "
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
              </TableSimple>
            </div>
          </q-tab-panel>

          <!-- PANADERIA -->
          <q-tab-panel name="panaderia" class="!p-2 flex flex-col gap-4">
            <!-- RUTA 1 -->
            <div class="overflow-x-auto">
              <h1
                class="!text-xs text-center font-extrabold bg-teal-600 text-white"
              >
                RUTA 1
              </h1>
              <table class="min-w-full bg-white rounded-sm overflow-hidden">
                <thead class="bg-teal-700 text-white">
                  <tr>
                    <th class="text-center text-xs uppercase tracking-wider">
                      Entidad
                    </th>
                    <th
                      v-for="(oferta, index) in estado.panaderiaTable"
                      :key="index"
                      class="text-center text-xs tracking-wider"
                    >
                      {{ abreviarNombre(oferta.nombre) }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="(pedido, index) in estado.panaderia"
                    :key="index"
                    v-show="pedido.comprador.ruta == '1'"
                  >
                    <td class="whitespace-nowrap text-center">
                      {{ pedido.comprador.nombre }}
                    </td>
                    <td
                      v-for="(oferta, index) in estado.panaderiaTable"
                      :key="index"
                      class="whitespace-nowrap text-center"
                    >
                      {{ obtenerCantidad(pedido.items, oferta._id) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- RUTA 2 -->
            <div class="overflow-x-auto">
              <h1
                class="!text-xs text-center font-extrabold bg-teal-600 text-white"
              >
                RUTA 2
              </h1>
              <table class="min-w-full bg-white rounded-sm overflow-hidden">
                <thead class="bg-teal-700 text-white">
                  <tr>
                    <th class="text-center text-xs uppercase tracking-wider">
                      Entidad
                    </th>
                    <th
                      v-for="(oferta, index) in estado.panaderiaTable"
                      :key="index"
                      class="text-center text-xs tracking-wider"
                    >
                      {{ abreviarNombre(oferta.nombre) }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="(pedido, index) in estado.panaderia"
                    :key="index"
                    v-show="pedido.comprador.ruta == '2'"
                  >
                    <td class="whitespace-nowrap text-center">
                      {{ pedido.comprador.nombre }}
                    </td>
                    <td
                      v-for="(oferta, index) in estado.panaderiaTable"
                      :key="index"
                      class="whitespace-nowrap text-center"
                    >
                      {{ obtenerCantidad(pedido.items, oferta._id) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </q-tab-panel>

          <!-- REPOSTERIA -->
          <q-tab-panel name="reposteria" class="!p-2">
            <!-- RUTA 1 -->
            <div class="overflow-x-auto">
              <h1
                class="!text-xs text-center font-extrabold bg-teal-600 text-white"
              >
                RUTA 1
              </h1>
              <table class="min-w-full bg-white rounded-sm overflow-hidden">
                <thead class="bg-teal-700 text-white">
                  <tr>
                    <th class="text-center text-xs uppercase tracking-wider">
                      Entidad
                    </th>
                    <th
                      v-for="(oferta, index) in estado.panaderiaTable"
                      :key="index"
                      class="text-center text-xs tracking-wider"
                    >
                      {{ abreviarNombre(oferta.nombre) }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="(pedido, index) in estado.reposteria"
                    :key="index"
                    v-show="pedido.comprador.ruta == '1'"
                  >
                    <td class="whitespace-nowrap text-center">
                      {{ pedido.comprador.nombre }}
                    </td>
                    <td
                      v-for="(oferta, index) in estado.panaderiaTable"
                      :key="index"
                      class="whitespace-nowrap text-center"
                    >
                      {{ obtenerCantidad(pedido.items, oferta._id) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- RUTA 2 -->
            <div class="overflow-x-auto">
              <h1
                class="!text-xs text-center font-extrabold bg-teal-600 text-white"
              >
                RUTA 2
              </h1>
              <table class="min-w-full bg-white rounded-sm overflow-hidden">
                <thead class="bg-teal-700 text-white">
                  <tr>
                    <th class="text-center text-xs uppercase tracking-wider">
                      Entidad
                    </th>
                    <th
                      v-for="(oferta, index) in estado.panaderiaTable"
                      :key="index"
                      class="text-center text-xs tracking-wider"
                    >
                      {{ abreviarNombre(oferta.nombre) }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="(pedido, index) in estado.reposteria"
                    :key="index"
                    v-show="pedido.comprador.ruta == '2'"
                  >
                    <td class="whitespace-nowrap text-center">
                      {{ pedido.comprador.nombre }}
                    </td>
                    <td
                      v-for="(oferta, index) in estado.panaderiaTable"
                      :key="index"
                      class="whitespace-nowrap text-center"
                    >
                      {{ obtenerCantidad(pedido.items, oferta._id) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </q-tab-panel>

          <!-- ENVASADOS -->
          <q-tab-panel name="envasados" class="!p-2">
            <!-- RUTA 1 -->
            <div class="overflow-x-auto">
              <h1
                class="!text-xs text-center font-extrabold bg-teal-600 text-white"
              >
                RUTA 1
              </h1>
              <table class="min-w-full bg-white rounded-sm overflow-hidden">
                <thead class="bg-teal-700 text-white">
                  <tr>
                    <th class="text-center text-xs uppercase tracking-wider">
                      Entidad
                    </th>
                    <th
                      v-for="(oferta, index) in estado.panaderiaTable"
                      :key="index"
                      class="text-center text-xs tracking-wider"
                    >
                      {{ abreviarNombre(oferta.nombre) }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="(pedido, index) in estado.envasados"
                    :key="index"
                    v-show="pedido.comprador.ruta == '1'"
                  >
                    <td class="whitespace-nowrap text-center">
                      {{ pedido.comprador.nombre }}
                    </td>
                    <td
                      v-for="(oferta, index) in estado.panaderiaTable"
                      :key="index"
                      class="whitespace-nowrap text-center"
                    >
                      {{ obtenerCantidad(pedido.items, oferta._id) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- RUTA 2 -->
            <div class="overflow-x-auto">
              <h1
                class="!text-xs text-center font-extrabold bg-teal-600 text-white"
              >
                RUTA 2
              </h1>
              <table class="min-w-full bg-white rounded-sm overflow-hidden">
                <thead class="bg-teal-700 text-white">
                  <tr>
                    <th class="text-center text-xs uppercase tracking-wider">
                      Entidad
                    </th>
                    <th
                      v-for="(oferta, index) in estado.panaderiaTable"
                      :key="index"
                      class="text-center text-xs tracking-wider"
                    >
                      {{ abreviarNombre(oferta.nombre) }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="(pedido, index) in estado.envasados"
                    :key="index"
                    v-show="pedido.comprador.ruta == '2'"
                  >
                    <td class="whitespace-nowrap text-center">
                      {{ pedido.comprador.nombre }}
                    </td>
                    <td
                      v-for="(oferta, index) in estado.panaderiaTable"
                      :key="index"
                      class="whitespace-nowrap text-center"
                    >
                      {{ obtenerCantidad(pedido.items, oferta._id) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </q-tab-panel>

          <!-- EMBOTELLADOS -->
          <q-tab-panel name="embotellados" class="!p-2">
            <!-- RUTA 1 -->
            <div class="overflow-x-auto">
              <h1
                class="!text-xs text-center font-extrabold bg-teal-600 text-white"
              >
                RUTA 1
              </h1>
              <table class="min-w-full bg-white rounded-sm overflow-hidden">
                <thead class="bg-teal-700 text-white">
                  <tr>
                    <th class="text-center text-xs uppercase tracking-wider">
                      Entidad
                    </th>
                    <th
                      v-for="(oferta, index) in estado.panaderiaTable"
                      :key="index"
                      class="text-center text-xs tracking-wider"
                    >
                      {{ abreviarNombre(oferta.nombre) }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="(pedido, index) in estado.embotellados"
                    :key="index"
                    v-show="pedido.comprador.ruta == '1'"
                  >
                    <td class="whitespace-nowrap text-center">
                      {{ pedido.comprador.nombre }}
                    </td>
                    <td
                      v-for="(oferta, index) in estado.panaderiaTable"
                      :key="index"
                      class="whitespace-nowrap text-center"
                    >
                      {{ obtenerCantidad(pedido.items, oferta._id) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- RUTA 2 -->
            <div class="overflow-x-auto">
              <h1
                class="!text-xs text-center font-extrabold bg-teal-600 text-white"
              >
                RUTA 2
              </h1>
              <table class="min-w-full bg-white rounded-sm overflow-hidden">
                <thead class="bg-teal-700 text-white">
                  <tr>
                    <th class="text-center text-xs uppercase tracking-wider">
                      Entidad
                    </th>
                    <th
                      v-for="(oferta, index) in estado.panaderiaTable"
                      :key="index"
                      class="text-center text-xs tracking-wider"
                    >
                      {{ abreviarNombre(oferta.nombre) }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="(pedido, index) in estado.embotellados"
                    :key="index"
                    v-show="pedido.comprador.ruta == '2'"
                  >
                    <td class="whitespace-nowrap text-center">
                      {{ pedido.comprador.nombre }}
                    </td>
                    <td
                      v-for="(oferta, index) in estado.panaderiaTable"
                      :key="index"
                      class="whitespace-nowrap text-center"
                    >
                      {{ obtenerCantidad(pedido.items, oferta._id) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </q-tab-panel>

          <!-- SIINPLE -->
          <q-tab-panel name="siinple" class="!p-2">
            <!-- RUTA 1 -->
            <div class="overflow-x-auto">
              <h1
                class="!text-xs text-center font-extrabold bg-teal-600 text-white"
              >
                RUTA 1
              </h1>
              <table class="min-w-full bg-white rounded-sm overflow-hidden">
                <thead class="bg-teal-700 text-white">
                  <tr>
                    <th class="text-center text-xs uppercase tracking-wider">
                      Entidad
                    </th>
                    <th
                      v-for="(oferta, index) in estado.panaderiaTable"
                      :key="index"
                      class="text-center text-xs tracking-wider"
                    >
                      {{ abreviarNombre(oferta.nombre) }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="(pedido, index) in estado.siinple"
                    :key="index"
                    v-show="pedido.comprador.ruta == '1'"
                  >
                    <td class="whitespace-nowrap text-center">
                      {{ pedido.comprador.nombre }}
                    </td>
                    <td
                      v-for="(oferta, index) in estado.panaderiaTable"
                      :key="index"
                      class="whitespace-nowrap text-center"
                    >
                      {{ obtenerCantidad(pedido.items, oferta._id) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- RUTA 2 -->
            <div class="overflow-x-auto">
              <h1
                class="!text-xs text-center font-extrabold bg-teal-600 text-white"
              >
                RUTA 2
              </h1>
              <table class="min-w-full bg-white rounded-sm overflow-hidden">
                <thead class="bg-teal-700 text-white">
                  <tr>
                    <th class="text-center text-xs uppercase tracking-wider">
                      Entidad
                    </th>
                    <th
                      v-for="(oferta, index) in estado.panaderiaTable"
                      :key="index"
                      class="text-center text-xs tracking-wider"
                    >
                      {{ abreviarNombre(oferta.nombre) }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="(pedido, index) in estado.siinple"
                    :key="index"
                    v-show="pedido.comprador.ruta == '2'"
                  >
                    <td class="whitespace-nowrap text-center">
                      {{ pedido.comprador.nombre }}
                    </td>
                    <td
                      v-for="(oferta, index) in estado.panaderiaTable"
                      :key="index"
                      class="whitespace-nowrap text-center"
                    >
                      {{ obtenerCantidad(pedido.items, oferta._id) }}
                    </td>
                  </tr>
                </tbody>
              </table>
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
    <div id="divParaImprimir" v-if="pedidoSeleccionado" class="w-[283px]">
      <div style="text-align: center">
        <!-- <NuxtImg src="/logo.png" alt="logoSiipi" width="100" height="50" /> -->
        <NuxtImg
          id="logoParaImprimir"
          src="/logo.png"
          alt="logoSiipi"
          width="100"
          height="50"
        />
        <!-- <img src="/logo.png" alt="logoSiipi" width="100" height="50" /> -->
      </div>

      <div
        style="
          font-family: 'Nunito Sans', sans-serif;
          line-height: 1.2;
          margin: 10px 0;
          font-size: 12px;
        "
      >
        <p>Origen: {{ pedidoSeleccionado.comprador.nombre }}</p>
        <p>Destino: {{ pedidoSeleccionado.vendedor.nombre }}</p>
        <p>
          Responsable: {{ pedidoSeleccionado.estado[0].persona.nombre }}
          {{ pedidoSeleccionado.estado[0].persona.apellido }}
        </p>
        <p>Fecha: {{ formateadorFecha(pedidoSeleccionado.estado[0].fecha) }}</p>
      </div>
      <p style="text-align: center">
        ------------------------------------------
      </p>
      <table>
        <tbody>
          <tr
            v-for="item in pedidoSeleccionado.items"
            :key="item._id"
            style="font-size: 12px"
          >
            <td>{{ item.oferta.nombre }}</td>
            <td>{{ item.cantidad }}</td>
          </tr>
        </tbody>
      </table>
      <br />
    </div>

    <div id="printableArea" v-show="printing">
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit officia
        libero deserunt! Laboriosam amet mollitia rem eligendi quo minus
        doloribus delectus veritatis at corporis aliquam, optio odio nemo
        maiores ipsa. Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        Illo ad, voluptatum rem quae aliquam tenetur sit dolores cumque ab
        quaerat! Vel esse suscipit sint sed veniam repudiandae quaerat.
        Blanditiis, laboriosam.
      </p>
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
import { ref, onMounted, watch, nextTick } from 'vue';
import { aceptados, porAceptar } from '@/mocks/puntos.json';
import { usePedido } from '@/composables/punto/usePedido';
import { pedidoGlobal } from '~/helpers/columns';
import { formateadorFecha } from '@/helpers/fecha';
import Logo from '@/assets/img/logo.png';

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
  obtenerOfertas,
  obtenerCantidad,
} = usePedido();

const tab = ref('puntos');
const tabPuntos = ref('areaGlobal');
const date = ref(new Date().toLocaleDateString('en-CA').replace(/-/g, '/'));
const pedidoSeleccionado = ref(null);
const printing = ref(false);

const imprimir = (pedido) => {
  pedidoSeleccionado.value = pedido;

  const img = new Image();
  img.src = '/logo.png';
  img.onload = () => {
    setTimeout(() => {
      const divParaImprimir = document.getElementById('divParaImprimir');
      const ventanaImpresion = window.open('', '_blank');

      ventanaImpresion.document.write(
        "<style> body { font-family: 'Nunito Sans', sans-serif; font-size: 10px; padding: 0px; } p{ padding: 0; margin: 0;}</style>",
      );

      ventanaImpresion.document.write(divParaImprimir.outerHTML);
      console.log(ventanaImpresion.document);
      ventanaImpresion.document.close();
      ventanaImpresion.print();
      ventanaImpresion.close();
    }, 200);
  };
};
const dateOption = (date) => {
  // console.log(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(date) <= today;
};

const abreviarNombre = (nombre) => {
  let palabras = nombre.split(' ');
  let abreviatura = palabras[0].slice(0, 3).toLowerCase();
  if (palabras.length > 1) {
    abreviatura += palabras
      .slice(1)
      .map((palabra) => palabra[0].toUpperCase())
      .join('');
  }
  let contenidoParentesis = nombre.match(/\((.*?)\)/)[1][0].toUpperCase();
  console.log(abreviatura, contenidoParentesis);

  return `${abreviatura}${contenidoParentesis})`;
};

const pruebaImpresora = async () => {
  printing.value = true;
  await nextTick();

  const printableArea = document.getElementById('printableArea');
  const ventanaImpresion = window.open('', '_blank');
  ventanaImpresion.document.write(printableArea.outerHTML);
  ventanaImpresion.document.title = 'Mi título de impresión'; // Agrega esta línea
  ventanaImpresion.document.close();
  ventanaImpresion.print();
  ventanaImpresion.close();
  printing.value = false;
};

watch(date, (value) => {
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
  // body {
  //   // width: 80mm; /* Ajusta el ancho según las especificaciones de tu impresora térmica */
  //   // font-size: 12px; /* Ajusta el tamaño de fuente según tus necesidades */
  //   visibility: hidden;
  // }

  // #printableArea,
  // #printableArea * {
  //   visibility: visible;
  // }
  // #printableArea {
  //   /* Aquí puedes agregar los estilos específicos para el div que quieres imprimir */
  //   // position: absolute;
  //   left: 0;
  //   top: 0;
  //   font-size: 10px;
  //   line-height: 1.2;
  //   text-align: justify;
  // }

  /* Oculta todos los elementos que no quieres imprimir */
  // .no-print,
  // .no-print * {
  //   display: none !important;
  // }
}
</style>
