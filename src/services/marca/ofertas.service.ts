import { postData } from '../service.config';

export const ofertaService = {
  buscarOfertas: async () => postData(GqlOfertaBuscar({ busqueda: {} })),
  crearOferta: async (datos: any) => postData(GqlCrearOferta({ datos })),
  editarOferta: async (ofertaID: string, datos: any) =>
    postData(GqlModificarOfertas({ busqueda: { _id: ofertaID }, datos })),
  borrarOferta: async (ofertaID: string) =>
    postData(GqlBorrarOfertas({ busqueda: { _id: ofertaID } })),
  buscarProductos: async () =>
    postData(GqlOfertaProductoBuscar({ busqueda: {} })),
  crearIngredienteProducto: async (
    ofertaID: string,
    productoID: string,
    cantidad: number,
  ) =>
    GqlCrearIngredienteProducto({
      busqueda: { _id: ofertaID },
      datos: { producto: productoID, cantidad },
    }),
  editarIngredienteProducto: async (
    ofertaID: string,
    ingredienteID: string,
    producto: string,
    cantidad: number,
  ) =>
    postData(
      GqlEditarIngredienteProducto({
        busqueda: { _id: ofertaID },
        busquedaIngrediente: { _id: ingredienteID },
        datos: { producto, cantidad },
      }),
    ),
  buscarCatalogos: async () =>
    postData(
      GqlBuscarCatalogos({ busqueda: { nombre: 'Todos las catalogos' } }),
    ),
  buscarCatalogoID: async (catalogoID: string) =>
    postData(GqlBuscarCatalogos({ busqueda: { _id: catalogoID } })),
  crearCatalogo: async (nombre: string, catalogoID: string) =>
    postData(
      GqlCrearCatalogo({
        datos: { nombre, pariente: catalogoID, ofertas: [] },
      }),
    ),
  catalogoRecursivo: async (catalogoID: string) =>
    postData(GqlCatalogoOfertasRecursivo({ busqueda: { _id: catalogoID } })),
};
