<template>
  <layout-common :menuList="menu" :portada-img="PortadaCathering" cathering>
    <template #slot>
      <slot />
    </template>
  </layout-common>
</template>

<script setup lang="ts">
import PortadaCathering from '@/assets/img/cookies.png';
import layoutCommon from '@/layouts/shared/layoutCommon.vue';
import { permisosBloques } from '~/modulos/almacen/paginas/bloques/bloques.composable';
import { permisosCategoria } from '~/modulos/almacen/paginas/categorias/categorias.composable';
import { permisosMarcas } from '~/modulos/almacen/paginas/marcas/marcas.composable';
import { permisosMedidas } from '~/modulos/almacen/paginas/medidas/medidas.composable';
import { permisosProductos } from '~/modulos/almacen/paginas/productos/productos.composable';
import { permisosProveedores } from '~/modulos/almacen/paginas/proveedores/proveedores.composable';
import { permisosStock } from '~/modulos/almacen/paginas/stock/stock.composable';
import { permisosEmpleados } from '~/modulos/empresa/paginas/empleados/empleados';
import { permisosTesoreria } from '~/modulos/empresa/paginas/tesoreria/tesoreria';
import { useAuthStore } from '~/modulos/main/useAuthStore';
import { permisosCatalogos } from '~/modulos/ofertas/paginas/catalogos/catalogos.composable';
import { permisosOfertas } from '~/modulos/ofertas/paginas/ofertas/ofertas.composable';
import { permisosProblemas } from '~/modulos/almacen/paginas/problemas/problemas.composable';
const authStore = useAuthStore();
const router = useRouter();
if (authStore.getNegocio?.tipo !== 'CATHERING') {
  goTo(router, 'inicio');
}
const menu = [
  {
    icon: 'warehouse',
    label: 'Almacen',
    key: 'almacen',
    subMenu: [
      {
        icon: 'bi-box',
        label: 'Productos',
        to: 'productos',
        permisos: permisosProductos,
        activar: ['producto']
      },
      {
        icon: 'category',
        label: 'Categorias',
        to: 'categorias',
        permisos: permisosCategoria
      },
      {
        icon: 'warehouse',
        label: 'Stock',
        to: 'stock',
        permisos: permisosStock
      },
      {
        icon: 'shelves',
        label: 'Bloques',
        to: 'bloques',
        permisos: permisosBloques
      },
      {
        icon: 'storefront',
        label: 'Marcas',
        to: 'marcas',
        permisos: permisosMarcas
      },
      {
        icon: 'balance',
        label: 'Medidas',
        to: 'medidas',
        permisos: permisosMedidas,
        activar: ['medida']
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
    icon: 'menu_book',
    label: 'Ofertas',
    key: 'ofertas',
    subMenu: [
      {
        icon: 'menu_book',
        label: 'Ofertas',
        to: 'ofertas',
        permisos: permisosOfertas,
        activar: ['oferta']
      },
      {
        icon: 'category',
        label: 'Catalogos',
        to: 'catalogos',
        permisos: permisosCatalogos
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
        icon: 'shopping_cart',
        label: 'listaPedidos',
        to: 'listaPedidos'
      }
    ]
  },
  {
    icon: 'storefront',
    label: 'Empresa',
    key: 'empresa',
    subMenu: [
      {
        icon: 'group',
        label: 'Empleados',
        to: 'empleados',
        permisos: permisosEmpleados,
        activar: ['empleado']
      },
      {
        icon: 'money',
        label: 'Tesoreria',
        to: 'tesoreria',
        permisos: permisosTesoreria,
        activar: ['tesoreriaDetalle']
      }
    ]
  }
];
</script>
