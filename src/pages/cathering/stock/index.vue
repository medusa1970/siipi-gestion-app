<template>
  <div>
    <Navigation label="Stock" icon="folder" />
    <!-- <code>{{ estado.ListaOfertasPedido }}</code> -->
    <Table2 badge :rows="rowsParaMostrar" :columns="stockProducts" dense>
      <!-- <template #slot-header1>
        <NuxtLink href="/cathering/pedidos/recibirPedido">
          <q-btn
            color="primary"
            label="Recibir productos"
            no-caps
            dense
            padding="7px 15px"
          />
        </NuxtLink>
      </template>
      <template #slot-header2>
        <NuxtLink href="/cathering/inventario">
          <q-btn
            color="primary"
            label="Realizar inventario"
            no-caps
            dense
            padding="7px 15px"
          />
        </NuxtLink>
      </template> -->
      <template #slot-footer>
        <div class="flex justify-center gap-2">
          <q-btn
            no-caps
            padding="0 10px"
            size="13px"
            dense
            color="green"
            :label="`${estado.stocks.length} Productos total`"
            @click="toggleModal('isShowAllProducts')"
          />
          <q-btn
            no-caps
            padding="0 10px"
            size="13px"
            dense
            color="orange"
            :label="`${estado.productosEnAlerta.length} Productos en alerta`"
            @click="toggleModal('isShowAlertProduct')"
          />
          <q-btn
            no-caps
            padding="0 10px"
            size="13px"
            dense
            color="primary"
            :label="`${estado.productosVencidos.length} Productos por vencer`"
            @click="toggleModal('isShowVencidos')"
          />
        </div>
      </template>
      <!-- TABLA CON BADGE -->
      <template #rows-badge="{ props }">
        <q-tr
          :props="props"
          :style="
            (props.row.cantidad === 0 &&
              'background-color: #FFA08A !important') ||
            props.row.alertStyle
          "
        >
          <q-td key="foto" :props="props" class="w-[83px]">
            <q-img
              :src="props.row.foto"
              spinner-color="black"
              class="cell-image"
            />
          </q-td>
          <q-td key="producto" :props="props">
            {{ props.row.producto.nombre }}
          </q-td>
          <q-td key="presentacionBasica" :props="props">
            {{ props.row.producto.presentacionBasica }}
          </q-td>
          <q-td
            key="presentaciones"
            :props="props"
            :class="props.row.presentaciones.length === 0 && 'text-red-500'"
          >
            {{
              props.row.presentaciones.length === 0 ? 'Sin presentaciones' : ''
            }}
            {{
              props.row.presentaciones[0] && props.row.presentaciones[0].nombre
            }}
            {{
              props.row.presentaciones[0] &&
              props.row.presentaciones[0].cantidad
            }}
            ...
            <q-popup-edit
              v-model="props.row.presentaciones"
              anchor="bottom end"
              self="bottom end"
              class="flex flex-col gap-[2px] border-[1px]"
            >
              <h1 class="font-bold">Presentaciones:</h1>
              <div
                v-for="presentacion in props.row.presentaciones"
                :key="presentacion.nombre"
              >
                <q-badge color="red" class="capitalize">
                  {{ presentacion.nombre }}: {{ presentacion.cantidad }}
                </q-badge>
              </div>
            </q-popup-edit>
          </q-td>
          <q-td key="lotes" :props="props">
            <p>{{ props.row.lotes.length }} lote</p>
            <q-popup-edit
              v-model="props.row.lotes"
              anchor="bottom end"
              self="bottom end"
              class="flex flex-col gap-[3px]"
            >
              <h1 class="font-bold">Lotes:</h1>
              <div class="grid grid-cols-2 gap-3">
                <div v-for="lote in props.row.lotes" :key="lote.nombre">
                  <span class="flex gap-2 leading-none">
                    <p>Vencimiento:</p>
                    <q-badge color="red" class="capitalize">
                      {{
                        lote.vencimiento === null
                          ? 'Sin fecha'
                          : formatearFecha(lote.vencimiento)
                      }}
                    </q-badge>
                  </span>
                  <span class="flex gap-2">
                    <p>Bloque:</p>
                    <q-badge color="green" class="capitalize">
                      {{ lote.bloque }}
                    </q-badge> </span
                  ><span class="flex gap-2">
                    <p>Cantidad:</p>
                    <q-badge color="orange" class="capitalize">
                      {{ lote.cantidad }}
                    </q-badge>
                  </span>
                </div>
              </div>
            </q-popup-edit>
          </q-td>
          <q-td key="cantidad" :props="props">
            <q-badge color="green" class="capitalize">
              {{ props.row.cantidad }} Unidades
            </q-badge>
          </q-td>
          <q-td key="cantidadMinima" :props="props">
            <q-badge
              color="green"
              class="capitalize"
              @click="modalEditarCantidad(props.row)"
            >
              {{ props.row.cantidadMinima }} Unidades
            </q-badge>
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              flat
              round
              padding="1px"
              icon="add"
              color="primary"
              dense
              size="13px"
              @click="agregarListaInventario(props.row)"
            >
              <q-tooltip class="bg-blue-500">Añadir a inventario</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              icon="content_paste"
              color="primary"
              dense
              size="10px"
            >
              <q-tooltip class="bg-blue-500">Mandar papelera</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </Table2>
    <!-- TABLEEXPANDED -->
    <!-- <TableExpand :rows="rowsParaMostrar" ::columns="stockProducts">
      <template #slot-header1>
        <NuxtLink href="/cathering/pedidos/recibirPedido">
          <q-btn
            color="primary"
            label="Recibir productos"
            no-caps
            dense
            padding="7px 15px"
          />
        </NuxtLink>
      </template>
      <template #slot-header2>
        <NuxtLink href="/cathering/inventario">
          <q-btn
            color="primary"
            label="Realizar inventario"
            no-caps
            dense
            padding="7px 15px"
          />
        </NuxtLink>
      </template>
      <template #slot-footer>
        <div class="flex justify-center gap-2">
          <q-btn
            no-caps
            padding="0 10px"
            size="13px"
            dense
            color="green"
            :label="`${estado.stocks.length} Productos total`"
            @click="toggleModal('isShowAllProducts')"
          />
          <q-btn
            no-caps
            padding="0 10px"
            size="13px"
            dense
            color="orange"
            :label="`${estado.productosEnAlerta.length} Productos en alerta`"
            @click="toggleModal('isShowAlertProduct')"
          />
          <q-btn
            no-caps
            padding="0 10px"
            size="13px"
            dense
            color="primary"
            :label="`${estado.productosVencidos.length} Productos por vencer`"
            @click="toggleModal('isShowVencidos')"
          />
        </div>
      </template>
      <template #body-data="{ props }">
        <div class="col-span-1">
          <q-list
            :class="[
              'shadow-1',
              estado.modal.isShowAlertProduct && 'bg-orange-100',
              estado.modal.isShowVencidos && 'bg-blue-100',
              estado.modal.isShowAllProducts && 'bg-green-100',
            ]"
          >
            <q-expansion-item
              switch-toggle-side
              expand-separator
              group="somegroup"
              class="w-expansion [&>div>div>div>i]:bg-orange-400 [&>div>div>div>i]:rounded-full [&>div>div>div>i]:text-white"
            >
              <template v-slot:header>
                <div class="flex items-center justify-center">
                  
                  <p class="font-bold">
                    {{ props.row.nombreProducto }}
                  </p>
                </div>
                <q-item-section side class="h-[50px]">
                  <img
                    :src="props.row.foto"
                    class="h-full w-full object-cover"
                    alt=""
                  />
                </q-item-section>
              </template>
              <q-card class="pb-3 flex justify-center col-span-3">
                <div
                  class="flex flex-col [&>span]:flex [&>span>h1]:w-[105px] [&>span>h1]:font-bold"
                >
                  <span>
                    <h1>Presentaciones</h1>
                    <div
                      :class="[
                        props.row.presentaciones.length === 0 && 'text-red-500',
                        'cursor-pointer',
                      ]"
                    >
                      <q-badge
                        color="green"
                        :label="props.row.presentaciones.length"
                      />

                      <q-popup-edit
                        v-model="props.row.presentaciones"
                        anchor="bottom end"
                        self="bottom end"
                        class="flex flex-col gap-[2px] border-[1px]"
                      >
                        <h1 class="font-bold">Presentaciones:</h1>
                        <div
                          v-for="presentacion in props.row.presentaciones"
                          :key="presentacion.nombre"
                        >
                          <q-badge color="red" class="capitalize">
                            {{ presentacion.nombre }}:
                            {{ presentacion.cantidad }}
                          </q-badge>
                        </div>
                      </q-popup-edit>
                    </div>
                  </span>
                  <span>
                    <h1>Lotes</h1>
                    <div class="cursor-pointer">
                      <q-badge color="green" :label="props.row.lotes.length" />
                      
                      <q-popup-edit
                        v-model="props.row.lotes"
                        anchor="bottom end"
                        self="bottom end"
                        class="flex flex-col gap-[3px]"
                      >
                        <h1 class="font-bold">Lotes:</h1>
                        <div class="grid grid-cols-2 gap-3">
                          <div
                            v-for="lote in props.row.lotes"
                            :key="lote.nombre"
                          >
                            <span class="flex gap-2 leading-none">
                              <p>Vencimiento:</p>
                              <q-badge color="red" class="capitalize">
                                {{ formatearFecha(lote.vencimiento) }}
                              </q-badge>
                            </span>
                            <span class="flex gap-2">
                              <p>Bloque:</p>
                              <q-badge color="green" class="capitalize">
                                {{ lote.bloque }}
                              </q-badge> </span
                            ><span class="flex gap-2">
                              <p>Cantidad:</p>
                              <q-badge color="orange" class="capitalize">
                                {{ lote.cantidad }}
                              </q-badge>
                            </span>
                          </div>
                        </div>
                      </q-popup-edit>
                    </div>
                  </span>
                  <span>
                    <h1>Cantidad Min.</h1>
                    <div>
                      <q-badge
                        color="green"
                        class="capitalize cursor-pointer"
                        @click="modalEditarCantidad(props.row)"
                      >
                        {{ props.row.cantidadMinima }} Unidades
                      </q-badge>
                    </div>
                  </span>
                  <span>
                    <h1>Cantidad</h1>
                    <p>{{ props.row.cantidad }} Unidades</p>
                  </span>

                  <span>
                    <h1>Accion</h1>
                    <span class="flex gap-1">
                      <q-btn
                        padding="4px"
                        size="9px"
                        icon="add"
                        color="primary"
                        dense
                        @click="agregarListaInventario(props.row)"
                      >
                        <q-tooltip class="bg-blue-500"
                          >Añadir a inventario</q-tooltip
                        >
                      </q-btn>
                      <q-btn
                        icon="content_paste"
                        color="orange"
                        dense
                        padding="4px"
                        size="9px"
                      >
                        <q-tooltip class="bg-blue-500"
                          >Mandar papelera</q-tooltip
                        >
                      </q-btn>
                    </span>
                  </span>
                </div>
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>
      </template>
    </TableExpand> -->
  </div>

  <!-- DIALOG -->
  <Dialog
    v-model="estado.modal.isShowCantidad"
    title="Actualizar cantidad minima"
    :handle-submit="guardarCantidad"
  >
    <template #inputsDialog>
      <q-input
        v-model.number="estado.producto.cantidadMinima"
        type="text"
        label="Cantidad Minima"
        dense
      />
    </template>
  </Dialog>
</template>

<script setup>
import { stockProducts } from '@/helpers/columns';
import { useStock } from '@/composables/punto/useStock';
import { ref, onMounted, computed } from 'vue';
definePageMeta({
  layout: 'cathering',
});

const {
  estado,
  formatearFecha,
  modalEditarCantidad,
  guardarCantidad,
  agregarListaInventario,
  obtenerTodoStock,
} = useStock();

// const { handleInputChange2 } = usePedido();
const toggleModal = (key) => {
  estado.modal[key] = !estado.modal[key];
  Object.keys(estado.modal).forEach((modalKey) => {
    if (modalKey !== key) {
      estado.modal[modalKey] = false;
    }
  });
};

const rowsParaMostrar = computed(() => {
  if (estado.modal.isShowAlertProduct) {
    return estado.productosEnAlerta;
  } else if (estado.modal.isShowVencidos) {
    return estado.productosVencidos;
  } else if (estado.modal.isShowAllProducts) {
    return estado.stocks;
  } else {
    return estado.stocks;
  }
});

onMounted(() => {
  obtenerTodoStock();
});

// console.log(estado.stocks)
</script>

<style scoped>
.cell-image {
  width: 50px;
  height: 50px;
  border-radius: 100%;
}
</style>
