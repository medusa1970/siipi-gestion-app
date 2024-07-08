import { storeProducto } from '@/modulos/productos/negocio/producto.store';
import { useAuthStore } from '@/modulos/main/negocio/useAuthStore.js';
import type {
  CrearEntidadDto,
  CrearMedidaDto,
  Entidad,
  Medida,
  Producto,
} from '#gql';
import { productoService } from '../API/productoService';

export const useProductoDetalle = () => {
  const productoStore = storeProducto();
  const authStore = useAuthStore();
  const service = productoService;

  const estado = reactive({
    producto: null as Producto,
    tab: 'datosBasicos',
  });

  /**
   * Agregar una medida
   */
  const crearMedida = async (datos: CrearMedidaDto): Promise<Medida> => {
    const medidaCreada = await productoService.crearMedida(datos);
    if (medidaCreada) {
      // productoStore.addCategoria(categoriaCreada);
    }
    return medidaCreada;
  };

  return {
    estado,
    crearMedida,
    productoStore,
    authStore,
    service,
  };
};
