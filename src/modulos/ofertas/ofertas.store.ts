import type { Catalogo, Oferta } from '#gql';
import localforage from 'localforage';
import { idCatalogoRaiz } from './oferta.definicion';

interface storeProps {
  // colecciones
  ofertas: Oferta[] | null;
  catalogoArbol: Catalogo | null;
  // seleccionados
  oferta: Oferta | null;
  catalogoParaVolver?: string;
}

export const storeOferta = defineStore('ofertas', {
  state: (): storeProps => ({
    ofertas: null,
    catalogoArbol: null,
    oferta: null
  }),

  actions: {
    /**
     * Retorna la lista de los productos desde el indexedDb o desde la base
     * de datos si todavia no existe en el indexedDb
     */
    async getOfertas(actualizarDB: boolean = null): Promise<Oferta[]> {
      let ofertas = (await localforage.getItem('ofertas')) as Oferta[];
      if (!ofertas || actualizarDB) {
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
    async refreshOfertas(): Promise<void> {
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
          busqueda: id ?? idCatalogoRaiz,
          opciones: { limit: 0 }
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
