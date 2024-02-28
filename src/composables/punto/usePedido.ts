import { ref, reactive, onMounted } from 'vue';
import {
  NotifyError,
  NotifySucess,
  hideLoading,
  showLoading,
} from '~/helpers/message.service';
import { useQuasar } from 'quasar';
import { pedidoService } from '@/services/punto/pedido.service';
import { authStore } from '@/stores/auth.store';
/**
 * LOGICA
 */
export const usePedido = () => {
  const useAuth = authStore();
  const estado = reactive({
    catalogosOfertas: [],
    modal: {
      isAddOferta: false,
    },
    isEditCantidad: false,
  });

  const obtenerCatalogosProductos = async () => {
    const { entidadLeerMenu } = await pedidoService.leerCatalogoConOfertas(
      useAuth.negocioElegido._id,
    ); //@ts-ignore
    estado.catalogosOfertas = [entidadLeerMenu];
  };

  return {
    useAuth,
    estado,
    obtenerCatalogosProductos,
  };
};
