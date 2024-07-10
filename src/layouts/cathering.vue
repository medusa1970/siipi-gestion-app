<template>
  <layout-common
    :menuList="[
      {
        icon: 'bi-box',
        label: 'Logistica',
        subMenu: [
          {
            label: 'Productos',
            to: '/cathering/productos',
          },
          {
            label: 'Categorias de categorias ',
            to: '/categorias',
          },
        ],
      },
      {
        icon: 'warehouse',
        label: 'Stock',
        to: '/stock',
        subMenu: [
          {
            label: 'Productos',
            to: '/cathering/productos',
          },
          {
            label: 'Categorias de categorias ',
            to: '/categorias',
          },
        ],
      },
      {
        icon: 'sell',
        label: 'Venta',
        subMenu: [
          {
            label: 'Ofertas',
            to: '/cathering/ofertas',
          },
          {
            label: 'Catalogos de oferta',
            to: '/cathering/ofertas/catalogos',
          },
        ],
      },
      // {
      //   icon: 'description',
      //   label: 'Pedidos',
      //   subMenu: [
      //     {
      //       label: 'pedido puntos',
      //       to: '/pedidos/puntos',
      //     },
      //     {
      //       label: 'pedido global',
      //       to: '/pedidos/global',
      //     },
      //     {
      //       label: 'pedido historial',
      //       to: '/pedidos/historial',
      //     },
      //   ],
      // },
      {
        icon: 'people',
        label: 'Administracion',
        subMenu: [
          {
            label: 'Empleados',
            to: '/cathering/empleados',
          },
        ],
      },
    ]"
    :portada-img="PortadaCathering"
    cathering
  >
    <template #slot>
      <slot />
    </template>
  </layout-common>
</template>

<script setup>
import { menuListCathering } from './menuList/menuList';
import PortadaCathering from '@/assets/img/cookies.png';
import layoutCommon from '@/layouts/shared/layoutCommon.vue';
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';
const router = useRouter();
const authStore = useAuthStore();
if (authStore.getNegocio?.tipo !== 'CATHERING') {
  goTo(router, 'inicio');
}
</script>
