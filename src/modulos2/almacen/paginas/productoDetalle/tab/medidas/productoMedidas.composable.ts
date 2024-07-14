import type { Medida, TipoEmpaque } from '#gql';
import type { SelectOpcion } from '~/components/input/select.interface';
import { useAlmacen } from '~/modulos2/almacen/almacen.composable';

export const useProductoMedidas = () => {
  const { store, estado: estadoAlmacen } = useAlmacen();
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
      formEmpaqueModificar: false,
    },
    // opciones del select de medidas
    medidaOpciones: [] as SelectOpcion[],
    // config de los filtros de la tabla
    filtros: {
      buscarFiltro: '',
    },
  });

  // guardar la medida basica tras hacer click en el boton guardar
  const formSubmit = async () => {
    let producto;
    try {
      producto = await api.modificarProducto_basico(store.producto._id, {
        medida: estado.medidaId,
      });
    } catch (err) {
      errFallBack(err);
      return;
    }
    NotifySucess('Medida guardada correctamente');
    store.producto.medida = estado.medidaId;
    // estado.selectTipoEmpaque = toSelect(medida.tipoEmpaques);
  };

  const handleEmpaqueCreado = (empaque, producto) => {
    NotifySucessCenter('Empaque creado éxitosamente');
    store.producto = producto;
    console.log('el empaque creada:', empaque);
    // TODO modificar productos y indexedDb
    estado.modal.formEmpaqueCrear = false;
  };

  const handleEmpaqueModificado = (empaque, producto) => {
    NotifySucessCenter('Empaque modificade éxitosamente');
    store.producto = producto;
    console.log('el empaque modificada:', empaque);
    // TODO modificar productos y indexedDb
    estado.modal.formEmpaqueModificar = false;
  };

  // manejar la marca creada desde el boton + del select
  const HandleMedidaCreada = (medida: any) => {
    console.log('Medida creada via select:', medida);
    // ...
  };

  // manejar la marca creada desde el boton + del select
  const HandleTipoEmpaqueCreado = (tipoEmpaque: any) => {
    console.log('tipoEmpaque creado via select:', tipoEmpaque);
    // ...
  };

  return {
    store,
    estado,
    HandleMedidaCreada,
    HandleTipoEmpaqueCreado,
    formSubmit,
    handleEmpaqueModificado,
    handleEmpaqueCreado,
  };
};
