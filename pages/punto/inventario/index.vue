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
            {{ useProduct.ListInventario[currentIndex].producto.nombre }}
          </h1>
          <!-- <div class="row items-center" style="width: 100%">
            <q-select
              color="primary"
              v-model="inventario.presentacion"
              :options="
                useProduct.ListInventario[currentIndex].producto.presentaciones
              "
              label="Seleccionar presentacion"
              option-label="nombre"
              style="width: 100%"
              use-input
              hide-selected
              fill-input
              dense
              outlined
            >
              <template v-slot:append>
                <q-icon
                  style="margin: 0"
                  name="close"
                  @click.stop.prevent="inventario.presentacion = ''"
                  class="cursor-pointer q-mr-md"
                />
              </template>
              <template v-slot:prepend>
                <q-icon name="bi-box-seam" />
              </template>
            </q-select>
          </div>
          <div class="w-full grid grid-cols-2 gap-3">
            <q-select
              color="primary"
              v-model="inventario.fecha"
              :options="useProduct.ListInventario[currentIndex].lotes"
              label="Vencimiento"
              option-label="vencimiento"
              style="width: 100%"
              use-input
              hide-selected
              fill-input
              dense
              outlined
            >
            </q-select>
            <q-input
              v-model.number="inventario.cantidad"
              type="number"
              label="Cantidad"
              outlined
              dense
            />
          </div> -->
          <!-- PROBANDOOOO -->
          <div v-for="(lote, index) in inventario.lotes">
            <span class="flex justify-between items-center">
              <h1 class="font-bold">FILA {{ index }}</h1>
              <q-btn
                icon="delete"
                color="red"
                dense
                flat
                round
                size="13px"
                @click="inventario.lotes.splice(index, 1)"
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
import { ref, onMounted } from 'vue';
import { Inventarios } from '@/mocks/data.json';
import { productStore } from '@/stores/producto.store';
import {
  NotifyError,
  NotifySucess,
  hideLoading,
  showLoading
} from '~/helpers/message.service';
import { useQuasar } from 'quasar';
import { authStore } from '~/stores/auth.store';

const useAuth = authStore();
const $q = useQuasar();
const useProduct = productStore();
const inventario = ref({
  producto: '',
  lotes: {
    vencimiento: '',
    cantidad: '',
    bloque: ''
  },
  presentacion: ''
});
const test = ref(false);
const countRetry = ref(0);
// const inventariosPDF = ref([]);

const showComment = ref(false);
const currentIndex = ref(0);

const printInventory = () => {
  window.print();
};
const existInventary = () => {
  if (useProduct.ListInventario.length > 0) {
    $q.notify({
      type: 'positive',
      position: 'center',
      message: `Bienvenido, tienes inventario por hacer`,
      progress: true,
      timeout: 1500
    });
  }
};
const terminarInventario = async () => {
  // console.log(useAuth.negocioIDSelected);
  // console.log(useProduct.ListInventario[currentIndex.value].producto._id);
  // console.log(inventario.value.lotes);
  if (useProduct.ListInventario.length > 0) {
    /**LOGICA */
    showLoading();
    GqlHacerInventario({
      entidadBusqueda: { _id: useAuth.negocioIDSelected },
      guardar: false,
      datos: {
        producto: useProduct.ListInventario[currentIndex.value].producto._id,
        lotes: inventario.value.lotes,
        reporte: 'se hizo'
      }
    })
      .then((res) => {
        if (res.entidadHacerInventario.inventarios[0].diferencias.length > 0) {
          countRetry.value++;
          if (countRetry.value > 1) {
            showLoading();
            GqlHacerInventario({
              entidadBusqueda: { _id: useAuth.negocioIDSelected },
              guardar: true,
              datos: {
                producto:
                  useProduct.ListInventario[currentIndex.value].producto._id,
                lotes: inventario.value.lotes,
                reporte: 'se hizo'
              }
            })
              .then((res) => {
                NotifySucess('Inventario guardado');
                logica();
              })
              .finally(() => {
                hideLoading();
              });
          } else {
            NotifyError('Hay diferencias, vuelva a hacer el inventario');
          }
        } else {
          GqlHacerInventario({
            entidadBusqueda: { _id: useAuth.negocioIDSelected },
            guardar: true,
            datos: {
              producto:
                useProduct.ListInventario[currentIndex.value].producto._id,
              lotes: inventario.value.lotes,
              reporte: 'se hizo'
            }
          })
            .then((res) => {
              NotifySucess('Inventario guardado');
              logica();
            })
            .finally(() => {
              hideLoading();
            });
        }
      })
      .finally(() => {
        hideLoading();
      });
  }
  console.log(useProduct.ListInventarioPDF);
};
const logica = () => {
  inventario.value.producto =
    //@ts-ignore
    useProduct.ListInventario[currentIndex.value].producto.nombre;
  //@ts-ignore
  useProduct.ListInventarioPDF.push({ ...inventario.value });
  // Eliminar el inventario actual de la lista
  useProduct.ListInventario.splice(currentIndex.value, 1);
  inventario.value.producto = '';
  inventario.value.presentacion = '';
  inventario.value.fecha = '';
  inventario.value.cantidad = '';
  inventario.value.comentario = '';

  // Incrementar el índice para pasar al siguiente inventario
  currentIndex.value++;

  // Notificar cuando todos los inventarios han sido completados
  if (useProduct.ListInventario.length === 0) {
    $q.notify({
      type: 'positive',
      position: 'center',
      message: `Inventario terminado, puedes descansar`,
      progress: true,
      timeout: 1500
    });
  }
  // Reiniciar el índice para comenzar de nuevo si es necesario
  currentIndex.value = 0;
};
const agregarFila = () => {
  inventario.value.lotes.push({
    vencimiento: '',
    cantidad: '',
    bloque: ''
  });
};
onMounted(() => {
  existInventary();
  // Obtener la longitud de lotes del primer producto
  const firstProductLotesLength =
    useProduct.ListInventario[0]?.lotes?.length || 0;

  // Inicializar table.value con la longitud correspondiente
  inventario.value.lotes = Array.from(
    { length: firstProductLotesLength },
    () => ({
      vencimiento: '',
      cantidad: '',
      bloque: ''
    })
  );
});
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
