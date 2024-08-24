import { useAuthStore } from '~/modulos/main/useAuthStore';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';
import { useQuasar } from 'quasar';
import type { Producto } from '#gql';

export const useProductoAcciones = () => {
  const { store, authStore, estadoAlmacen, router } = useAlmacen();
  const $q = useQuasar();

  const estado = reactive({
    producto: {} as Producto,
    motivoEliminacion: ''
  });

  const borrarProducto = () => {
    $q.dialog({
      title: `Eliminar ${store.producto.nombre}`,
      message: 'No se puede deshacer.',
      cancel: true,
      persistent: true
    }).onOk(async () => {
      // borramos el producto
      try {
        await borrarUno(GqlBorrarProductos_basico, {
          busqueda: store.producto._id
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
            producto: store.producto._id,
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
      store.productos = store.productos.filter(
        p => p._id !== store.producto._id
      );
      store.producto = null;
      goTo(router, 'productos');
    });
  };

  return {
    estado,
    store,
    authStore,
    router,
    borrarProducto
  };
};
