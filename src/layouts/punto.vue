<template>
  <Layout :menuList="menuListPunto" :portada-img="PortadaPunto" punto>
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
import { menuListPunto } from '@/helpers/menuList';
import { pedidoStore } from '@/stores/pedido.store';
import { useRouter } from 'vue-router';
import { pedidoService } from '~/services/pedido.service';
import { NotifyError, NotifySucessCenter } from '~/helpers/message.service';
import { useQuasar } from 'quasar';
import PortadaPunto from '@/assets/img/backPunto.png';

const $q = useQuasar();

const authStore = useAuthStore();
const storePedido = pedidoStore();
const router = useRouter();

const realizarPedido = async () => {
  const items = storePedido.listaPedido.map((p) => ({
    oferta: p.id,
    cantidad: parseInt(p.cantidad),
  }));
  $q.dialog({
    // title: `Eliminar ${row.nombre}`,
    message: '¿Estas seguro de aceptar este pedido?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const pedido = await pedidoService.pedidoIniciar(
      authStore.negocioElegido._id,
      '65a5a9af08c1a906d83522d0',
      items,
      useGqlToken(authStore.token),
    );
    if (pedido) {
      await pedidoService.pedidoConfirmarItems(pedido._id);
      NotifySucessCenter('Pedido realizado con éxito');
      router.push('/punto/pedidos/listaPedidos');
      storePedido.listaPedido = [];
    } else NotifyError('Error al realizar el pedido');
  });
};
</script>
