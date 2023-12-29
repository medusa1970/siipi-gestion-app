import { GqlCategoriaBuscar } from '#gql';
import { postData } from '@/services/service.config';

export const productoService = {
  buscarProductos: async () =>
    postData(
      GqlBuscarProductos({
        busqueda: {}
      })
    ),
  borrarProducto: async (productoID: string) =>
    postData(GqlBorrarProducto({ busqueda: { _id: productoID } })),
  agregarProducto: async (datos: any) =>
    postData(
      GqlCrearProducto({
        datos
      })
    ),
  editarProducto: async (
    productoID: string | null | undefined,
    producto: any
  ) =>
    postData(
      GqlModificarProductos({
        busqueda: { _id: productoID },
        datos: producto
      })
    ),
  /**PRESNETACION */
  agregarPresentacion: async (
    productoID: string | undefined,
    preNombre: string,
    preCantidad: number
  ) =>
    postData(
      GqlAgregarPresentacion({
        busqueda: { _id: productoID },
        datos: {
          nombre: preNombre,
          cantidad: preCantidad
        }
      })
    ),
  editarPresentacion: async (
    productoID: string | undefined,
    preNombre: string,
    datos: any
  ) =>
    postData(
      GqlModificarPresentacion({
        busqueda: { _id: productoID },
        busquedaPresentacion: { nombre: preNombre },
        datos
      })
    ),
  borrarPresentacion: async (
    productoID: string | undefined,
    preNombre: string
  ) =>
    postData(
      GqlBorrarPresentacion({
        busqueda: { _id: productoID },
        busquedaPresentacion: { nombre: preNombre }
      })
    ),
  productoCambiarCategoria: async (productoID: string, categoriaID: string) =>
    postData(
      GqlProductoCambiarCategoria({
        busquedaProducto: { _id: productoID },
        busquedaCategoria: { _id: categoriaID }
      })
    ),
  buscarCategorias: async () => postData(GqlCategoriaBuscar({ busqueda: {} }))
};
