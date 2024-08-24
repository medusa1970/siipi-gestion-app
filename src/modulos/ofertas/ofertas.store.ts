import type { Catalogo, Oferta } from '#gql';
import localforage from 'localforage';

interface storeProps {
  // colecciones
  ofertas: Oferta[] | null;
  catalogoArbol: Catalogo | null;
  // seleccionados
  oferta: Oferta | null;
}

export const storeOferta = defineStore('ofertas', {
  state: (): storeProps => ({
    ofertas: null,
    catalogoArbol: null,
    oferta: null
  }),

  actions: {
    /**
     * define la oferta actual que se esta modificando en pagina de detalles
     */
    async useOferta(id: string): Promise<Oferta> {
      if (!this.oferta || id !== this.oferta._id) {
        try {
          this.oferta = await buscarVarios(GqlBuscarOfertas, { busqueda: id });
        } catch (err) {
          errFailback(err);
        }
      }
      return this.oferta;
    },

    /**
     * Retorna la lista de los productos desde el indexedDb o desde la base
     * de datos si todavia no existe en el indexedDb
     */
    async getOfertas(actualizarDB: boolean = null): Promise<Oferta[]> {
      // if (actualizarDB === false && !store.ofertas) {
      //   return [];
      // }
      let ofertas = (await localforage.getItem('ofertas')) as Oferta[];
      if (actualizarDB !== false && (!ofertas || actualizarDB)) {
        try {
          ofertas = await buscarVarios(GqlBuscarOfertas, {
            opciones: { sort: '-_modificado -_creado' }
          });
          await localforage.setItem('ofertas', ofertas);
        } catch (err) {
          errFailback(err);
          return;
        }
      }
      this.ofertas = ofertas;
      return ofertas;
    },
    async refreshOfertas() {
      this.getOfertas(true);
    },

    /**
     * Retorna el arbol de catalogo
     */
    async getCatalogoArbol(
      id: string = null,
      opciones: { completo?: boolean } = {}
    ): Promise<Catalogo> {
      try {
        const gql = opciones.completo
          ? GqlCatalogoArbolCompleto
          : GqlCatalogoArbol;
        this.catalogoArbol = await buscarUno(gql, {
          busqueda: id ?? '65a447574b237c900167c41c'
        });
      } catch (err) {
        errFailback(err);
        return null;
      }
      return this.catalogoArbol;
    },
    getOne(id: string): Catalogo {
      if (this.catalogoArbol === null) return null;
      const f = catalogo => {
        if (catalogo._id === id) {
          return catalogo;
        } else if (catalogo.hijas) {
          for (const hija of catalogo.hijas) {
            const res = f(hija);
            if (res) return res;
          }
        } else {
          return null;
        }
      };
      return f(this.catalogoArbol);
    }
  },

  persist: {
    paths: ['oferta']
  }
});
