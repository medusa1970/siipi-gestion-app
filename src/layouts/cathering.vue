<template>
  <layout-common
    :menuList="[
      {
        icon: 'bi-box',
        label: 'Productos',
        to: 'productos',
      },
      {
        icon: 'category',
        label: 'Categorias',
        to: 'categorias',
      },
      {
        icon: 'warehouse',
        label: 'Stock',
        to: 'stock',
      },
      {
        icon: 'shelves',
        label: 'Bloques',
        to: 'bloques',
      },
      {
        icon: 'menu_book',
        label: 'Ofertas',
        to: 'ofertas',
      },
      {
        icon: 'sell',
        label: 'Catalogos',
        to: 'catalogos',
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
      // {
      //   icon: 'bi-box',
      //   label: 'Productos',
      //   to: 'productos',
      // },
      // {
      //   icon: 'warehouse',
      //   label: 'Stock',
      //   to: 'stock2',
      // },
      {
        icon: 'storefront',
        label: 'Marcas',
        to: 'marcas',
      },
      {
        icon: 'balance',
        label: 'Medidas',
        to: 'medidas',
      },
      {
        icon: 'hail',
        label: 'Proveedores',
        to: 'proveedores',
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
import { useAuthStore } from '~/modulos/main/useAuthStore';
const router = useRouter();
const authStore = useAuthStore();
if (authStore.getNegocio?.tipo !== 'CATHERING') {
  goTo(router, 'inicio');
}
</script>
