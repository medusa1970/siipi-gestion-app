import type { Categoria, Producto } from '#gql';
import localforage from 'localforage';

interface storeProps {
  // producto que se esta editando en el formulario detalle
  producto: Producto | null;
  // cache de la lista de los productos
  productos: Producto[] | null;
  // arbol de categorias
  categoriaArbol: Categoria | null;
  // si se tiene que refrescar el arbol (se agrego una categoria por cierto)
  refreshArbol: boolean;
}

export const storeAlmacen = defineStore('almacen', {
  state: (): storeProps => ({
    producto: null,
    productos: [],
    refreshArbol: true,
    categoriaArbol: null,
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
