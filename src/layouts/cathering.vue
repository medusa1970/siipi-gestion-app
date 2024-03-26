<template>
  <Layout :menuList="menuListComputed">
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
    '65a1a6c9566e40c934929a56',
    items,
    useGqlToken(storeAuth.token),
  );
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

console.log(menuListCathering);
console.log(storeAuth.user.cargo);

// const cargo = menuListCathering.filter(
//   (item) => item.label === 'Stock' || item.label === 'Pedidos',
// );
// console.log(cargo);

const menuListComputed = computed(() => {
  if (storeAuth.user.cargo === 'almacen') {
    return menuListCathering.filter(
      (item) => item.label === 'Stock' || item.label === 'Pedidos',
    );
  } else {
    return menuListCathering;
  }
});
</script>
