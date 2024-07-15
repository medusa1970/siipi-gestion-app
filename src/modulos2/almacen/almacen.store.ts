import type { Catalogo, Categoria, Producto } from '#gql';
import localforage from 'localforage';

interface storeProps {
  // producto que se esta editando en el formulario detalle
  producto: Producto | null;
  // cache de la lista de los productos
  productos: Producto[] | null;
  // arboles
  categoriaArbol: Categoria | null;
  catalogoArbol: Catalogo | null;
  // si se tiene que refrescar el arbol (se agrego una categoria por cierto)
  refreshArbol: boolean;
}

export const storeAlmacen = defineStore('almacen', {
  state: (): storeProps => ({
    producto: null,
    productos: [],
    refreshArbol: true,
    categoriaArbol: null,
    catalogoArbol: null,
  }),

  getters: {
    /**
     * Retorna el arbol de categoria
     * Si no existe o si se indico refresh=true, lo obtiene de la API
     * @retorne Categoria con sus hijas populadas
     */
    getCategoriaArbol: (state) => {
      return async (refresh: boolean = false): Promise<Categoria> => {
        if (state.categoriaArbol === null || state.refreshArbol) {
          try {
            state.categoriaArbol = await api.buscarArbolCategorias({
              nombre: ['CATEGORIA RAIZ'],
            });
            state.refreshArbol = false;
          } catch (err) {
            errFallBack(err);
            return null;
          }
        }
        return state.categoriaArbol;
      };
    },
    /**
     * Retorna el arbol de catalogos
     * Si no existe o si se indico refresh=true, lo obtiene de la API
     * @retorne Catalogo con sus hijas populadas
     */
    getCatalogoArbol: (state) => {
      return async (refresh: boolean = false): Promise<Catalogo> => {
        if (state.catalogoArbol === null || state.refreshArbol) {
          try {
            state.catalogoArbol = await api.buscarArbolCatalogos({
              nombre: ['CATALOGO RAIZ'],
            });
            state.refreshArbol = false;
          } catch (err) {
            errFallBack(err);
            return null;
          }
        }
        console.log(0, state.catalogoArbol);
        return state.catalogoArbol;
      };
    },
  },

  actions: {
    /**
     * Retorna la lista de los productos desde el indexedDb o desde la base
     * de datos si todavia no existe en el indexedDb
     */
    async getProductos(): Promise<Producto[]> {
      let productos = (await localforage.getItem('productos')) as Producto[];
      if (!productos) {
        try {
          productos = await api.buscarProductos_basico(
            {},
            { sort: '-_modificado -_creado' },
          );
          await localforage.setItem('productos', productos);
        } catch (err) {
          errFallBack(err);
          return;
        }
      }
      this.productos = productos;
      return productos;
    },
  },

  persist: {
    paths: ['producto'],
  },
});
