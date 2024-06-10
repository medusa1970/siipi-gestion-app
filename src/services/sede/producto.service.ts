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
        busqueda: { nombre: ['CATEGORIA RAIZ'] },
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
  /**
   * Crear una producto con datos basicos
   * @returns Producto
   */
  crearProductoBasico: async (datos: {
    nombre: string;
    categoria: string;
    comentario: string;
    imagen?: { data: any; mimetype: string };
  }) => {
    console.log(datos);
    const producto = await postDataGql(
      GqlCrearProductosBasicos({
        datos,
      }),
    );
    return producto;
  },

  // copilot quiero hacer servicio para modificar producto basico
  /**
   * Modifica un producto basico
   * @returns Producto
   */
  modificarProductoBasico: async (
    productoID: string,
    datos: {
      nombre: string;
      categoria: string;
      comentario: string;
      imagen?: { data: any; mimetype: string };
    },
  ) => {
    const producto = await postDataGql(
      GqlModificarProductosBasicos({
        busqueda: { _id: [productoID] },
        datos,
      }),
    );
    return producto;
  },
  agregarProductosMarca: async (
    productoID: string,
    productoMarca: {
      imagen: { data: any; mimetype: string };
      marca: string;
      cantidadMax: number;
      cantidadMin: number;
    },
  ) => {
    const res = await postDataGql(
      GqlModificarProductosMarca({
        busqueda: { _id: [productoID] },
        datos: {
          variedades: {
            agregar: [productoMarca],
          },
        },
        opciones: { populate: true },
      }),
    );
    return res;
  },
  agregarProductosMedidaEmpaque: async (
    productoID: string,
    empaque: {
      marca: string;
      nombre: string;
      abreviacion: string;
      cantidad: number;
    },
  ) => {
    console.log(productoID, empaque);
    const res = await postDataGql(
      GqlModificarProductosMedidaEmpaque({
        busqueda: { _id: [productoID] },
        datos: {
          empaques: {
            agregar: [empaque],
          },
        },
      }),
    );
    return res;
  },
  /**
   * MARCA PRODUCTOS
   */
  crearMarca: async (datos: { nombre: string }) =>
    await postDataGql(GqlCrearMarcas({ datos })),
  buscarMarcas: async () => postDataGql(GqlBuscarMarcas()),

  /**
   * MEDIDAS PRODUCTOS
   */
  crearMedida: async (datos: { nombre: string }) =>
    await postDataGql(GqlCrearMedidas({ datos })),
  buscarMedidas: async () => postDataGql(GqlBuscarMedidas()),
  agregarEmpaqueMedida: async (
    medidaID: string,
    empaque: { nombre: string; abreviacion: string },
  ) => {
    const res = await postDataGql(
      GqlModificarMedidas({
        busqueda: { _id: [medidaID] },
        datos: {
          tipoEmpaques: {
            agregar: [empaque],
          },
        },
      }),
    );
    return res;
  },
  /**
   * PROVEEDORES PRODUCTO
   */
  buscarEntidadesProveedor: async () =>
    postDataGql(
      GqlBuscarEntidadesProveedor({
        busqueda: {
          tipo: ['PROVEEDOR'],
        },
      }),
    ),
  crearEntidadProveedor: async (datos: {
    nombre: string;
    tipo?: string;
    descripcion: string;
  }) => {
    const datosDefecto = { ...datos, tipo: 'PROVEEDOR' };
    return postDataGql(GqlCrearEntidadProveedor({ datos: datosDefecto }));
  },
};
