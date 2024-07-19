import { useAlmacen } from '~/modulos2/almacen/almacen.composable';
import { useQuasar } from 'quasar';

const initFormCrear = {
  marca: '',
  cantidadLimite: [0, 0],
  inventarioLimite: [0, 0],
  cantidadMaxPedido: 0,
};

export const useProductoVariedades = () => {
  const { store, estado: estadoAlmacen } = useAlmacen();
  const $q = useQuasar();

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
    estado.modal.formVariedadModificar = false;
    store.producto = producto;
  };

  const borrarProductoMarca = (variedad: any) => {
    // console.log(variedad);
    $q.dialog({
      title: `Eliminar ${variedad.marca.nombre}`,
      message: 'No se puede deshacer.',
      cancel: true,
      persistent: true,
    }).onOk(async () => {
      try {
        const productoVariedad = await api.modificarProducto_basico(
          store.producto._id,
          {
            variedades: {
              borrar: { _id: variedad._id },
            },
          },
          { loading: true },
        );
        console.log(productoVariedad);
        if (productoVariedad) {
          NotifySucessCenter('Marca borrado correctamente');
          store.producto.variedades = store.producto.variedades.filter(
            (e) => e._id !== variedad._id,
          );
          // console.log(productoStore.producto.variedades);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  return {
    estado,
    store,
    handleVariedadCreada,
    handleVariedadModificada,
    borrarProductoMarca,
  };
};
