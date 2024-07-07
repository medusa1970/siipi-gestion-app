<template>
  <div>
    <Navigation label="Inventario" icon="folder" />
    <TableExpand :rows="estado.productosBloquesNull" ::columns="stockProducts">
      <template #slot-footer>
        <div class="flex justify-center gap-2">
          <q-btn no-caps padding="0 10px" size="13px" dense color="primary" />
          <q-btn no-caps padding="0 10px" size="13px" dense color="orange" />
          <q-btn no-caps padding="0 10px" size="13px" dense color="green" />
        </div>
      </template>
      <template #body-data="{ props }">
        <div class="col-span-1">
          <q-list class="shadow-1">
            <q-expansion-item
              switch-toggle-side
              expand-separator
              group="somegroup"
              class="w-expansion [&>div>div>div>i]:bg-orange-400 [&>div>div>div>i]:rounded-full [&>div>div>div>i]:text-white max-sm:[&>div>div]:!grid-cols-[0px_40px_1fr]"
              @click="limpiarInputs"
            >
              <template v-slot:header>
                <div class="flex items-center justify-center">
                  <!-- uppercase font-bold line-clamp-1 -->
                  <div class="flex flex-col items-center">
                    <p class="font-bold">
                      {{ props.row.nombre }}
                    </p>
                    <p class="text-[13px]">
                      ({{ props.row.presentacionBasica }})
                    </p>
                  </div>
                </div>
                <!-- <q-item-section side class="h-[50px]">
                  <img
                    v-if="props.row.foto"
                    :src="props.row.foto"
                    class="h-full w-full object-cover"
                    alt=""
                  />
                </q-item-section> -->
              </template>
              <q-card class="pb-3 flex justify-center col-span-3">
                <q-form
                  class="py-2 px-4 flex flex-col gap-3"
                  @submit="terminarInventario(props.row)"
                >
                  <div
                    v-for="(lote, index) in estado.inventario.lotes"
                    :key="index"
                  >
                    <span class="flex justify-between items-center">
                      <h1 class="font-bold">
                        FILA {{ index >= 0 && index + 1 }}
                      </h1>
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
                      mask="date"
                      outlined
                      dense
                      class="mb-[13px]"
                      clearable
                    />
                    <div class="w-full grid grid-cols-2 gap-3">
                      <q-input
                        v-model.number="lote.cantidad"
                        type="number"
                        label="Cantidad"
                        outlined
                        dense
                        clearable
                        required
                      />
                      <q-input
                        v-model="lote.bloque.nombre"
                        type="text"
                        label="Bloque"
                        outlined
                        dense
                        clearable
                        required
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
                  <span class="flex justify-end">
                    <q-btn
                      type="submit"
                      label="Terminar"
                      color="primary"
                      size="13px"
                      dense
                      no-caps
                      padding="1px 12px"
                      class="px-3"
                    />
                  </span>
                </q-form>
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>
      </template>
    </TableExpand>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'cathering',
});

// imports y inicializaciones
import { useInventario } from './inventario.composable';
import { useAlmacen } from '@/modulos/almacen/negocio/almacen.composable';
const almacen = useAlmacen();
const { estado, store, service, obtenerProductosInventariar } = useInventario();

// Reactives y inicializaciones
onMounted(() => {
  obtenerProductosInventariar();
});
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

// .w-expansion > div > div {
//   @apply max-sm:grid-cols-[0px_40px_1fr];
// }
</style>
