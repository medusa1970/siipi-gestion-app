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
      {
        icon: 'group',
        label: 'Empleados',
        to: 'empleados',
      },
      {
        icon: 'money',
        label: 'Tesoreria',
        to: 'tesoreria',
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
import PortadaCathering from '@/assets/img/cookies.png';
import layoutCommon from '@/layouts/shared/layoutCommon.vue';
import { useAuthStore } from '~/modulos/main/useAuthStore';
const authStore = useAuthStore();
const router = useRouter();
if (authStore.getNegocio?.tipo !== 'CATHERING') {
  goTo(router, 'inicio');
}
</script>
