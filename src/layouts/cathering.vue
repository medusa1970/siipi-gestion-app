<template>
  <Layout :menuList="menuListCathering">
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
import { pedidoService } from '~/services/punto/pedido.service';
import { NotifyError, NotifySucessCenter } from '~/helpers/message.service';
import { authStore } from '@/stores/auth.store';
const storeAuth = authStore();

const storePedido = pedidoStore();
const router = useRouter();

const realizarPedido = async () => {
  const items = storePedido.listaPedido.map((p) => ({
    oferta: p.id,
    cantidad: parseInt(p.cantidad),
  }));
  const { pedidoIniciar } = await pedidoService.pedidoIniciar(
    storeAuth.negocioElegido._id,
    '65a1a6c9566e40c934929a47',
    items,
    useGqlToken(storeAuth.token),
  );
  console.log(pedidoIniciar);
  if (pedidoIniciar) {
    await pedidoService.pedidoConfirmarItems(pedidoIniciar._id);
    await pedidoService.pedidoAceptarItems(pedidoIniciar._id);
    await pedidoService.pedidoPrepararItems(pedidoIniciar._id);
    await pedidoService.pedidoRecibirItems(pedidoIniciar._id);
    NotifySucessCenter('Pedido recibido con éxito');
    router.push('/cathering/pedidos/listaPedidos');
    storePedido.listaPedido = [];
  } else NotifyError('Error al realizar el pedido');

  console.log(storePedido.listaPedido);
};
</script>
