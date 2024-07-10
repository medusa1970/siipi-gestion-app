// const useAuth = authStore();
interface Item {
  cantidad: number;
  oferta: string;
}

export const pedidoService = {
  /**
   * leerCatalogoConOfertas
   * @returns Catalogo (con hijas y ofertas populadas)
   */
  leerCatalogoConOfertas: async (puntoID: string, token?: any) => {
    const arbol = extraer(
      await GqlEntidadLeerMenu(
        {
          busqueda: { _id: [puntoID] },
          busquedaMenu: {},
          opciones: { limit: 1, errorSiVacio: true },
        },
        token,
      ),
    );
    return arbol;
  },
};
