<template>
  <layout-common
    :menuList="menu"
    :portada-img="PortadaPunto"
    tipo="punto"
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
import PortadaPunto from '@/assets/img/buddha.png';
import layoutCommon from '@/layouts/shared/layoutCommon.vue';
import { useAuthStore } from '~/modulos/main/useAuthStore';
import { storePedido } from '@/modulos/pedidos/pedidos.store';
import { useQuasar } from 'quasar';
import { permisosProveedores } from '~/modulos/almacen/paginas/proveedores/proveedores.composable';
import { permisosStock } from '~/modulos/almacen/paginas/stock/stock.composable';
import { permisosEmpleados } from '~/modulos/empresa/paginas/empleados/empleados';
import { permisosBloques } from '~/modulos/almacen/paginas/bloques/bloques.composable';
import { permisosProblemas } from '~/modulos/almacen/paginas/problemas/problemas.composable';

const $q = useQuasar();
const pedidoStore = storePedido();
const router = useRouter();
const authStore = useAuthStore();
if (authStore.getNegocio?.tipo !== 'PUNTO') {
  goTo(router, 'inicio');
}

const props = defineProps({
  titulo: String,
  navegacion: Array
});

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
        icon: 'shelves',
        label: 'Bloques',
        to: 'bloques',
        permisos: permisosBloques
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
    subMenu: [
      {
        icon: 'add_shopping_cart',
        label: 'Pedido',
        to: 'hacerPedido'
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
      }
    ]
  }
];
</script>
