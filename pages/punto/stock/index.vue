<template>
  <div>
    <Navigation label="Stock" icon="folder" />
    <Table
      badge
      :rows="
        estado.modal.isShowAlertProduct
          ? estado.productosEnAlerta
          : estado.stocks
      "
      :columns="stockProducts"
      dense
    >
      <!-- DROPDOW -->
      <template #dropdown>
        <q-btn
          color="green"
          label="Descargar .PDF"
          outline
          icon="bi-filetype-pdf"
        />
        <div class="ml-3">
          <span class="flex gap-1"
            >{{ estado.productosEnAlerta.length }} con stock en
            <p
              class="text-orange-500 cursor-pointer"
              @click="
                estado.modal.isShowAlertProduct =
                  !estado.modal.isShowAlertProduct
              "
            >
              Alerta
            </p>
          </span>
          <span class="flex gap-1"
            >0 con stock en
            <p class="text-red-500 cursor-pointer">Agotado</p>
          </span>
        </div>
      </template>
      <!-- BADGE -->
      <template #rows-badge="{ props }">
        <q-tr
          :props="props"
          :style="
            (props.row.cantidad === 0 && 'background-color: red !important') ||
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
          <q-td key="presentaciones" :props="props">
            {{ props.row.presentaciones[0].nombre }}
            {{ props.row.presentaciones[0].cantidad }} ...
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
            {{ formatearFecha(props.row.lotes[0].vencimiento) }}.
            <strong>Bloque:</strong> {{ props.row.lotes[0].bloque }}.
            <strong>Cantidad:</strong>{{ props.row.lotes[0].cantidad }} ...
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
                      {{ formatDate(lote.vencimiento) }}
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
              outline
              icon="add"
              color="primary"
              dense
              @click="agregarListaInventario(props.row)"
            >
              <q-tooltip class="bg-blue-500">Añadir a inventario</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </Table>
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

const {
  estado,
  formatearFecha,
  modalEditarCantidad,
  guardarCantidad,
  agregarListaInventario,
} = useStock();
</script>

<style scoped>
.cell-image {
  width: 50px;
  height: 50px;
  border-radius: 100%;
}
</style>
