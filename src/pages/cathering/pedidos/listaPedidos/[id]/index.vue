<template>
  <Navigation
    label="Lista pedidos"
    icon="list_alt"
    href="/cathering/pedidos/listaPedidos"
    label2="pedidoDetalle"
  />
  <div class="p-2" id="divParaImprimir">
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
        <q-btn
          color="primary"
          label="Imprimir"
          padding="3px 15px"
          no-caps
          class="no-print"
          @click="imprimir"
        />
      </div>
    </div>
    <div v-else>Cargando datos...</div>

    <Table
      :rows="estado.pedidoDetalle.items"
      :columns="
        estado.pedidoItemsEstado === 'preparado'
          ? detallePedidoAccion
          : detallePedido
      "
      dense
    >
      <template #dropdown>
        <span class="flex gap-2 justify-center items-center">
          <h1 class="font-bold bg-orange-500 p-2 text-white">
            PRECIO TOTAL PEDIDO:
          </h1>
          <p class="font-bold text-2xl">{{ estado.precioGeneral }} Bs.</p>
        </span>
      </template>
      <!-- ACTIONS -->
      <template #body-cell-actions="{ props }">
        <q-td :props="props">
          <q-btn
            color="primary"
            icon="edit"
            dense
            flat
            round
            size="13px"
            @click="ajustarItem(props.row)"
            ><QTooltip>Ajustar Item</QTooltip></q-btn
          >
        </q-td>
      </template>
    </Table>
  </div>

  <!-- DIALOG -->
  <Dialog
    v-model="estado.modal.isAjustarItem"
    title="Ajustar Item"
    :handle-submit="ajustarItemGuardar"
  >
    <template #inputsDialog>
      <div class="flex flex-col gap-2">
        <q-input
          v-model.number="estado.itemPedido.cantidad"
          label="Cantidad"
          type="number"
          dense
          outlined
          clearable
        />
        <q-input
          v-model="estado.itemPedido.comentario"
          label="Comentario"
          type="text"
          dense
          outlined
          clearable
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePedido } from '@/composables/punto/usePedido';
import { detallePedido, detallePedidoAccion } from '@/helpers/columns';
import { hideLoading, showLoading } from '~/helpers/message.service';

const { params } = useRoute();
const {
  buscarPedidoID,
  estado,
  formatearFecha,
  ajustarItem,
  ajustarItemGuardar,
} = usePedido();

definePageMeta({
  layout: 'cathering',
});

const imprimir = () => {
  console.log('imprimir');
  // let printContents = document.getElementById('imprimir').innerHTML;
  // let originalContents = document.body.innerHTML;

  // document.body.innerHTML = printContents;

  window.print();

  // document.body.innerHTML = originalContents;
};

onMounted(() => {
  buscarPedidoID(params.id);
});
</script>

<style lang="scss">
@media print {
  body * {
    visibility: hidden;
  }
  .no-print {
    display: none;
  }
  #divParaImprimir,
  #divParaImprimir * {
    visibility: visible;
  }
  #divParaImprimir {
    position: absolute;
    left: 0;
    top: 10px;
  }
}
</style>
