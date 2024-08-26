<template>
  <layout-common
    :menuList="menu"
    :portada-img="PortadaCathering"
    tipo="cathering"
    :titulo
    :navegacion="navegacion ?? []">
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
import { permisosProblemas } from '~/modulos/almacen/paginas/problemas/problemas.composable';
import { storePedido } from '@/modulos/pedidos/pedidos.store';
import { useQuasar } from 'quasar';

const props = defineProps({
  titulo: String,
  navegacion: Array
});

const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar();
const pedidoStore = storePedido();
if (authStore.getNegocio?.tipo !== 'CATHERING') {
  goTo(router, 'inicio');
}

const menuArea = [
  ['panaderia', 'bakery_dining'],
  ['reposteria', 'cake'],
  ['embotellados', 'liquor'],
  ['envasados', 'takeout_dining'],
  ['siinple', 'eco']
].map(area => {
  return {
    icon: area[1],
    label: 'Area ' + area[0],
    key: 'Area' + area[0],
    subMenu: [
      {
        icon: 'input',
        label: 'Recepcion',
        to: 'pedidoRecibir',
        params: { area: area[0] }
      },
      {
        icon: 'output',
        label: 'Despacho',
        to: 'pedidoDespachar',
        params: { area: area[0] }
      },
      {
        icon: 'menu_book',
        label: 'Ofertas',
        to: 'ofertas',
        params: { area: area[0] }
      },
      {
        icon: 'category',
        label: 'Catalogo',
        to: 'catalogos',
        params: { area: area[0] }
      }
    ]
  };
});
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
        icon: 'warning',
        label: 'Problemas de inventario',
        to: 'problemas',
        permisos: permisosProblemas
      }
    ]
  },
  {
    icon: 'menu_book',
    label: 'Puntos',
    key: 'ofertas',
    subMenu: [
      {
        icon: 'shopping_cart',
        label: 'Pedidos',
        to: 'listaPedidos'
      },
      {
        icon: 'menu_book',
        label: 'Ofertas',
        to: 'ofertas',
        params: { area: 'puntos' }
      },
      {
        icon: 'bi-cart-plus',
        label: 'Catalogo',
        to: 'catalogos',
        params: { area: 'puntos' }
      }
    ]
  },
  {
    icon: 'hail',
    label: 'Proveedores',
    key: 'AreaProveedores',
    subMenu: [
      {
        icon: 'input',
        label: 'Recepcion',
        to: 'pedidoRecibir',
        params: { area: 'proveedores' }
      },
      // {
      //   icon: 'menu_book',
      //   label: 'Ofertas',
      //   to: 'ofertas',
      //   params: { area: 'proveedores' }
      // },
      // {
      //   icon: 'bi-cart-plus',
      //   label: 'Catalogo',
      //   to: 'catalogos',
      //   params: { area: 'proveedores' }
      // },
      {
        icon: 'hail',
        label: 'Proveedores',
        to: 'proveedores',
        permisos: permisosProveedores
      }
    ]
  },
  ...menuArea,
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
