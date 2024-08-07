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

  // /**
  //  * Rows para la tabla
  //  */
  // const rowsTablaProductos = computed(() => {
  //   console.log('first');
  //   let filtered = store.productos;
  //   if (!filtered) return [];
  //   // filtro por completo
  //   if (estado.filtros.completud === 'soloCompletos') {
  //     filtered = filtered.filter(producto => !productoIncompleto(producto));
  //   }
  //   if (estado.filtros.completud == 'soloIncompletos') {
  //     filtered = filtered.filter(producto => productoIncompleto(producto));
  //   }
  //   // filtro por categoria
  //   if (
  //     estado.filtros.categoriaSeleccionada != null &&
  //     estado.filtros.categoriaSeleccionada !== ''
  //   ) {
  //     filtered = filtered.filter(producto =>
  //       estado.filtros.categoriaSeleccionada.includes(producto.categoria._id)
  //     );
  //   }
  //   // filtro por marca
  //   if (
  //     estado.filtros.marcaSeleccionada != null &&
  //     estado.filtros.marcaSeleccionada !== ''
  //   ) {
  //     filtered = filtered.filter(producto =>
  //       producto.variedades
  //         .map(variedad => variedad.marca._id)
  //         .includes(estado.filtros.marcaSeleccionada)
  //     );
  //   }
  //   // filtro por buscar que no discrimine maiusculas de minusculas y acentos

  //   if (estado.filtros.buscarFiltro != null) {
  //     console.log('first');
  //     const regex = new RegExp(`${estado.filtros.buscarFiltro}`, 'i');
  //     filtered = filtered.filter(producto => {
  //       return regex.test(
  //         producto.nombre +
  //           producto.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  //       );
  //     });
  //     console.log(filtered);
  //   }

  //   console.log(filtered);
  //   return filtered;
  // });

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
    // rowsTablaProductos,
    productoIncompleto,
    handleProductoCreado,
    handleOfertaSimpleCreada
  };
};
