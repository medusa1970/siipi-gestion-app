import type { BuscarOfertaDto, CrearOfertaDto, ModificarOfertaDto } from '#gql';

export const ofertaService = {
  /**
   * Busca todas las ofertas
   * @returns Oferta[]
   */
  buscarOfertas: async () => extraer(await GqlBuscarOfertas({})),
  /**
   * retorna el arbol de los catalogos a partir de la raiz
   * @returns Catalogo (con sus hijas populadas)
   */
  buscarCatalogos: async () =>
    extraer(
      await GqlCatalogoArbol({
        busqueda: { nombre: ['CATALOGO RAIZ'] },
      }),
    ),
  /**
   * Crea una oferta
   * @returns Oferta
   */
  crearOferta: async (datos: CrearOfertaDto) =>
    extraerUno(
      await GqlCrearOfertas({
        datos,
        opciones: { populate: true },
      }),
    ),
  /**
   * Modifica una oferta con datos basicos
   * @returns Oferta
   */
  modificarOfertaBasica: async (
    busqueda: BuscarOfertaDto,
    datos: ModificarOfertaDto,
  ) =>
    extraerUno(
      await GqlModificarOfertaBasica({
        busqueda,
        datos,
        opciones: { populate: true },
      }),
    ),
};
