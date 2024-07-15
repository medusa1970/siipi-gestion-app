import { useAlmacen } from '~/modulos2/almacen/almacen.composable';

const initFormCrear = {
  marca: '',
  cantidadLimite: [0, 0],
  inventarioLimite: [0, 0],
  cantidadMaxPedido: 0,
};

export const useProductoVariedades = () => {
  const { store, estado: estadoAlmacen } = useAlmacen();
  const estado = reactive({
    // la variedad que se esta modificando
    variedad: null,
    // los dialogs
    modal: {
      formVariedadCrear: false,
      formVariedadModificar: false,
    },
    // config de los filtros de la tabla
    filtros: {
      buscarFiltro: '',
    },
  });

  const handleVariedadCreada = (variedad, { pariente: producto }) => {
    NotifySucessCenter('Producto creado éxitosamente');
    store.producto = producto;
    estado.modal.formVariedadCrear = false;
  };

  const handleVariedadModificada = (variedad, { pariente: producto }) => {
    NotifySucessCenter('Producto modificada éxitosamente');
    store.producto = producto;
    estado.modal.formVariedadModificar = false;
  };

  return {
    estado,
    store,
    handleVariedadCreada,
    handleVariedadModificada,
  };
};