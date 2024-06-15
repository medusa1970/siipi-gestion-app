<template>
  <Layout
    :menuList="menuListCathering"
    :portada-img="PortadaCathering"
    cathering
  >
    <template #actionPedido>
      <q-btn
        dense
        no-caps
        padding="3px 10px"
        color="primary"
        label="Cancelar"
        @click="storePedido.listaPedido = []"
      />
      <q-btn
        dense
        no-caps
        padding="3px 10px"
        color="primary"
        label="Aceptar"
        @click="realizarPedido"
      />
    </template>
    <template #slot>
      <slot />
    </template>
  </Layout>
</template>

<script setup>
import { menuListCathering } from '@/helpers/menuList';
import { pedidoStore } from '@/stores/pedido.store';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { pedidoService } from '~/services/pedido.service';
import { NotifyError, NotifySucessCenter } from '~/helpers/message.service';
import { authStore } from '@/stores/auth.store';
import { useQuasar } from 'quasar';
import PortadaCathering from '@/assets/img/cookies.png';
import { useAuth } from '~/composables/auth/useAuth';

const storeAuth = authStore();
const $q = useQuasar();

const storePedido = pedidoStore();
const router = useRouter();

const realizarPedido = async () => {
  const items = storePedido.listaPedido.map((p) => ({
    oferta: p.id,
    cancheckPermisostidad: parseInt(p.cantidad),
  }));

  $q.dialog({
    // title: `Eliminar ${row.nombre}`,
    message: '¿Estas seguro de aceptar este pedido?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    if (storePedido.isDespachar == false) {
      // RECIBE PEDIDO
      const pedido = await pedidoService.pedidoIniciar(
        storeAuth.negocioElegido._id,
        storePedido.areaPedidoID,
        items,
        useGqlToken(storeAuth.token),
      );
      if (pedido) {
        await pedidoService.pedidoConfirmarItems(pedido._id);
        await pedidoService.pedidoAceptarItems(pedido._id);
        await pedidoService.pedidoPrepararItems(pedido._id);
        await pedidoService.pedidoRecibirItems(pedido._id);
        NotifySucessCenter('Pedido recibido con éxito');
        router.push('/cathering/pedidos/listaPedidos');
        storePedido.listaPedido = [];
      } else NotifyError('Error al realizar el pedido');

      // console.log(storePedido.listaPedido);
    } else {
      // SE DESPACHA PRODUCTO
      const pedido = await pedidoService.pedidoIniciar(
        storePedido.areaPedidoID,
        storeAuth.negocioElegido._id,
        items,
        useGqlToken(storeAuth.token),
      );
      // console.log(pedido);
      if (pedido) {
        await pedidoService.pedidoConfirmarItems(pedido._id);
        await pedidoService.pedidoAceptarItems(pedido._id);
        await pedidoService.pedidoPrepararItems(pedido._id);
        await pedidoService.pedidoRecibirItems(pedido._id);
        NotifySucessCenter('Pedido realizado con éxito');
        router.push('/cathering/pedidos/listaPedidos');
        storePedido.listaPedido = [];
      } else NotifyError('Error al realizar el pedido');
    }
  });
};

// const menuListComputed = computed(() => {
//   // FILTRO ALMACEN
//   if (storeAuth.negocioElegido.permisos.includes('almacen')) {
//     return menuListCathering.filter(
//       (item) => item.label === 'Stock' || item.label === 'Pedidos',
//     );
//   }

//   // FILTRO ADQUISICION
//   if (storeAuth.negocioElegido.permisos.includes('almacen')) {
//     return menuListCathering.filter(
//       (item) => item.label === 'Stock' || item.label === 'Pedidos',
//     );
//   }

//   // RETURN
//   return menuListCathering;
// });
</script>
