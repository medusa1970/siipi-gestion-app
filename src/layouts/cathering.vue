<template>
  <layout-common :menuList="menu" :portada-img="PortadaCathering" cathering>
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
import { permisosCatalogos } from '~/modulos/ofertas/paginas/catalogos/catalogos.composable';
import { permisosOfertas } from '~/modulos/ofertas/paginas/ofertas/ofertas.composable';
import { permisosProblemas } from '~/modulos/almacen/paginas/problemas/problemas.composable';
import { storePedido } from '@/modulos/pedidos/pedidos.store';
import { useQuasar } from 'quasar';
import { apiPedido } from '@/modulos/pedidos/API/pedidos.api';

const authStore = useAuthStore();
console.log(authStore);
const router = useRouter();
const $q = useQuasar();
const pedidoStore = storePedido();
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
        label: 'lista Pedidos',
        to: 'listaPedidos'
      },
      {
        icon: 'shopping_cart',
        label: 'recibir pedidos',
        to: 'recibirPedidos'
      },
      {
        icon: 'shopping_cart',
        label: 'despachar pedidos',
        to: 'despacharPedidos'
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
      const pedido = await apiPedido.pedidoIniciar(
        {
          comprador: authStore.negocio._id,
          vendedor: pedidoStore.area._id,
          items
        },
        {},
        authStore.token
      );
      console.log(pedido);
      if (pedido) {
        console.log('first');
        const a = await apiPedido.pedidoConfirmarItems(
          {
            _id: pedido._id
          },
          authStore.token
        );
        console.log(a);
        const b = await apiPedido.pedido_prepararOfertas(pedido._id);
        console.log(b);
        const c = await apiPedido.pedido_aceptarOfertas(pedido._id);
        console.log(c);
        const d = await apiPedido.pedido_recibirOfertas(pedido._id);
        console.log(d);
        NotifySucessCenter('Pedido recibido con éxito');
        router.push('/cathering/pedidos/listaPedidos');
        pedidoStore.listaPedido = [];
      } else NotifyError('Error al realizar el pedido');

      // console.log(pedidoStore.listaPedido);
    } else {
      // SE DESPACHA PRODUCTO
      const pedido = await pedidoService.pedidoIniciar(
        pedidoStore.areaPedidoID,
        storeAuth.negocioElegido._id,
        items,
        useGqlToken(storeAuth.token)
      );
      // console.log(pedido);
      if (pedido) {
        await apiPedido.pedidoConfirmarItems({
          _id: pedido._id
        });
        await apiPedido.pedido_aceptarOfertas(pedido._id);
        await apiPedido.pedido_prepararOfertas(pedido._id);
        await apiPedido.pedido_recibirOfertas(pedido._id);
        NotifySucessCenter('Pedido realizado con éxito');
        router.push('/cathering/pedidos/listaPedidos');
        pedidoStore.listaPedido = [];
      } else NotifyError('Error al realizar el pedido');
    }
  });
};
</script>
