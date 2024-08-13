import type { Precio } from '#gql';
import { useOfertas } from '~/modulos/ofertas/ofertas.composable';

export const usePrecioTab = () => {
  const $q = useQuasar();
  const { store, authStore, estadoOfertas, router } = useOfertas();

  const estado = reactive({
    precios: [] as any[],
    // precio que se esta modificando, o oferta
    configEdit: null as Precio,
    modal: {
      formCrearPrecio: false,
      formModificarPrecio: false
    }
  });

  const borrarOfertaPrecio = async precio => {
    $q.dialog({
      title: `Eliminar este precio ?`,
      message: 'No se puede deshacer.',
      cancel: true,
      persistent: true
    }).onOk(async () => {
      let oferta;
      try {
        oferta = await api.modificarOferta(
          store.oferta._id,
          {
            preciosPorMayor: {
              borrar: { _id: precio._id }
            }
          },
          { loading: true }
        );
      } catch (err) {
        errFailback(err);
        return;
      }
      NotifySucessCenter('Precio borrado correctamente');
      store.oferta.preciosPorMayor = oferta.preciosPorMayor;
      await store.refreshOfertas();
    });
  };

  const handlePrecioCreado = async (precio, oferta) => {
    NotifySucessCenter('Precio creado correctamente');
    estado.modal.formCrearPrecio = false;
    store.oferta = oferta;
    await store.refreshOfertas();
  };
  const handlePrecioModificado = async (precio, oferta) => {
    NotifySucessCenter('Precio modificado correctamente');
    estado.modal.formModificarPrecio = false;
    store.oferta = oferta;
    await store.refreshOfertas();
  };

  return {
    estado,
    borrarOfertaPrecio,
    handlePrecioCreado,
    handlePrecioModificado,
    store
  };
};
