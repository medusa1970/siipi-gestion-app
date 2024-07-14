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
    },
  });

  return {
    estado,
    store,
  };
};
