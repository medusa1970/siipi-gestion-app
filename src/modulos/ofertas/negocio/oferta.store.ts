/**
 * ofertaStore: Almacén de estado para la autenticación
 * Contiene información sobre el usuario autenticado, el token y el negocio seleccionado.
 */

import localforage from 'localforage';
import type { Catalogo, Oferta } from '../API/oferta.interface';
import { defineStore } from 'pinia';

interface OfertaStore {
  // oferta que se esta editando en el formulario detalle
  oferta: Oferta | null;
  // cache de la lista de los ofertas
  ofertas: Oferta[] | null;
  catalogoElegido: any | null;
  catalogos: Catalogo[] | null;
  categoriaOpciones: any[] | null;
}

export const storeOferta = defineStore('ofertas', {
  state: (): OfertaStore => ({
    oferta: null,
    ofertas: null,
    catalogoElegido: null,
    catalogos: null,
    categoriaOpciones: null,
  }),

  getters: {
    getOferta: (state) => state.oferta,
  },

  actions: {
    /**
     * Retorna la lista de los productos
     * Si no existe o si se indico refresh=true, lo obtiene de la API
     * @retorne Producto[]
     */
    async getOfertas() {
      this.ofertas = await localforage.getItem('ofertas');
      return this.ofertas as Oferta[];
    },
    /**
     * Agrega un producto
     * @retorne Producto
     */
    async addOferta(oferta: Oferta) {
      if (this.ofertas === null) {
        this.ofertas = await this.getOfertas();
      }
      // TODO si el id ya existe, reemplaza
      this.ofertas.push(oferta);
      return this.ofertas;
    },

    async actualizarOfertas() {
      const ofertasExistentes: any[] =
        (await localforage.getItem('ofertas')) || [];
    },
  },

  persist: {
    paths: ['oferta', 'categoriaOpciones'], // Solo persiste 'myPersistentState'
  },
});
