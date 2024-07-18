<template>
  <layout-common
    :menuList="[
      {
        icon: 'warehouse',
        label: 'Prueba',
        to: 'test',
      },
    ]"
    :portada-img="PortadaCathering"
    punto
  >
    <template #slot>
      <slot />
    </template>
  </layout-common>
</template>

<script setup>
import PortadaCathering from '@/assets/img/cookies.png';
import layoutCommon from '@/layouts/shared/layoutCommon.vue';
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';
const router = useRouter();
const authStore = useAuthStore();
console.log(authStore.negocio.tipo);
console.log(authStore.getNegocio?.tipo);
if (authStore.getNegocio?.tipo !== 'PUNTO') {
  goTo(router, 'inicio');
}

const menuListPunto = [
  {
    icon: 'warehouse',
    label: 'Prueba',
    to: 'test',
  },
  {
    icon: 'warehouse',
    label: 'Almacen',
    to: 'cathering/stock',
  },
  {
    icon: 'add_shopping_cart',
    label: 'Realizar pedido',
    to: '/pedidos/realizar-pedido',
  },
  {
    icon: 'list_alt',
    label: 'Mis pedidos',
    to: '/pedidos/listaPedidos',
  },

  {
    icon: 'people',
    label: 'Administracion',
    subMenu: [
      // {
      //   label: 'Datos de la empresa',
      //   to: '/cathering',
      // },
      {
        label: 'Empleados',
        to: '/cathering/empleados',
      },
    ],
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
</script>
