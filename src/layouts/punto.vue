<template>
  <layout-common :menuList="menu" :portada-img="PortadaCathering" punto>
    <template #slot>
      <slot />
    </template>

    <template #actionPedido>
      <q-btn-group push @click="e => e.stopPropagation()">
        <q-btn
          @click="pedidoStore.listaPedido = []"
          label="Vaciar"
          no-caps
          color="orange-7"
          padding="2px 20px"
          size="md"
          style="border-radius: 0" />

        <q-btn
          @click="realizarPedido"
          label="Aceptar"
          no-caps
          color="green-7"
          padding="2px 18px"
          size="md"
          style="border-radius: 0" />
      </q-btn-group>
    </template>
  </layout-common>
</template>

<script setup>
import PortadaCathering from '@/assets/img/cookies.png';
import layoutCommon from '@/layouts/shared/layoutCommon.vue';
import { useAuthStore } from '~/modulos/main/useAuthStore';
import { storePedido } from '@/modulos/pedidos/pedidos.store';
import { useQuasar } from 'quasar';
import { permisosProveedores } from '~/modulos/almacen/paginas/proveedores/proveedores.composable';
import { permisosStock } from '~/modulos/almacen/paginas/stock/stock.composable';
import { permisosEmpleados } from '~/modulos/empresa/paginas/empleados/empleados';
import { permisosTesoreria } from '~/modulos/empresa/paginas/tesoreria/tesoreria';
import { permisosProblemas } from '~/modulos/almacen/paginas/problemas/problemas.composable';
import { apiPedido } from '@/modulos/pedidos/API/pedidos.api';

const $q = useQuasar();
const pedidoStore = storePedido();
const router = useRouter();
const authStore = useAuthStore();
if (authStore.getNegocio?.tipo !== 'PUNTO') {
  goTo(router, 'inicio');
}

const menu = [
  {
    icon: 'warehouse',
    label: 'Almacen',
    key: 'almacen',
    subMenu: [
      {
        icon: 'warehouse',
        label: 'Stock',
        to: 'stock',
        permisos: permisosStock
      },
      {
        icon: 'hail',
        label: 'Proveedores',
        to: 'proveedores',
        permisos: permisosProveedores
      },
      {
        icon: 'warning',
        label: 'Problemas de inventario',
        to: 'problemas',
        permisos: permisosProblemas
      }
    ]
  },
  {
    icon: 'shopping_cart',
    label: 'Pedidos',
    key: 'pedidos',
    soloDev: true,
    subMenu: [
      {
        icon: 'add_shopping_cart',
        label: 'Realizar pedido',
        to: 'realizarPedido'
      },
      {
        icon: 'list_alt',
        label: 'Mis pedidos',
        to: 'misPedidos'
      }
      // {
      //   icon: 'shopping_cart',
      //   label: 'ListaPedidos',
      //   to: 'listaPedidos',
      //   soloDev: true
      // }
    ]
  },
  {
    icon: 'storefront',
    label: 'Sucursal',
    key: 'sucursal',
    subMenu: [
      {
        icon: 'group',
        label: 'Empleados',
        to: 'empleados',
        permisos: permisosEmpleados
      },
      {
        icon: 'money',
        label: 'Tesoreria',
        to: 'tesoreria',
        permisos: permisosTesoreria
      }
    ]
  }
];

const realizarPedido = async () => {
  const items = pedidoStore.listaPedido.map(p => ({
    ofertaId: p.id,
    cantidad: parseInt(p.cantidad)
  }));
  $q.dialog({
    message: '¿Estas seguro de aceptar este pedido?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      const pedido = await apiPedido.pedidoIniciar(
        {
          comprador: authStore.negocio._id,
          vendedor: '65a5a9af08c1a906d83522d0',
          items
        },
        {},
        authStore.token
      );
      // console.log(pedido);
      if (pedido) {
        const pedidoEstado = await apiPedido.pedidoConfirmarItems(
          {
            _id: pedido._id
          },
          authStore.token
        );
        // console.log(pedidoEstado);
        NotifySucessCenter('Pedido realizado con éxito');
        pedidoStore.listaPedido = [];
      } else NotifyError('Error al realizar el pedido');
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
