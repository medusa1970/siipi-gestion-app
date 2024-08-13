import type { Medida } from '#gql';
import type { SelectOpcion } from '~/components/input/select.interface';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';
import { useQuasar } from 'quasar';

export const useProductoMedidas = () => {
  const { store, authStore, estadoAlmacen, router } = useAlmacen();
  const $q = useQuasar();

  const estado = reactive({
    // la variedad que se esta modificando
    empaque: null,
    // lista de todas las medidas
    medidas: [] as Medida[],
    // medida seleccionada
    medidaId: null,
    // los dialogs
    modal: {
      formEmpaqueCrear: false,
      formEmpaqueModificar: false
    },
    // opciones del select de medidas
    medidaOpciones: [] as SelectOpcion[],
    // config de los filtros de la tabla
    filtros: {
      buscarFiltro: ''
    }
  });

  // guardar la medida basica tras hacer click en el boton guardar
  const formSubmit = async () => {
    let producto;
    try {
      producto = await api.modificarProducto_basico(store.producto._id, {
        medida: estado.medidaId
      });
    } catch (err) {
      errFailback(err);
      return;
    }
    NotifySucess('Medida guardada correctamente');
    store.producto.medida = producto.medida;
  };

  const handleEmpaqueCreado = (empaque, producto) => {
    NotifySucessCenter('Empaque creado éxitosamente');
    estado.modal.formEmpaqueCrear = false;
    store.producto = producto;
  };

  const handleEmpaqueModificado = (empaque, producto) => {
    NotifySucessCenter('Empaque modificade éxitosamente');
    estado.modal.formEmpaqueModificar = false;
    store.producto = producto;
  };

  const borrarProductoEmpaque = (empaque: any) => {
    $q.dialog({
      title: `Eliminar ${empaque.nombre}`,
      message: 'No se puede deshacer.',
      cancel: true,
      persistent: true
    }).onOk(async () => {
      try {
        const productoEmpaque = await api.modificarProducto_basico(
          store.producto._id,
          {
            empaques: {
              borrar: { _id: empaque._id }
            }
          },
          { loading: true }
        );
        if (productoEmpaque) {
          NotifySucessCenter('Empaque borrado correctamente');

          store.producto.empaques = store.producto.empaques.filter(
            e => e._id !== empaque._id
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
    formSubmit,
    handleEmpaqueModificado,
    handleEmpaqueCreado,
    borrarProductoEmpaque
  };
};
