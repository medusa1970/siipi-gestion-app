/**
 * ofertaStore: Almacén de estado para la autenticación
 * Contiene información sobre el usuario autenticado, el token y el negocio seleccionado.
 */

import type { Catalogo, Oferta } from '#gql';
import localforage from 'localforage';
import { defineStore } from 'pinia';
import { apiOfertas } from '../ofertas/API/ofertas.api';

interface storeProps {
  ofertas: Oferta[] | null;
  catalogoArbol: Catalogo | null;

  oferta: Oferta | null;
  catalogoSeleccionado: Catalogo | null;
}

export const storeOferta = defineStore('ofertas', {
  state: (): storeProps => ({
    ofertas: null,
    catalogoArbol: null,

    oferta: null,
    catalogoSeleccionado: null,
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
    async getCatalogos(id: string = null): Promise<Catalogo> {
      // recuperar el arbol raiz
      if (this.catalogoArbol === null) {
        try {
          this.catalogoArbol = await apiOfertas.buscarArbolCatalogosRaiz();
        } catch (err) {
          errFallBack(err);
          return null;
        }
      }
      // para recuperar el catalogo especifica
      const f = (catalogo) => {
        if (catalogo._id === id) {
          return catalogo;
        } else if (catalogo.hijas) {
          for (const hija of catalogo.hijas) {
            const res = f(hija);
            if (res) return res;
          }
        } else {
          return 'null';
        }
      };
      return id === null ? this.catalogoArbol : f(this.catalogoArbol);
    },
    refreshCatalogos(): void {
      this.catalogoArbol = null;
      this.getCatalogos();
    },
  },

  persist: {
    paths: ['oferta', 'catalogoOpciones', 'catalogoSeleccionado'], // Solo persiste 'myPersistentState'
  },
});
