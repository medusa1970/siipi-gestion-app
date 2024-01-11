import { postData } from '../service.config';

export const ofertaService = {
  buscarOfertas: async () => postData(GqlOfertaBuscar({ busqueda: {} })),
  crearOferta: async (datos: any) => postData(GqlCrearOferta({ datos })),
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
};
