import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';
import { useAlmacen } from '~/modulos2/almacen/almacen.composable';
import { useQuasar } from 'quasar';
import type { Producto } from '#gql';

export const useProductoAcciones = () => {
  const { store, estado: estadoAlmacen, actProductosDB } = useAlmacen();
  const authStore = useAuthStore();
  const router = useRouter();
  const $q = useQuasar();

  const estado = reactive({
    producto: {} as Producto,
    motivoEliminacion: '',
  });

  const borrarProducto = () => {
    $q.dialog({
      title: `Eliminar ${store.producto.nombre}`,
      message: 'No se puede deshacer.',
      cancel: true,
      persistent: true,
    }).onOk(async () => {
      // borramos el producto
      try {
        await api.borrarProducto_basico(store.producto._id);
      } catch (err) {
        errFallBack(err);
        return;
      }

      // creamos la accion
      try {
        await api.crearAccion(
          {
            comentario: estado.motivoEliminacion,
            producto: store.producto._id,
            accion: 'borrado',
            // la persona va con el token
          },
          {
            aceptarInexistentes: true,
          },
          useGqlToken(authStore.token),
        );
      } catch (err) {
        errFallBack(err);
        return;
      }

      // esta todo ok
      NotifySucessCenter('Producto eliminado correctamente');
      estado.motivoEliminacion = '';
      store.productos = store.productos.filter(
        (p) => p._id !== store.producto._id,
      );
      store.producto = null;
      goTo(router, 'productos');
    });
  };

  const { $socket } = useNuxtApp();
  onMounted(() => {
    $socket.on('cambiosProductos', async (data: any) => {
      router.push('/cathering/productos');
      await actProductosDB();
    });
  });
  onBeforeUnmount(() => {
    $socket.off('cambiosProductos');
  });

  return {
    store,
    authStore,
    estado,
    borrarProducto,
  };
};
