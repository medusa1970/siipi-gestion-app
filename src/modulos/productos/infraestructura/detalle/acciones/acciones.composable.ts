import { productoService } from '../../../API/productoService';
import { storeProducto } from '@/modulos/productos/negocio/producto.store';
import { useAuthStore } from '@/modulos/main/negocio/useAuthStore.js';
import { useQuasar } from 'quasar';
import type { Producto } from '#gql';
import { useProducto } from '@/modulos/productos/infraestructura/productos/productos.composable';
// import second from '@/modulos/productos/negocio/'

export const useDetalleAcciones = () => {
  const productoStore = storeProducto();
  const authStore = useAuthStore();
  const router = useRouter();
  const $q = useQuasar();
  const { actProductosDB } = useProducto();

  const estado = reactive({
    producto: {} as Producto,
    motivoEliminacion: '',
  });

  const borrarProducto = () => {
    $q.dialog({
      title: `Eliminar ${productoStore.producto.nombre}`,
      message: 'No se puede deshacer.',
      cancel: true,
      persistent: true,
    }).onOk(async () => {
      const productoBorrado = await productoService.borrarProducto(
        productoStore.producto._id,
        estado.motivoEliminacion,
        useGqlToken(authStore.token),
      );

      if (productoBorrado) {
        estado.motivoEliminacion = '';
        NotifySucessCenter('Producto eliminado correctamente');
        console.log(productoStore.producto._id);
        productoStore.productos = productoStore.productos.filter(
          (p) => p._id !== productoStore.producto._id,
        );
        // console.log(productoStore.productos);
      }

      // getAllProductos();
      // router.push('/cathering/productos');
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
    productoStore,
    authStore,
    estado,
    borrarProducto,
  };
};
