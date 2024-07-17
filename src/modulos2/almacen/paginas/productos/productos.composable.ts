import { useAlmacen } from '~/modulos2/almacen/almacen.composable';
import type { Categoria, Producto } from '#gql';

export const useProductos = () => {
  const { store } = useAlmacen();
  const estado = reactive({
    // lista de los productos a recuperar del store (promisa resuelta)
    productos: null as Producto[],
    // arbol de categoria a recuperar del store (promisa resuelta)
    arbolCategoria: null as Categoria,
    // config de los filtros de la tabla
    filtros: {
      categoriaOpciones: [],
      categoriaSeleccionada: '',
      marcaOpciones: [],
      marcaSeleccionada: '',
      buscarFiltro: '',
    },
    // dialogs
    modal: {
      formProductoBasico: false,
      crearOferta: false,
      alertaIncompleto: false,
      alertaIncompleto_params: [] as boolean[],
    },
    // producto seleccionado para crear oferta
    productoSeleccionado: null,
  });

  const handleProductoCreado = (producto) => {
    NotifySucessCenter('Producto creado éxitosamente');
    estado.modal.formProductoBasico = false;
  };

  const handleOfertaCreada = (oferta) => {
    estado.modal.crearOferta = false;
  };
  return {
    estado,
    store,
    handleProductoCreado,
    handleOfertaCreada,
  };
};
