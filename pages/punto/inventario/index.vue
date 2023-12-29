<template>
  <div>
    <Navigation label="Inventario" icon="folder" />
    <div class="grid grid-cols-2">
      <div class="flex justify-center items-start">
        <q-form
          class="shadow-md w-[340px] p-4 flex flex-col gap-3"
          v-if="useProduct.ListInventario.length > 0"
        >
          <h1 class="text-center font-semibold text-lg">
            Inventario
            {{ useProduct.ListInventario[estado.currentIndex].producto.nombre }}
          </h1>
          <!-- PROBANDOOOO -->
          <div v-for="(lote, index) in estado.inventario.lotes">
            <span class="flex justify-between items-center">
              <h1 class="font-bold">FILA {{ index }}</h1>
              <q-btn
                icon="delete"
                color="red"
                dense
                flat
                round
                size="13px"
                @click="estado.inventario.lotes.splice(index, 1)"
              />
            </span>
            <q-input
              v-model="lote.vencimiento"
              type="date"
              label="Vencimiento"
              outlined
              dense
              class="mb-[13px]"
            />
            <div class="w-full grid grid-cols-2 gap-3">
              <q-input
                v-model.number="lote.cantidad"
                type="number"
                label="Cantidad"
                outlined
                dense
              />
              <q-input
                v-model="lote.bloque"
                type="text"
                label="Bloque"
                outlined
                dense
              />
            </div>
          </div>
          <q-btn
            color="secondary"
            label="Agregar fila"
            @click="agregarFila()"
            dense
            no-caps
          />
          <!-- FIIIIN -->
          <span class="flex justify-end">
            <q-btn
              label="Comentario"
              color="primary"
              dense
              no-caps
              class="px-3"
              flat
              @click="showComment = !showComment"
            /><q-btn
              label="Terminar"
              color="primary"
              dense
              no-caps
              class="px-3"
              @click="terminarInventario()"
            />
          </span>
          <q-input
            v-if="showComment"
            v-model="inventario.comentario"
            type="textarea"
            label="Inserte un Comentario"
            outlined
            dense
          />
        </q-form>
        <p v-if="useProduct.ListInventario.length === 0" class="text-lg">
          No tienes inventario por hacer 😉.
        </p>
      </div>
      <div id="divParaImprimir" class="p-3 shadow-lg">
        <h1 class="font-bold text-lg text-center">INVENTARIO DEL DIA</h1>
        <div
          v-if="useProduct.ListInventarioPDF.length > 0"
          class="grid grid-cols-3 p-4 gap-3"
        >
          <div v-for="inventario in useProduct.ListInventarioPDF">
            <h1 class="font-semibold">{{ inventario.producto }}</h1>
            <p>{{ inventario.presentacion.nombre }}</p>
            <span v-for="lote in inventario.lotes">
              <p><q-badge>FechaVec:</q-badge> {{ lote.vencimiento }}</p>
              <p>
                <q-badge color="green">Cantidad:</q-badge>
                {{ lote.cantidad }} Unidades
              </p>
              <p><q-badge color="brown">Bloque:</q-badge> {{ lote.bloque }}</p>
              <hr class="border-gray-500 my-1" />
            </span>
          </div>
        </div>
        <p v-if="useProduct.ListInventarioPDF.length === 0">
          No hay lista para imprimir
        </p>
        <span id="action" class="flex justify-end gap-3">
          <q-btn
            label="Imprimir"
            color="secondary"
            dense
            no-caps
            class="px-3"
            @click.prevent="printInventory"
          />
          <q-btn
            label="Terminar"
            color="primary"
            dense
            no-caps
            class="px-3"
            @click="() => (useProduct.ListInventarioPDF = [])"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useInventary } from '@/composables/punto/useInventary';

const { estado, useProduct, agregarFila, printInventory, terminarInventario } =
  useInventary();
</script>
<style>
@media print {
  body * {
    visibility: hidden;
  }
  #divParaImprimir,
  #divParaImprimir * {
    visibility: visible;
    #action {
      display: none;
    }
  }
  #divParaImprimir {
    position: absolute;
    left: 0;
    top: 10px;
  }
}
</style>
