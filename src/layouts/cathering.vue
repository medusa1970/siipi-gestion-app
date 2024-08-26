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
  'panaderia',
  'reposteria',
  'embotellados',
  'envasados',
  'siinple'
].map(area => {
  return {
    icon: 'shopping_cart',
    label: 'Area ' + area,
    key: 'Area' + area,
    subMenu: [
      {
        icon: 'bi-cart-plus',
        label: 'Recepcion',
        to: 'pedidoRecibir',
        params: { area }
      },
      {
        icon: 'bi-cart-plus',
        label: 'Despacho',
        to: 'pedidoDespachar',
        params: { area }
      },
      {
        icon: 'menu_book',
        label: 'Ofertas',
        to: 'ofertas',
        params: { area }
      },
      {
        icon: 'bi-cart-plus',
        label: 'Catalogo',
        to: 'catalogos',
        params: { area }
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
    icon: 'shopping_cart',
    label: 'Proveedores',
    key: 'AreaProveedores',
    subMenu: [
      {
        icon: 'bi-cart-plus',
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
/*
const realizarPedido = async () => {
  const items = pedidoStore.listaPedido.map(p => ({
    ofertaId: p.id,
    cantidad: parseInt(p.cantidad)
  }));

  $q.dialog({
    // title: `Eliminar ${row.nombre}`,
    message: '¿Estas seguro de aceptar este pedido?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    if (pedidoStore.isDespachar == false) {
      // RECIBE PEDIDO
      const pedido = await crearUno(GqlIniciarPedido, {
        datos: {
          comprador: authStore.negocio._id,
          vendedor: pedidoStore.area._id,
          items
        }
      });

      if (pedido) {
        await apiPedido.pedidoConfirmarItems({ _id: pedido._id });
        await apiPedido.pedido_aceptar(pedido._id);
        await apiPedido.pedido_preparar(pedido._id);
        await apiPedido.pedido_recibirOfertas(pedido._id);
        NotifySucessCenter('Pedido recibido con éxito');
        // router.push('/cathering/pedidos/listaPedidos');
        pedidoStore.listaPedido = [];
      } else NotifyError('Error al realizar el pedido');

      // console.log(pedidoStore.listaPedido);
    } else {
      // SE DESPACHA PRODUCTO
      const pedido = await crearUno(GqlIniciarPedido, {
        datos: {
          comprador: pedidoStore.area._id,
          vendedor: authStore.negocio._id,
          items
        }
      });

      if (pedido) {
        await apiPedido.pedidoConfirmarItems({ _id: pedido._id });
        await apiPedido.pedido_aceptar(pedido._id);
        await apiPedido.pedido_preparar(pedido._id);
        await apiPedido.pedido_recibirOfertas(pedido._id);
        NotifySucessCenter('Pedido despachado con éxito');
        // router.push('/cathering/pedidos/listaPedidos');
        pedidoStore.listaPedido = [];
      } else NotifyError('Error al realizar el pedido');
    }
  });
}; */
</script>
