import { postDataGql } from '../../services/service.config';
import gql from 'nuxt-graphql-client';
import useClient from 'nuxt-graphql-client';

export const productoService = {
  /**
   * Buscar todos los productos
   * @returns Producto
   */
  buscarProductos: async () => {
    const productos = await postDataGql(GqlBuscarProductos({}));
    return productos;
  },

  /**
   * Borrar un producto
   * @returns Producto
   */
  borrarProducto: async (productoID: string) => {
    const [producto] = await postDataGql(
      GqlBorrarProductos({
        busqueda: { _id: [productoID] },
      }),
    );
    return producto;
  },

  /**
   * Crear un nuevo producto
   * @returns Producto
   */
  agregarProducto: async (datos: any) => {
    const producto = await postDataGql(
      GqlCrearProductos({
        datos: [datos],
      }),
    );
    return producto;
  },

  /**
   * Modifica un producto
   * @returns Producto
   */
  editarProducto: async (productoID: string, datos: any) => {
    const [producto] = await postDataGql(
      GqlModificarProductos({
        busqueda: { _id: [productoID] },
        datos: datos,
        opciones: { limit: 1, errorSiVacio: true },
      }),
    );
    return producto;
  },

  /**
   * Agrega una presentacion a un producto
   */
  agregarPresentacion: async (
    productoID: string,
    preNombre: string,
    preCantidad: number,
  ) => {
    const [producto] = await postDataGql(
      GqlModificarProductos({
        busqueda: { _id: [productoID] },
        datos: {
          presentaciones: {
            agregar: [
              {
                nombre: preNombre,
                cantidad: preCantidad,
              },
            ],
          },
        },
        opciones: { limit: 1, errorSiVacio: true },
      }),
    );
    return producto.presentaciones[producto.presentaciones.length - 1];
  },

  /**
   * Modificar una presentacion
   * @returns Presentacion
   */
  editarPresentacion: async (
    productoID: string,
    preNombre: string,
    datos: any,
  ) => {
    const [producto] = await postDataGql(
      GqlModificarProductos({
        busqueda: { _id: [productoID] },
        datos: {
          presentaciones: {
            buscar: { nombre: preNombre },
            modificar: datos,
          },
        },
        opciones: { limit: 1, errorSiVacio: true },
      }),
    );
    return producto.presentaciones.find(
      // @ts-expect-error estructura en backend
      (presentacion) => presentacion.nombre === preNombre,
    );
  },

  /**
   * Borrar una presentacion
   * @returns Presentacion
   */
  borrarPresentacion: async (productoID: string, preNombre: string) => {
    const [producto] = await postDataGql(
      GqlModificarProductos({
        busqueda: { _id: [productoID] },
        datos: {
          presentaciones: {
            borrar: { nombre: preNombre },
          },
        },
        opciones: { limit: 1, errorSiVacio: true },
      }),
    );
    return true;
  },

  /**
   * Cambia la categoria de un producto
   * @returns Categoria
   */
  productoCambiarCategoria: async (productoID: string, categoriaID: string) => {
    const [producto] = await postDataGql(
      GqlModificarProductos_categoria({
        busqueda: { _id: [productoID] },
        datos: { categoria: categoriaID },
      }),
    );
    return producto.categoria;
  },

  /**
   * Busca todas las categorias
   * @returns Categoria[]
   */
  // buscarCategorias: async () => {
  //   const categorias = await postDataGql(GqlBuscarCategorias({}));
  //   return categorias;
  // },

  /**
   * Busca todas las categorias en forma de arbol
   * @returns Categoria[] (con sus hijas populadas)
   */
  obtenerTodasCategorias: async () => {
    const arbol = await postDataGql(
      GqlCategoriaArbol({
        busqueda: { nombre: 'CATEGORIA RAIZ' },
      }),
    );
    return arbol;
  },

  /**
   * Crear una categoria
   * @returns Categoria
   */
  crearCategoria: async (categoriaID: string, nombre: string) => {
    const categoria = await postDataGql(
      GqlCrearCategorias({
        datos: [
          {
            nombre,
            pariente: categoriaID,
          },
        ],
      }),
    );
    return categoria;
  },
};
