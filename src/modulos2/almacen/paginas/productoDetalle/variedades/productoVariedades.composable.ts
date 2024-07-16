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
    //ERROR llega undefined el producto revisar el emit,
    // console.log(producto);
    NotifySucessCenter('Producto modificada éxitosamente');
    estado.modal.formVariedadModificar = false;
    // store.producto = producto;
  };

  return {
    estado,
    store,
    handleVariedadCreada,
    handleVariedadModificada,
  };
};
