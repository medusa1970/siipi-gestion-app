<template>
  <NuxtLayout name="punto">
    <div class="p-2">
      <h1 class="text-lg font-bold text-orange-500 uppercase">
        Informacion del pedido {{ estado.pedidoDetalle._id }}
      </h1>
      <div v-if="estado.pedidoDetalle.comprador" class="grid grid-cols-2">
        <div>
          <h1>{{ estado.pedidoDetalle.precio }}</h1>
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
            >{{ formateadorFecha(estado.pedidoDetalle.estado[0]._creado) }}
          </p>
        </div>
        <div class="col-span-1 justify-self-end">
          <span class="text-lg flex gap-2">
            <p class="font-bold">Estado:</p>
            <p class="font-bold text-orange-500 uppercase">
              {{ estado.pedidoItemsEstado.estado }}🫡
            </p>
          </span>
          <span class="flex gap-2">
            <p class="font-bold">Fecha:</p>
            <p class="">
              {{ formateadorFecha(estado.pedidoItemsEstado._creado) }}🫡
            </p>
          </span>
          <div class="flex justify-end">
            <q-btn
              color="primary"
              label="Imprimir"
              padding="3px 15px"
              no-caps
              class="no-print"
              @click="imprimir" />
          </div>
        </div>
      </div>
      <div v-else>Cargando datos...</div>

      <Table
        v-if="estado.pedidoDetalle.items"
        :rows="estado.pedidoDetalle.items"
        :columns="detallePedidoPunto"
        dense>
        <template #dropdown>
          <span class="flex gap-2 justify-center items-center">
            <h1 class="font-bold bg-orange-500 p-2 text-white">
              PRECIO TOTAL PEDIDO:
            </h1>
            <p class="font-bold text-2xl">
              {{ estado.pedidoDetalle.precio }} Bs.
            </p>
          </span>
        </template>
        <!-- ACTIONS -->
        <template #body-cell-actions="{ props }">
          <q-td :props="props">
            <q-btn
              v-if="
                ['confirmado', 'ajustado'].includes(
                  estado.pedidoItemsEstado.estado
                ) &&
                !estado.pedidoDetalle.items?.[0].estado.some(
                  item => item.estado === 'recibido'
                )
              "
              icon="edit"
              class="p-1"
              color="black"
              size="sm"
              @click="ajustarItem(props.row)"
              ><QTooltip>Ajustar Item</QTooltip></q-btn
            >
          </q-td>
        </template>
      </Table>
      <q-btn
        v-if="estado.pedidoItemsEstado.estado === 'preparado'"
        class="bg-[#011627] text-white block mx-auto"
        icon="check"
        label="Recibir Pedido"
        @click="abrirModalRecibirPedido(params.id)" />
      <div
        v-if="estado.itemsEstadoAjustado.length > 0"
        class="flex flex-col border-t border-b border-gray-200 my-3">
        <div class="overflow-auto p-2 space-y-4" id="chatArea">
          <h1 class="text-center font-extrabold uppercase text-blue-500">
            Items Ajustados
          </h1>

          <div v-for="item in estado.itemsEstadoAjustado" :key="item">
            <div
              class="flex items-start hover:bg-gray-200 hover:text-blue-500 hover:rounded-lg transition-colors duration-200">
              <img
                class="w-8 h-8 rounded-full"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAbFBMVEX///8yicggg8Yth8cnhcYagcW0zucAfMPN3e77/P4Ae8IMfsTt8/nz9/vJ2+291OlGkcvC1+s6jMnl7vZ6rNeryORupdSewOCVu96Is9pPlc1fndCCsNl5q9bW5PHe6fRkn9GYvd5xptWmxePjJF1wAAAGmklEQVR4nO2da3ejLBCAFUZTY4wkZt+oubXN//+Pr+Sy2+aiqDADHp5v27Nn67MzwAAKQeDxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeCwjWX785Ej9PFo5LTd1LSL2gwjquo6XJ+pH00CRC8EZcM7D3zQ/YYyLakX9hKMo8pCzsAUeQrTe59TPOZTVGthj5F5ZNn+rWlA/bH+yiqno/ZVcO5atWZWCqt5NkoUOOWbVrKffxTFyJo7xEL+ro8ioH16BTLT2nh2OsyqhFuginiv3Ly9htd2pmtXRKL9LGGNqixby2bgAXomErZma5KkGvwYQlhYA4zP0Dp/bmKlJPXCMeElqn6JeQQsVdQs2/Y1divoFLVM0IWiVohlBmxT/jKhE2+CRJes4sbZx8EmxtqK6KTRVMq8AGxSTWkct+g5mQVM8mOll7swKakFzjfAKp55oZEZzVEKdpxuzOSqhzdOFwX70DheUhsJ0jkooS5vccDdzgzCIAkWQMIhIISQMIlII6UYMjI70Cl/TGCKMhXdSmjFxjiYYwoZCMDY0733JjMLw6d0Dk1D0NSYnvs9QpKmpxZk3zPENDc98HyFI0xmqIIEhcpISpCnqWCFJsQ3/w22GTZr+QTbEmlb8M8RuiNhJGsJ/uILozbCZB0/ekOEa5pM33GGW3TdD3K4GJm+IOnXyht7QG3pDb+gNvSGRYTh5w+nHkGJugbs7M/354fQNV+iG6Luk6Iboa234q4nY66Vf2CvCEfaHe+j7Fuir+glymvIa2xB9dw27GQbBFrchpvgv0n6gNkSCJEV9nSYM4UxgiJqm6D2p5Ij4ugnfURgGn3hzRNiSGCKmKcHbNBfQ0pQohE0QsQYMkn7mAlLlxqhCiBZERvdhUIKyUUoYwiA4IwSRA+W3XQnCuilpCDEKG/gkFQyCyvCwz0Pq0/kyw3nKvogFTecp0JTcv6kM9qecW/FF/s5cU0w/qOUuFMY2E6OK2u1GYai0YbYImooi7QfAD5QmZhlAftjATyrtijyy7MAv7YrMMkGpqLMtgn2CQbDQqMj2FgpKRU1DP4/21C5vWGhqjNyecfCJKh2fqWDXKPHIko/MVJ7afi70YlQYOfAltUE3y1r9mOsHICwtD+CNMhxUivNoR71iocyihN6OjZ8DCfqPrKcjOOYnycqdagXAIaqc87uwrFLWGUmAdFe6cFD5a7JlWafwNpQAbF5W7urdyMqtSCOAn6K8+RNL59XXyoJzEfWw2G63+1l6h5+32ziYjJ3HcpypQoaRnOu54d29jBP2tUk5b0Y7tjb5BOdZCGlNUw5Iv+ugJozdZpTtL4sGJCXrXz9JujcTxlzcf0fjiLxH8/W75ARh4FOBbP9zZ7KZ+yO2x4/d05ZhdNC8uJLE4qHYgxQtVctXhSbMY50lSiFeLNtFnyhhPD4H8AoT2hyLw+vFHmAI1+ws388UOKu1OBabtxNLHn1r+AWtvPnP1ehYbFjbxJl9m11NPXS9ldA4bkY8QnI8tPqFMlMNjhvHx+7t9SPAYeAznGKhsPDBzSkeVddBIRKb3k9R5HWo9t4KB0MbN6c+C73yasoe/V6RC87U365iByOCPbcHeSMZrhRK1iKv1k30ev3rzMDBX6cB2xHyLtU1L/O3wcziXIS8ez0OQ3GI4M0SGAOAXfzAVv6U9UhNs4rFuI+c+OVq3N+8uECXUHGkoBlSnQsoGnZ2DTDXp4h+zqUi2hS/8c9PUINr+pbG9E0yI9DzlvvR1ghKtHSoayt7mTswvgr/trSXuTH+aja0SzqGMvZo2mLwiyNojLyixfIcvcDG5Kn1OSqBz+FLQwv7c1QyIk9trdYeiYaufa1cyFHJ4MsvCE5DHggbtr9n8ostzQy7rzRDvWVlJNGQIJr+OFQvaf/3UjPkU5JGMmCR2K0QDgiiYyEcEETXQtg7iJmNy4ft9AyieyHsGUQHQ9gEsc+3RC6GsNc5Pc51pFd6VKfo51rqoccptXYvIL5HuTp1Zl74iPKA4WY/I5mpDRh4l+BqR/GQU4KjunXB1c78JrgUQBtKa1KFs60wVFyTIrgTQCMqdQ3BbVwaUTi53ekkVUpTt5NUpTd1tWK7A507Ua4bdjZEZ2vSO5x3GO7d7mjkKYQdhoL6CUfTMQ8+Od4KG6C9+sY9LN8IHTN95CvhTcDXrTtttftZ2r6WkYgJGLK2T9w+XB8NJa23DEygo2loO27x7H5HI7ualq8Up9DRNF1NS0N05/2SNtq6mkka/g86T4LooUCtLAAAAABJRU5ErkJggg=="
                alt="User Avatar" />
              <div class="ml-3">
                <h1 class="text-sm font-extrabold">{{ item.nombre }}</h1>
                <p class="text-sm text-gray-600">
                  <strong>Comentario:</strong> {{ item.comentario }}
                </p>
                <p class="text-sm text-gray-600">
                  <strong>Cantidad Anterior:</strong> {{ item.valor[0] }}
                </p>
                <p class="text-sm text-gray-600">
                  <strong>Cantidad Actual:</strong> {{ item.valor[1] }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>

  <!-- DIALOG CHOFER INPUT -->
  <Dialog
    v-model="estado.modal.isShowPassword"
    title="Ingrese contraseña chofer"
    label-btn="recibir"
    :handle-submit="recibirPedido">
    <template #inputsDialog>
      <q-input
        v-model="estado.passwordChofer"
        type="text"
        label="Contraseña"
        outlined
        dense />
    </template>
  </Dialog>
  <!-- AJUSTAR ITEM PEDIDO -->
  <Dialog
    v-model="estado.modal.isAjustarItem"
    title="Ajustar Item"
    label-btn="ajustar"
    :handle-submit="ajustarItemGuardar">
    <template #inputsDialog>
      <div class="flex flex-col gap-2">
        <q-input
          v-model.number="estado.pedido_item.cantidad"
          label="Cantidad"
          type="number"
          dense
          outlined
          clearable />
        <q-input
          v-model="estado.pedido_item.comentario"
          label="Comentario"
          type="text"
          dense
          outlined
          clearable />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
// import { usePedido } from '@/composables/punto/usePedido';
// import { detallePedidoPunto } from '@/helpers/columns';
// import realizarPedido from '../../realizarPedido.vue';
import { useRoute } from 'vue-router';
import { useMiPedido } from './miPedido.composable';
import { useAuthStore } from '@/modulos/main/useAuthStore';

const authStore = useAuthStore();
const { params } = useRoute();
const {
  buscarPedidoID,
  estado,
  recibirPedido,
  // obtenerItemsEstado,
  abrirModalRecibirPedido,
  ajustarItem,
  ajustarItemGuardar
} = useMiPedido();

const detallePedidoPunto = [
  {
    name: 'oferta',
    required: true,
    label: 'Oferta',
    align: 'left',
    field: row => row.oferta.nombre,
    sortable: true
  },
  // {
  //   name: 'precio',
  //   required: true,
  //   label: 'Precio U.',
  //   align: 'center',
  //   field: (row) => row.oferta.precio,
  //   sortable: true
  // },
  {
    name: 'cantidad',
    required: true,
    label: 'Cantidad',
    align: 'center',
    field: row => row.cantidad,
    sortable: true
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right'
  }
];

onMounted(() => {
  buscarPedidoID(params.id);
  // obtenerItemsEstado(params.id);
});
</script>
