<template>
  <layout-common
    :menuList="menuListPunto"
    :portada-img="PortadaCathering"
    punto
  >
    <template #actionPedido>
      <q-btn-group push @click="(e) => e.stopPropagation()">
        <q-btn
          @click="pedidoStore.listaPedido = []"
          label="Vaciar"
          no-caps
          color="orange-7"
          padding="2px 20px"
          size="md"
          style="border-radius: 0"
        />

        <q-btn
          @click="realizarPedido"
          label="Aceptar"
          no-caps
          color="green-7"
          padding="2px 18px"
          size="md"
          style="border-radius: 0"
        />
      </q-btn-group>
    </template>
    <template #slot>
      <slot />
    </template>
  </layout-common>
</template>

<script setup>
import PortadaCathering from '@/assets/img/cookies.png';
import layoutCommon from '@/layouts/shared/layoutCommon.vue';
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';
import { storePedido } from '@/modulos/pedidos/negocio/pedido.store';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const pedidoStore = storePedido();
const router = useRouter();
const authStore = useAuthStore();
if (authStore.getNegocio?.tipo !== 'PUNTO') {
  goTo(router, 'inicio');
}

const menuListPunto = [
  {
    icon: 'warehouse',
    label: 'Almacen',
    to: 'stock',
  },
  {
    icon: 'add_shopping_cart',
    label: 'Realizar pedido',
    to: 'realizar-pedido',
  },
  {
    icon: 'list_alt',
    label: 'Mis pedidos',
    to: 'lista-pedidos',
  },

  {
    icon: 'people',
    label: 'Empleados',
    to: 'empleados',
  },
  // {
  //   icon: 'description',
  //   label: 'Pedidos',
  //   subMenu: [
  //     {
  //       label: 'ver pedidos',
  //       to: '/cathering/pedidos/listaPedidos',
  //     },
  //   ],
  // },
  // {
  //   icon: 'sell',
  //   label: 'Areas',
  //   subMenu: [
  //     {
  //       label: 'Panaderia',
  //       to: '/cathering',
  //     },
  //     {
  //       label: 'Reposteria',
  //       to: '/cathering',
  //     },
  //   ],
  // },
  // {
  //   icon: 'inventory_2',
  //   label: 'Gestion',
  //   subMenu: [
  //     {
  //       label: 'Problemas de inventario',
  //       to: '/cathering/inventario/listaProblemas',
  //     },
  //   ],
  // },
  // {
  //   icon: 'fact_check',
  //   label: 'Menu',
  //   to: '/punto/menu',
  //   subMenu: [],
  // },

  // {
  //   icon: 'point_of_sale',
  //   label: 'Caja',
  //   to: '/punto/caja',
  //   subMenu: [],
  // },
  // {
  //   icon: 'settings',
  //   label: 'Configuración',
  //   // to: '/punto/configuracion',
  //   subMenu: [],
  // },
];

const realizarPedido = async () => {
  console.log('first');
  const items = pedidoStore.listaPedido.map((p) => ({
    ofertaId: p.id,
    cantidad: parseInt(p.cantidad),
  }));
  $q.dialog({
    message: '¿Estas seguro de aceptar este pedido?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      const pedido = await api.pedidoIniciar(
        {
          comprador: authStore.negocio._id,
          vendedor: '65a5a9af08c1a906d83522d0',
          items,
        },
        { loading: true },
        authStore.token,
      );
      // console.log(pedido);
    } catch (err) {
      console.log(err);
      return;
    }
    // const pedido = await pedidoService.pedidoIniciar(
    //   storeAuth.negocioElegido._id,
    //   '65a5a9af08c1a906d83522d0',
    //   items,
    //   useGqlToken(storeAuth.token),
    // );
    // if (pedido) {
    //   await pedidoService.pedidoConfirmarItems(pedido._id);
    //   NotifySucessCenter('Pedido realizado con éxito');
    //   // router.push('/punto/pedidos/listaPedidos');
    //   pedidoStore.listaPedido = [];
    // } else NotifyError('Error al realizar el pedido');
  });
};
</script>
