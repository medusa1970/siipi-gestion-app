import type {
  Catalogo,
  Categoria,
  Entidad,
  Marca,
  Medida,
  Producto,
} from '#gql';
import localforage from 'localforage';
import { apiAlmacen } from '@/modulos/almacen/API/almacen.api';

interface storeProps {
  productos: Producto[] | null;
  marcas: Marca[] | null;
  medidas: Medida[] | null;
  proveedores: Entidad[] | null;
  categoriaArbol: Categoria | null;

  // Objeto corriente en la pagina de detalle
  producto: Producto | null;
  marca: Marca | null;
  medida: Medida | null;
  proveedor: Entidad | null;
}

export const storeAlmacen = defineStore('almacen', {
  state: (): storeProps => ({
    productos: null,
    marcas: null,
    medidas: null,
    proveedores: null,
    categoriaArbol: null,

    producto: null,
    marca: null,
    medida: null,
    proveedor: null,
  }),

  getters: {},

  actions: {
    /**
     * Retorna la lista de los productos desde el indexedDb o desde la base
     * de datos si todavia no existe en el indexedDb
     */
    async getProductos(actualizarDB = false): Promise<Producto[]> {
      if (!this.productos || actualizarDB) {
        try {
          this.productos = await api.buscarProductos_basico(
            {},
            { sort: '-_modificado -_creado' },
          );
          await localforage.setItem(
            'productos',
            JSON.parse(JSON.stringify(this.productos)),
          );
        } catch (err) {
          errFallBack(err);
          return;
        }
      }
      if (!this.productos) {
        this.productos = (await localforage.getItem('productos')) as Producto[];
      }
      return this.productos;
    },
    async refreshProductos() {
      this.productos = null;
      this.getProductos();
    },

    /**
     * Retorna el arbol de categoria
     */
    async getCategorias(id: string = null): Promise<Categoria> {
      // recuperar el arbol raiz
      if (this.categoriaArbol === null) {
        try {
          this.categoriaArbol = await apiAlmacen.buscarArbolCategoriasRaiz();
        } catch (err) {
          errFallBack(err);
          return null;
        }
      }
      // para recuperar la categoria especifica
      const f = (categoria) => {
        if (categoria._id === id) {
          return categoria;
        } else if (categoria.hijas) {
          for (const hija of categoria.hijas) {
            const res = f(hija);
            if (res) return res;
          }
        } else {
          return 'null';
        }
      };
      return id === null ? this.categoriaArbol : f(this.categoriaArbol);
    },
    refreshCategorias(): void {
      this.categoriaArbol = null;
      this.getCategorias();
    },

    /**
     * Retorna la lista de las marcas de la base de datos
     */
    async getMarcas(): Promise<Marca[]> {
      if (this.marcas == null) {
        try {
          this.marcas = await api.buscarMarcas({}, { sort: 'nombre' });
          return this.marcas;
        } catch (err) {
          errFallBack(err);
          return;
        }
      }
      console.log(this.marcas);
      return this.marcas;
    },
    refreshMarcas(): void {
      this.marcas = null;
      this.getMarcas();
    },

    /**
     * Retorna la lista de los proveedores de la base de datos
     */
    async getProveedores(): Promise<Entidad[]> {
      if (this.proveedores == null) {
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
      }
      return this.proveedores;
    },
    refreshProveedores(): void {
      this.proveedores = null;
      this.getProveedores();
    },

    /**
     * Retorna la lista de las medidas de la base de datos
     */
    async getMedidas(): Promise<Medida[]> {
      if (this.medidas == null) {
        try {
          this.medidas = await api.buscarMedidas({});
          return this.medidas;
        } catch (err) {
          errFallBack(err);
          return;
        }
      }
      return this.medidas;
    },
    refreshMedidas(): void {
      this.medidas = null;
      this.getMedidas();
    },
  },

  persist: {
    paths: ['producto', 'marcas', 'medidas', 'proveedores'],
  },
});
