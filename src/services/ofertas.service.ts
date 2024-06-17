import types from 'nuxt-quasar-ui';
import { postDataGql } from './service.config';

export const ofertaService = {
  /**
   * Busca todas las ofertas
   * @returns Oferta[]
   */
  obtenerTodasOfertas: async () => {
    const ofertas = await postDataGql(GqlBuscarOfertas({}));
    return ofertas;
  },

  /**
   * Crea una oferta
   * @returns Oferta
   */
  crearOferta: async (datos: any) => {
    const [nuevaOferta] = await postDataGql(
      GqlCrearOfertas({
        datos: [datos],
      }),
    );
    return nuevaOferta;
  },

  /**
   * modificar una oferta
   * @returns Oferta
   */
  editarOferta: async (ofertaID: string, datos: any) => {
    const [ofertaModificada] = await postDataGql(
      GqlModificarOfertas({
        busqueda: { _id: [ofertaID] },
        datos,
        opciones: { limit: 1, errorSiVacio: true },
      }),
    );
    return ofertaModificada;
  },

  /**
   * borrarOferta
   * @returns Oferta
   */
  borrarOferta: async (ofertaID: string) => {
    const [ofertaBorrada] = await postDataGql(
      GqlBorrarOfertas({
        busqueda: { _id: [ofertaID] },
        opciones: { limit: 1, errorSiVacio: true },
      }),
    );
    return ofertaBorrada;
  },

  /**
   * buscar todos los productos
   * @returns Producto[]
   */
  buscarProductos: async () => {
    const productos = await postDataGql(GqlBuscarProductos_oferta({}));
    return productos;
  },

  /**
   * Crear un ingrediente de producto
   * @returns Ingrediente
   */
  crearIngredienteProducto: async (
    ofertaID: string,
    productoID: string,
    cantidad: number,
  ) => {
    const producto = await postDataGql(
      GqlModificarOfertas({
        busqueda: { _id: [ofertaID] },
        datos: {
          ingredientes: {
            agregar: [
              {
                tipo: 'SIMPLE',
                producto: productoID,
                cantidad,
              },
            ],
          },
        },
        opciones: { limit: 1, errorSiVacio: true },
      }),
    );
    return producto['ingredientes'][producto['ingredientes'].length - 1];
  },

  /**ultimo(producto['ingredientes']);
   * modificar un ingrediente de producto
   * @returns Ingrediente
   */
  editarIngredienteProducto: async (
    ofertaID: string,
    ingredienteID: string,
    productoID: string,
    cantidad: number,
  ) => {
    const [producto] = await postDataGql(
      GqlModificarOfertas({
        busqueda: { _id: [ofertaID] },
        datos: {
          ingredientes: {
            buscar: { _id: [ingredienteID] },
            modificar: {
              producto: productoID,
              cantidad,
            },
          },
        },
        opciones: { limit: 1, errorSiVacio: true },
      }),
    );
    return producto['ingredientes'].find(
      // @ts-expect-error estructura en backend
      (ingrediente) => ingrediente._id.toString() === ingredienteID,
    );
  },

  /**
   * retorna el arbol de los catalogos a partir de la raiz
   * @returns Catalogo (con sus hijas populadas)
   */
  buscarCatalogos: async () => {
    const arbol = await postDataGql(
      GqlCatalogoArbol({
        busqueda: { _id: ['65a447574b237c900167c41c'] },
      }),
    );
    return arbol;
  },

  /**
   * retorna el arbol de los catalogos a partir de la raiz
   * pero solo sus ids y sus nombres
   * @returns Catalogo (con sus hijas populadas)
   */
  buscarCatalogosIdNombre: async () => {
    const arbol = await postDataGql(
      GqlCatalogoArbol2({
        busqueda: { _id: ['65a447574b237c900167c41c'] },
      }),
    );
    return arbol;
  },

  /**
   * Buscar catalogo por ID
   * @returns Catalogo
   */
  buscarCatalogoID: async (catalogoID: string) => {
    const arbol = await postDataGql(
      GqlCatalogoArbol({
        busqueda: { _id: [catalogoID] },
      }),
    );
    return arbol;
  },

  /**
   * Crear un catalogo
   * @returns Catalogo
   */
  crearCatalogo: async (nombre: string, catalogoID: string) => {
    const [nuevoCatalogo] = await postDataGql(
      GqlCrearCatalogos({
        datos: [
          {
            nombre,
            pariente: catalogoID,
          },
        ],
      }),
    );
    return nuevoCatalogo;
  },

  /**
   * Buscar todas las ofertas de un arbol de catalogos
   * @returns ofertas
   */
  catalogoRecursivo: async (catalogoID: string) => {
    const ofertas = await postDataGql(
      GqlCatalogoOfertasRecursivo({
        busqueda: { _id: [catalogoID] },
      }),
    );
    return ofertas;
  },
};
