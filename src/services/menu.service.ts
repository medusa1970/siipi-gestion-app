import { postDataGql } from './service.config';

export const menuService = {
  /**
   * Lista de los menus de una entidad
   * @returns Menu[]
   */
  listarMenus: async (entidadID: string) => {
    const [entidad] = await postDataGql(
      GqlBuscarEntidades_menus({
        busqueda: { _id: [entidadID] },
        opciones: { limit: 1, errorSiVacio: true },
      }),
    );
    return entidad.menus;
  },

  /**
   * crear un menu en una entidad
   * @returns Menu
   */
  crearMenu: async (
    entidadID: string,
    catalogoID: string,
    exepciones: string[],
  ) => {
    const [entidad] = await postDataGql(
      GqlModificarEntidades_menus({
        busqueda: { _id: [entidadID] },
        datos: {
          menus: {
            agregar: {
              // @ts-expect-error estructura en backend
              catalogo: catalogoID,
              exepciones,
            },
          },
        },
        opciones: { limit: 1, errorSiVacio: true },
      }),
    );
    return entidad.menus[entidad.menus.length - 1];
  },

  /**
   * Listar todos los catalogos
   * @returns Catalogo (cons sus hijas populadas)
   *
   * TODO Seleccion del catalogo ?????????????
   */
  obtenerCatalogos: async () => {
    const catalogoArbol = await postDataGql(
      GqlCatalogoArbol2({
        busqueda: { nombre: ['CATALOGO RAIZ'] },
      }),
    );
    return catalogoArbol;
  },
};
