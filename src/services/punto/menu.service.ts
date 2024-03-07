import { postData } from '@/services/service.config';

export const menuService = {
  listarMenus: async (entidadID: string | null | undefined) =>
    postData(
      GqlBuscarMenusEntidad({ busqueda: { _id: entidadID }, busquedaMenu: {} }),
    ),
  crearMenu: async (
    entidadID: string | null | undefined,
    catalogoID: string,
    exepciones: string[],
  ) =>
    postData(
      GqlCrearMenuEntidad({
        busqueda: { _id: entidadID },
        datos: { catalogo: catalogoID, exepciones },
      }),
    ),
  obtenerCatalogos: async () =>
    postData(GqlObtenerTodosCatalogos({ busqueda: {} })),
};
