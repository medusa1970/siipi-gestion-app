<template>
  <div>
    <Navigation label="Inventario" icon="folder" />
    <TableExpand :rows="estado.productosBloquesNull" ::columns="stockProducts">
      <!-- <template #slot-header1>
        <q-btn
          color="primary"
          label="Ver stock"
          no-caps
          dense
          padding="7px 15px"
        />
      </template> -->
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
              class="w-expansion [&>div>div>div>i]:bg-orange-400 [&>div>div>div>i]:rounded-full [&>div>div>div>i]:text-white"
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
                <q-item-section side class="h-[50px]">
                  <!-- <h1>sds</h1> -->
                  <img
                    v-if="props.row.foto"
                    :src="props.row.foto"
                    class="h-full w-full object-cover"
                    alt=""
                  />
                </q-item-section>
              </template>
              <q-card class="pb-3 flex justify-center col-span-3">
                <q-form
                  class="shadow-md py-2 px-4 flex flex-col gap-3"
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
                      />
                      <q-input
                        v-model="lote.bloque"
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

                  <!-- <span class="flex justify-end">
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
                    />
                    <q-btn
                      label="Terminar"
                      color="primary"
                      size="13px"
                      dense
                      no-caps
                      padding="1px 12px"
                      class="px-3"
                      @click="terminarInventario(props.row)"
                    />
                  </span> -->
                  <!-- <q-input
                    v-if="showComment"
                    v-model="inventario.comentario"
                    type="textarea"
                    label="Inserte un Comentario"
                    outlined
                    dense
                  /> -->
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
import { useInventary } from '@/composables/punto/useInventary';
// import { useStock } from '@/composables/punto/useStock';
import { onMounted, reactive } from 'vue';
import { stockService } from '~/services/punto/stock.service';
import { authStore } from '@/stores/auth.store';
import { inventarioService } from '~/services/punto/inventary.service';
import {
  NotifyError,
  NotifySucess,
  hideLoading,
  showLoading,
} from '~/helpers/message.service';

definePageMeta({
  layout: 'cathering',
});
const { useProduct, printInventory, elegirProductoInventario } = useInventary();

const useAuth = authStore();

const estado = reactive({
  productosBloquesNull: [],
  inventario: {
    producto: '',
    lotes: [
      {
        vencimiento: '',
        cantidad: '',
        bloque: '',
      },
    ],
    presentacion: '',
  },
  countRetry: 0,
});

// const obtenerTodoStock = async () => {
//   const { entidadBuscar } = await stockService.obtenerTodoStock(
//     useAuth.negocioElegido._id,
//   );

//   estado.productosBloquesNull = entidadBuscar[0].almacen.filter((producto) => {
//     const primerLote = producto.lotes[0];
//     return primerLote ? primerLote.bloque === null : true; // Si no hay lote, considerarlo como válido
//   });
// };
const obtenerProductosInventariar = async () => {
  const { filaInventario } = await inventarioService.filaInventario(
    useAuth.negocioElegido._id,
  );
  estado.productosBloquesNull = filaInventario;
  console.log(filaInventario);
};

const agregarFila = () => {
  estado.inventario.lotes.push({
    vencimiento: '',
    cantidad: '',
    bloque: '',
  });
};

const terminarInventario = async (producto) => {
  estado.inventario.lotes.forEach((lote) => {
    if (lote.vencimiento === '') lote.vencimiento = null;
  });

  /**LOGICA */
  inventarioService
    .realizarInventarioFalse(
      useAuth.negocioElegido._id, //@ts-ignore
      producto._id,
      estado.inventario.lotes,
    )
    .then((res) => {
      if (res.entidadHacerInventario.diferencias?.length > 0) {
        estado.countRetry++;
        if (estado.countRetry > 1) {
          inventarioService
            .realizarInventarioTrue(
              useAuth.negocioElegido._id, //@ts-ignore
              producto._id,
              estado.inventario.lotes,
            )
            .then(() => {
              NotifySucess('Inventario guardado');
              estado.productosBloquesNull = estado.productosBloquesNull.filter(
                //@ts-ignore
                (item) => item._id !== producto._id,
              );
              limpiarInputs();
            })
            .finally(() => {
              hideLoading();
            });
        } else {
          NotifyError('Hay diferencias, vuelva a hacer el inventario');
        }
      } else {
        showLoading();
        inventarioService
          .realizarInventarioTrue(
            useAuth.negocioElegido._id, //@ts-ignore
            producto._id,
            estado.inventario.lotes,
          )
          .then((res) => {
            NotifySucess('Inventario guardado');
            estado.productosBloquesNull = estado.productosBloquesNull.filter(
              //@ts-ignore
              (item) => item._id !== producto._id,
            );
            limpiarInputs();
          })
          .finally(() => {
            hideLoading();
          });
      }
    })
    .finally(() => {
      hideLoading();
    });
};
const limpiarInputs = () => {
  estado.inventario.lotes = [
    {
      vencimiento: '',
      cantidad: '',
      bloque: '',
    },
  ];
};

onMounted(() => {
  // obtenerTodoStock();
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
</style>
