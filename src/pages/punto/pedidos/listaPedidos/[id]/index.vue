<template>
  <Navigation
    label="Lista pedidos"
    icon="list_alt"
    href="/punto/pedidos/listaPedidos"
    label2="pedidoDetalle"
  />
  <!-- <code>{{ estado.pedidoDetalle }}</code> -->
  <div class="p-2">
    <h1 class="text-lg font-bold text-orange-500 uppercase">
      Informacion del pedido {{ estado.pedidoDetalle._id }}
    </h1>
    <div v-if="estado.pedidoDetalle.comprador" class="grid grid-cols-2">
      <div>
        <p>
          <strong>Entidad origen: </strong
          >{{ estado.pedidoDetalle.comprador.nombre }}
        </p>
        <p>
          <strong>Entidad destino: </strong
          >{{ estado.pedidoDetalle.vendedor.nombre }}
        </p>
        <!-- <p><strong>Estado: </strong>{{ estado.pedidoItemsEstado }}🫡</p> -->
        <p>
          <strong>Responsable: </strong
          >{{ estado.pedidoDetalle.estado[0].persona.nombre }}
          {{ estado.pedidoDetalle.estado[0].persona.apellido }}
        </p>
        <p>
          <strong>Fecha: </strong
          >{{ formatearFecha(estado.pedidoDetalle.estado[0].fecha) }}
        </p>
      </div>
      <div>
        <span class="text-2xl flex gap-2">
          <p class="font-bold">Estado:</p>
          <p class="font-bold text-orange-500 uppercase">
            {{ estado.pedidoItemsEstado }}🫡
          </p>
        </span>
        <!-- <p class="text-2xl text-orange-500">
          <strong class="text-2xl">Estado: </strong
          >{{ estado.pedidoItemsEstado }}🫡
        </p> -->
      </div>
    </div>
    <div v-else>Cargando datos...</div>

    <Table
      :rows="estado.pedidoDetalle.items"
      :columns="detallePedido"
      dense
      :handle-pedido="() => recibirPedido(params.id)"
    >
      <template #dropdown>
        <span class="flex gap-2 justify-center items-center">
          <h1 class="font-bold bg-orange-500 p-2 text-white">
            PRECIO TOTAL PEDIDO:
          </h1>
          <p class="font-bold text-2xl">{{ estado.precioGeneral }} Bs.</p>
        </span>
      </template>
    </Table>
    <q-btn
      v-if="estado.pedidoItemsEstado === 'preparado'"
      class="bg-[#011627] text-white block mx-auto"
      icon="check"
      label="Recibir Pedido"
      @click="recibirPedido(params.id)"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePedido } from '@/composables/punto/usePedido';
import { detallePedido } from '@/helpers/columns';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const { params } = useRoute();
const { buscarPedidoID, estado, recibirPedido } = usePedido();

definePageMeta({
  layout: 'punto',
});

const formatearFecha = (date) => {
  return format(new Date(date), 'dd-MM-yyyy, EEEE', { locale: es });
};

onMounted(() => {
  buscarPedidoID(params.id);
});
</script>
