<template>
  <NuxtLayout
    :name="authStore.getNegocio.tipo === 'PUNTO' ? 'punto' : 'cathering'"
    :titulo="'Recepcion (' + estado.area.nombre + ')'"
    :navegacion="[{ label: 'Realizar pedido', to: 'pedido' }]">
    <formPedido
      :catalogo="estado.catalogo"
      :comprador="authStore.negocio._id"
      :vendedor="estado.area.id"
      @pedidoHecho="handlePedido"
      :key="estado.catalogo"
      :recibirDirectamente="true" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import formPedido from '@/modulos/ofertas/forms/formPedido.vue';
import { useOfertas } from '~/modulos/ofertas/ofertas.composable';
import { areaInfo } from '../../oferta.definicion';
import { permisosPedidoArea } from './pedidoArea';
const { authStore, router, route } = useOfertas();

/**
 * Permisos
 */
if (!authStore.autorizar(permisosPedidoArea)) goTo(router, 'noAutorizado');

/**
 * Reactive
 */
const estado = reactive({
  catalogo: null,
  area: null
});

/**
 * Hooks
 */
onBeforeMount(async () => {
  estado.area = areaInfo[route.params.area as string];
  if (!estado.area) {
    goTo(router, '404');
  }
  try {
    await loadingAsync(async () => {
      estado.catalogo = await buscarUno(GqlCatalogoArbolCompleto, {
        busqueda: estado.area.catalogo,
        opciones: { limit: 0 }
      });
    });
  } catch (err) {
    errFailback(err);
  }
});

/**
 * Logica
 */
const handlePedido = async pedido => {
  // console.log('handlePedido');
  // try {
  //   loadingAsync(async () => {
  //     pedido = await modificarUno(GqlCambiarEstadoItems, {
  //       busqueda: pedido._id,
  //       estado: { estado: 'confirmado' }
  //     }); //.then(() =>
  //     pedido = await modificarUno(GqlCambiarEstadoItems, {
  //       busqueda: pedido._id,
  //       estado: { estado: 'aceptado' }
  //     }); //.then(() =>
  //     pedido = await modificarUno(GqlCambiarEstadoItems, {
  //       busqueda: pedido._id,
  //       estado: { estado: 'preparado' }
  //     }); //.then(() =>
  //     pedido = await modificarUno(GqlCambiarEstadoItems, {
  //       busqueda: pedido._id,
  //       estado: { estado: 'recibido' }
  //     });
  //   });
  // } catch (err) {
  //   errFailback(err);
  //   return;
  // }
  // NotifySucessCenter('Pedido recibido con éxito');
};
</script>
