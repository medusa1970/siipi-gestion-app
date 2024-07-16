import type {
  Catalogo,
  Categoria,
  Entidad,
  Marca,
  Medida,
  Producto,
} from '#gql';
import localforage from 'localforage';

interface storeProps {
  // cache de las colecciones para las tablas
  productos: Producto[] | null;
  marcas: Marca[] | null;
  medidas: Medida[] | null;
  proveedores: Entidad[] | null;
  // Objeto corriente en la pagina de detalle
  producto: Producto | null;
  marca: Marca | null;
  medida: Medida | null;
  proveedor: Entidad | null;
  // arboles
  categoriaArbol: Categoria | null;
  catalogoArbol: Catalogo | null;
  // si se tiene que refrescar el arbol (se agrego una categoria por cierto)
  refreshArbol: boolean;
}

export const storeAlmacen = defineStore('almacen', {
  state: (): storeProps => ({
    productos: null,
    marcas: null,
    medidas: null,
    proveedores: null,
    producto: null,
    marca: null,
    medida: null,
    proveedor: null,
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
      if (!this.productos) {
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
      }
      return this.productos;
    },

    /**
     * Retorna la lista de las marcas de la base de datos
     */
    async traerMarcas(): Promise<Marca[]> {
      try {
        this.marcas = await api.buscarMarcas({}, { sort: 'nombre' });
        return this.marcas;
      } catch (err) {
        errFallBack(err);
        return;
      }
    },

    /**
     * Retorna la lista de los proveedores de la base de datos
     */
    async traerProveedores(): Promise<Entidad[]> {
      try {
        this.proveedores = await api.buscarEntidades_basico(
          { tipo: ['PROVEEDOR'] },
          { sort: 'nombre' },
        );
        return this.proveedores;
      } catch (err) {
        errFallBack(err);
        return;
      }
    },

    /**
     * Retorna la lista de las medidas de la base de datos
     */
    async traerMedidas(): Promise<Medida[]> {
      try {
        this.medidas = await api.buscarMedidas({});
        return this.medidas;
      } catch (err) {
        errFallBack(err);
        return;
      }
    },
  },

  persist: {
    paths: ['producto', 'marcas', 'medidas', 'proveedores'],
  },
});
