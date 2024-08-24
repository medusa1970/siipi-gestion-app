import { useAlmacen } from '~/modulos/almacen/almacen.composable';
import { useQuasar } from 'quasar';

const initFormCrear = {
  marca: null,
  inventarioPeriodo: null,
  inventarioAviso: null,
  cantidadAvisoFuerte: null,
  cantidadAvisoSuave: null,
  cantidadMaxPedido: null
};

export const useProductoVariedades = () => {
  const { store, authStore, estadoAlmacen, router } = useAlmacen();
  const $q = useQuasar();

  const estado = reactive({
    // la variedad que se esta modificando
    variedad: null,
    // los dialogs
    modal: {
      formVariedadCrear: false,
      formVariedadModificar: false
    },
    // config de los filtros de la tabla
    filtros: {
      buscar: ''
    }
  });

  const handleVariedadCreada = (variedad, producto) => {
    NotifySucessCenter('Marca registrada éxitosamente');
    estado.modal.formVariedadCrear = false;
    store.producto = producto;
  };

  const handleVariedadModificada = (variedad, producto) => {
    NotifySucessCenter('Marca modificada éxitosamente');
    estado.modal.formVariedadModificar = false;
    store.producto = producto;
  };

  const borrarProductoMarca = (variedad: any) => {
    $q.dialog({
      title: `Eliminar ${variedad.marca.nombre}`,
      message: 'No se puede deshacer.',
      cancel: true,
      persistent: true
    }).onOk(async () => {
      try {
        const productoVariedad = await modificarUno(
          GqlModificarProductos_basico,
          {
            busqueda: store.producto._id,
            datos: {
              variedades: {
                borrar: { _id: variedad._id }
              }
            }
          }
        );
        if (productoVariedad) {
          NotifySucessCenter('Marca borrado correctamente');
          store.producto.variedades = store.producto.variedades.filter(
            e => e._id !== variedad._id
          );
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  return {
    estado,
    store,
    authStore,
    router,
    handleVariedadCreada,
    handleVariedadModificada,
    borrarProductoMarca
  };
};
