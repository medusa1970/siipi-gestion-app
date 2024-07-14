<template>
  <layout-common
    :menuList="[
      {
        icon: 'bi-box',
        label: 'Productos',
        to: 'productos',
      },
      {
        icon: 'warehouse',
        label: 'Stock',
        to: 'stock',
      },
      {
        icon: 'sell',
        label: 'Ofertas',
        to: 'ofertas',
      },
      {
        icon: 'sell',
        label: 'Catalogos',
        to: 'catalogos',
      },
      {
        icon: 'description',
        label: 'Pedidos',
        subMenu: [
          {
            label: 'pedido puntos',
            to: '/pedidos/puntos',
          },
          {
            label: 'pedido global',
            to: '/pedidos/global',
          },
          {
            label: 'pedido historial',
            to: '/pedidos/historial',
          },
        ],
      },
      {
        icon: 'bi-box',
        label: 'Productos2',
        to: 'productos2',
      },
      {
        icon: 'warehouse',
        label: 'Stock2',
        to: 'stock2',
      },
      {
        icon: 'tag',
        label: 'Marcas2',
        to: 'marcas2',
      },
      {
        icon: 'tag',
        label: 'Medidas2',
        to: 'medidas2',
      },
      {
        icon: 'tag',
        label: 'Proveedores2',
        to: 'proveedores2',
      },
      // {
      //   icon: 'people',
      //   label: 'Administracion',
      //   subMenu: [
      //     {
      //       label: 'Empleados',
      //       to: '/cathering/empleados',
      //     },
      //   ],
      // },
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
