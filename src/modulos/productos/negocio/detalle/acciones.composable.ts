import { productoService } from '../../API/productoService';
import { storeProducto } from '@/modulos/productos/negocio/producto.store';
import { useAuthStore } from '@/modulos/main/negocio/useAuthStore.js';
import { useQuasar } from 'quasar';
import type { Producto } from '#gql';

export const useDetalleAcciones = () => {
  const productoStore = storeProducto();
  const authStore = useAuthStore();
  const router = useRouter();
  const $q = useQuasar();

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
      productoService
        .borrarProducto(
          productoStore.producto._id,
          estado.motivoEliminacion,
          useGqlToken(authStore.token),
        )
        .then(() => {
          estado.motivoEliminacion = '';
          NotifySucess('Producto eliminado correctamente');
        });
      // getAllProductos();
      router.push('/cathering/productos');
    });
  };

  return {
    productoStore,
    authStore,
    estado,
    borrarProducto,
  };
};
