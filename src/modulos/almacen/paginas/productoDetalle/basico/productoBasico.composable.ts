import type { CrearProductoDto } from '#gql';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';

const initForm = {
  nombre: '',
  categoria: '',
  comentario: '',
  puedeVencer: false,
  vencimientoLimite: [0, 0] as [number, number],
  imagen: null,
} as CrearProductoDto;

export const useProductoBasico = () => {
  const { store, estado: estadoAlmacen } = useAlmacen();
  const estado = reactive({
    dataForm: clone(initForm),
    errorNombre: '',
    catOpciones: [],
  });

  const handleProductoModificado = (producto) => {
    NotifySucessCenter('Producto modificado correctamente');
    store.producto = producto;
  };

  return {
    store,
    estado,
    handleProductoModificado,
  };
};
