import type { Precio } from '#gql';
import { catalogoIds } from '~/modulos/ofertas/oferta.definicion';
import { useOfertas } from '~/modulos/ofertas/ofertas.composable';

export const usePrecioTab = () => {
  const $q = useQuasar();
  const { store } = useOfertas();

  const estado = reactive({
    precios: [] as any[],
    // precio que se esta modificando, o oferta
    configEdit: null as Precio,
    preciosProveedor: [],
    modal: {
      formCrearPrecio: false,
      formModificarPrecio: false
    }
  });

  onMounted(async () => {
    await store.getOfertas();
    // busquemos precios de proveedores
    const ofertasProveedor = store.ofertas.filter(oferta => {
      // debe estar en el catalogo proveedor
      if (oferta.catalogo._id !== catalogoIds.proveedores) {
        return false;
      }
      // debe tener un y solo un ingrediente
      if (oferta.ingredientes.length !== 1) {
        return false;
      }
      // debe tener un producto
      if (!store.oferta.ingredientes[0].producto) {
        return false;
      }
      // el producto debe ser el mismo que la oferta actual
      if (
        oferta.ingredientes[0].producto?._id !==
        store.oferta.ingredientes[0].producto?._id
      ) {
        return false;
      }
      return true;
    });
    console.log(ofertasProveedor);
    estado.preciosProveedor = ofertasProveedor.map(oferta => [
      oferta.precioSinFactura,
      oferta.precioConFactura
    ]);
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
        oferta = await modificarUno(GqlModificarOfertas, {
          busqueda: store.oferta._id,
          datos: {
            preciosPorMayor: {
              borrar: { _id: precio._id }
            }
          }
        });
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
