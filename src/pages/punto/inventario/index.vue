<template>
  <div>
    <Navigation label="Inventario" icon="folder" />
    <!-- <q-btn color="primary" icon="check" label="OK" @click="test" /> -->
    <!-- <code>{{ estado.productoElegido }}</code> -->
    <div class="grid grid-cols-[auto,1fr,1fr]">
      <div class="w-[270px]">
        <h1 class="font-bold">Lista de productos vencidos</h1>
        <q-list class="h-[60vh] border-2 overflow-y-scroll">
          <q-item
            clickable
            dense
            v-for="(item, index) in useProduct.ListInventario"
            :key="item.id"
            class="flex items-center"
            @click="elegirProductoInventario(item)"
          >
            <span class="flex gap-2">
              <h1>{{ index >= 0 && index + 1 }}</h1>
              <h1>{{ item.nombre }}</h1>
            </span>
          </q-item>
        </q-list>
      </div>
      <div class="flex justify-center items-start h-[62svh] overflow-y-scroll">
        <!-- {{ useProduct.ListInventario }} -->
        <span class="w-full flex justify-center"
          ><h1 class="bg-green-500 text-white px-[10px] rounded-md">
            {{ estado.countInventary }} realizados
          </h1></span
        >

        <q-form
          class="shadow-md w-[320px] p-4 flex flex-col gap-3"
          v-if="estado.productoElegido"
        >
          <h1 class="text-center font-semibold">
            Inventario
            <!-- {{ useProduct.ListInventario[estado.currentIndex].producto.nombre }} -->
            {{ estado.productoElegido && estado.productoElegido.nombre }}
          </h1>
          <!-- PROBANDOOOO -->
          <div v-for="(lote, index) in estado.inventario.lotes" :key="index">
            <span class="flex justify-between items-center">
              <h1 class="font-bold">FILA {{ index >= 0 && index + 1 }}</h1>
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
            padding="1px 10px"
            no-caps
            size="13px"
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
              size="13px"
              padding="1px 12px"
              @click="showComment = !showComment"
            /><q-btn
              label="Terminar"
              color="primary"
              size="13px"
              dense
              no-caps
              padding="1px 12px"
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
        <div v-else class="flex items-center">
          <h1 class="text-red-500">Selecciona un producta de la lista😒.</h1>
        </div>
        <p v-if="useProduct.ListInventario.length === 0" class="text-lg">
          No tienes inventario por hacer 😉.
        </p>
      </div>
      <div id="divParaImprimir" class="p-3 shadow-lg bg-gray-200">
        <h1 class="font-bold text-center">INVENTARIO DEL DIA</h1>
        <div
          v-if="useProduct.ListInventarioPDF.length > 0"
          class="grid grid-cols-3 p-4 gap-3"
        >
          <div
            v-for="inventario in useProduct.ListInventarioPDF"
            :key="inventario.producto"
          >
            <h1 class="font-semibold">{{ inventario.producto }}</h1>
            <p>{{ inventario.presentacion.nombre }}</p>
            <span v-for="lote in inventario.lotes" :key="lote.length">
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
definePageMeta({
  layout: 'punto',
});
const {
  estado,
  useProduct,
  agregarFila,
  printInventory,
  terminarInventario,
  elegirProductoInventario,
} = useInventary();
</script>
<style lang="scss">
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
