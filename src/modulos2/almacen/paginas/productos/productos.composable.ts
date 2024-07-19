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
    },
    // si el producto esta incompleto
    productoIncompleto: null as string[] | null,
    // producto seleccionado para crear oferta
    productoSeleccionado: null,
  });

  /**
   * Rows para la tabla
   */
  const rowsTablaProductos = computed(() => {
    let filtered = store.productos;
    if (!filtered) return [];
    // filtro por categoria
    if (
      estado.filtros.categoriaSeleccionada != null &&
      estado.filtros.categoriaSeleccionada !== ''
    ) {
      filtered = filtered.filter((producto) =>
        estado.filtros.categoriaSeleccionada.includes(producto.categoria._id),
      );
    }
    // filtro por marca
    if (
      estado.filtros.marcaSeleccionada != null &&
      estado.filtros.marcaSeleccionada !== ''
    ) {
      filtered = filtered.filter((producto) =>
        producto.variedades
          .map((variedad) => variedad.marca._id)
          .includes(estado.filtros.marcaSeleccionada),
      );
    }
    // filtro por buscar que no discrimine maiusculas de minusculas y acentos
    if (estado.filtros.buscarFiltro != null) {
      const regex = new RegExp(`${estado.filtros.buscarFiltro}`, 'i');
      filtered = filtered.filter((producto) => {
        return regex.test(
          producto.nombre +
            producto.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
        );
      });
    }
    return filtered;
  });

  const handleProductoCreado = (producto) => {
    NotifySucessCenter('Producto creado éxitosamente');
    estado.modal.formProductoBasico = false;
  };

  const handleOfertaCreada = (oferta) => {
    NotifySucessCenter('Oferta creada éxitosamente');
    estado.modal.crearOferta = false;
  };
  return {
    estado,
    store,
    rowsTablaProductos,
    handleProductoCreado,
    handleOfertaCreada,
  };
};
