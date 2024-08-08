import type { Producto } from '#gql';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';

/**
 * Permisos requeridos para esta pagina
 */
export const permisosProductos = ['ADQUISICION', 'LOGISTICA', 'ALMACEN'];

/**
 * Composable
 */
export const useProductos = () => {
  const { store, authStore, router, productoIncompleto } = useAlmacen();
  if (!authStore.autorizar(permisosProductos)) goTo(router, 'noAutorizado');

  const estado = reactive({
    // lista de los productos a recuperar del store (promisa resuelta)
    productos: null as Producto[],
    // config de los filtros de la tabla
    filtros: {
      categoriaOpciones: [],
      categoriaSeleccionada: '',
      marcaOpciones: [],
      marcaSeleccionada: '',
      buscarFiltro: '',
      completud: 'todos'
    },
    // dialogs
    modal: {
      formProductoBasico: false,
      crearOferta: false,
      alertaIncompleto: false
    },
    // si el producto esta incompleto
    productoIncompleto: null as string[] | null,
    // producto seleccionado para crear oferta
    productoSeleccionado: null
  });

  const handleProductoCreado = producto => {
    NotifySucessCenter('Producto creado éxitosamente');
    estado.modal.formProductoBasico = false;
  };
  const handleOfertaSimpleCreada = oferta => {
    NotifySucessCenter('Oferta creada éxitosamente');
    estado.modal.crearOferta = false;
  };

  return {
    estado,
    store,
    authStore,
    router,
    productoIncompleto,
    handleProductoCreado,
    handleOfertaSimpleCreada
  };
};
