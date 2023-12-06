<template>
  <div>
    <Navigation label="Stock" icon="folder" />
    <Table :rows="stocks" :columns="stockProducts" dense badge>
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
            >0 con stock en
            <p class="text-orange-500 cursor-pointer">Alerta</p>
          </span>
          <span class="flex gap-1"
            >0 con stock en
            <p class="text-red-500 cursor-pointer">Agotado</p>
          </span>
        </div>
      </template>
      <!-- BADGE -->
      <template #rows-badge="{ props }">
        <q-tr :props="props">
          <q-td key="foto" :props="props" class="w-[83px]">
            <q-img
              :src="props.row.foto"
              spinner-color="black"
              class="cell-image"
            />
          </q-td>
          <q-td key="producto" :props="props">
            {{ props.row.producto }}
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
              <div v-for="presentacion in props.row.presentaciones">
                <q-badge color="red" class="capitalize">
                  {{ presentacion.nombre }}: {{ presentacion.cantidad }}
                </q-badge>
              </div>
            </q-popup-edit>
          </q-td>
          <q-td key="lotes" :props="props">
            {{ formatDate(props.row.lotes[0].vencimiento) }}.
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
                <div v-for="lote in props.row.lotes">
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
        </q-tr>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { stockProducts } from '@/helpers/columns';
import { ref, onMounted } from 'vue';
import {
  showLoading,
  hideLoading,
  ApiError,
  NotifySucess
} from '@/helpers/message.service';
import { authStore } from '@/stores/auth.store';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const useAuth = authStore();
const stocks = ref([]);

const getAllStock = async () => {
  try {
    showLoading();
    const { entidadBuscarStocks: res } = await GqlBuscarStocks({
      entidadBusqueda: { _id: useAuth.negocioIDSelected },
      opciones: { populate: true }
    });
    console.log(res);
    //@ts-ignore
    // productos.value = productoBuscar.map((producto: any) => {
    //   return {
    //     foto: 'https://i.pinimg.com/564x/8d/1e/29/8d1e29fb76056c385d2d75117268c57d.jpg',
    //     producto: producto.nombre,
    //     stock: 123,
    //     lote: {
    //       nro: 'AB123',
    //       fecha: '12/12/2023'
    //     }
    //   };
    // });
    stocks.value = res.map((stock: any) => {
      const cantidadTotal = stock.lotes.reduce(
        (total: any, lote: any) => total + lote.cantidad,
        0
      );
      console.log(cantidadTotal);
      return {
        foto: 'https://i.pinimg.com/564x/8d/1e/29/8d1e29fb76056c385d2d75117268c57d.jpg',
        producto: stock.producto.nombre,
        presentaciones: stock.producto.presentaciones,
        lotes: stock.lotes,
        cantidad: cantidadTotal
      };
    });
    console.log(stocks.value);
    hideLoading();
  } catch (error) {
    ApiError(error);
  }
};
const formatDate = (date: any) => {
  return format(new Date(date), 'dd-MM-yyyy, EEEE', { locale: es });
};
onMounted(() => {
  getAllStock();
});
</script>
<style scoped>
.cell-image {
  width: 50px;
  height: 50px;
  border-radius: 100%;
}
</style>
