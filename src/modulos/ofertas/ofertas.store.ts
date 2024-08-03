import type { Catalogo, Oferta } from '#gql';
import localforage from 'localforage';
import { apiOfertas } from '../ofertas/API/ofertas.api';

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
    oferta: null,
  }),

  getters: {},

  actions: {
    /**
     * Retorna la lista de los productos desde el indexedDb o desde la base
     * de datos si todavia no existe en el indexedDb
     */
    async getOfertas(actualizarDB = false): Promise<Oferta[]> {
      this.ofertas = (await localforage.getItem('ofertas')) as Oferta[];
      if (!this.ofertas || actualizarDB) {
        try {
          this.ofertas = await api.buscarOfertas(
            {},
            { sort: '-_modificado -_creado' },
          );
          await localforage.setItem(
            'ofertas',
            JSON.parse(JSON.stringify(this.ofertas)),
          );
        } catch (err) {
          errFallBack(err);
          return;
        }
      }
      return this.ofertas;
    },
    async refreshOfertas() {
      this.getOfertas(true);
    },

    /**
     * Retorna el arbol de catalogo
     */
    async getCatalogoArbol(id: string = null): Promise<Catalogo> {
      if (this.catalogoArbol === null) {
        try {
          this.catalogoArbol = await apiOfertas.buscarArbolCatalogosRaiz();
        } catch (err) {
          errFallBack(err);
          return null;
        }
      }
      return id == null ? this.catalogoArbol : this.getOne(id);
    },
    async refreshCatalogoArbol(id: string = null): Promise<Catalogo> {
      this.catalogoArbol = null;
      return await this.getCatalogoArbol(id);
    },
    getOne(id: string): Catalogo {
      if (this.catalogoArbol === null) return null;
      const f = (catalogo) => {
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
    },
  },

  persist: {
    paths: ['oferta', 'catalogoOpciones', 'catalogoSeleccionado'], // Solo persiste 'myPersistentState'
  },
});
