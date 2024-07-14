import { productoService } from '../../../API/productoService';
import { storeProducto } from '@/modulos/productos/negocio/producto.store';

export const useDetalleOfertas = () => {
  const store = storeProducto();
  const service = productoService;

  const estado = reactive({});

  return {
    store,
    service,
    estado,
  };
};
