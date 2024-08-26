<template>
  <div>
    <p>Indica el motivo por cual desea borrar este producto:</p>
    <input-text
      tipo="textarea"
      label="Motivo"
      @update="(v) => (estado.motivoEliminacion = v as string)"
      info="El jefe de logistica recibira una notificacion cuando elimines un producto"
      requerido />
    <q-btn
      color="primary"
      label="Confirmar"
      :disable="estado.motivoEliminacion === ''"
      no-caps
      @click="borrarProducto()" />
  </div>
</template>

<script setup lang="ts">
import { useAlmacen } from '~/modulos/almacen/almacen.composable';
const { store, router } = useAlmacen();
const props = defineProps({
  productoCorriente: null
});
const $q = useQuasar();
const estado = reactive({
  motivoEliminacion: ''
});

const borrarProducto = () => {
  $q.dialog({
    title: `Eliminar ${props.productoCorriente.nombre}`,
    message: 'No se puede deshacer.',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    // borramos el producto
    try {
      await borrarUno(GqlBorrarProductos_basico, {
        busqueda: props.productoCorriente._id
      });
    } catch (err) {
      errFailback(err);
      return;
    }
    await store.refreshProductos();

    // creamos la accion
    try {
      await crearUno(GqlCrearAcciones, {
        datos: {
          comentario: estado.motivoEliminacion,
          producto: props.productoCorriente._id,
          accion: 'borrado'
          // la persona va con el token
        },
        opciones: {
          aceptarInexistentes: true
        }
      });
    } catch (err) {
      errFailback(err);
      return;
    }

    // esta todo ok
    NotifySucessCenter('Producto eliminado correctamente');
    estado.motivoEliminacion = '';
    store.productos = store.productos.filter(p => p._id !== store.producto._id);
    goTo(router, 'productos');
  });
};
</script>
