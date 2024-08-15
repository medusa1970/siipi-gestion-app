import type {
  Categoria,
  Entidad,
  Marca,
  Medida,
  Producto,
  Problema
} from '#gql';
import localforage from 'localforage';
import { apiAlmacen } from '@/modulos/almacen/API/almacen.api';
import { useAuthStore } from '../main/useAuthStore';

interface storeProps {
  productos: Producto[] | null;
  marcas: Marca[] | null;
  medidas: Medida[] | null;
  proveedores: Entidad[] | null;
  categoriaArbol: Categoria | null;
  problemas: Problema[] | null;

  // Objeto corriente en la pagina de detalle
  producto: Producto | null;
  marca: Marca | null;
  medida: Medida | null;
  proveedor: Entidad | null;
  entidad: Entidad | null; // entidad corriente
}

export const storeAlmacen = defineStore('almacen', {
  state: (): storeProps => ({
    productos: null,
    marcas: null,
    medidas: null,
    proveedores: null,
    categoriaArbol: null,
    entidad: null,
    producto: null,
    marca: null,
    medida: null,
    proveedor: null,
    problemas: null
  }),

  getters: {
    productoId: state => useRoute()?.params.id
  },

  actions: {
    /**
     * define el producto actual que se esta modificando en pagina de detalles
     */
    async useProducto(): Promise<void> {
      if (!this.producto || this.producto._id !== this.productoId) {
        try {
          this.producto = await api.buscarProducto_basico(
            this.productoId as string
          );
        } catch (err) {
          errFailback(err);
        }
      }
    },

    /**
     * Retorna la lista de los productos desde el indexedDb o desde la base
     * de datos si todavia no existe en el indexedDb
     */
    async getProductos(actualizarDB = false): Promise<Producto[]> {
      console.log('get');
      this.productos = (await localforage.getItem('productos')) as Producto[];
      console.log('received');
      if (!this.productos || actualizarDB) {
        try {
          this.productos = await api.buscarProductos_basico(
            {},
            { sort: '-_modificado -_creado' }
          );
          await localforage.setItem(
            'productos',
            JSON.parse(JSON.stringify(this.productos))
          );
        } catch (err) {
          errFailback(err);
          return;
        }
      }
      return this.productos;
    },
    async refreshProductos(): Promise<void> {
      await this.getProductos(true);
    },

    /**
     * Retorna el arbol de categoria
     */
    async getCategorias(id: string = null): Promise<Categoria> {
      if (this.categoriaArbol === null) {
        try {
          this.categoriaArbol = await apiAlmacen.buscarArbolCategoriasRaiz();
        } catch (err) {
          errFailback(err);
          return null;
        }
      }
      return id == null ? this.categoriaArbol : this.getCategoria(id);
    },
    async refreshCategorias(): Promise<void> {
      this.categoriaArbol = null;
      await this.getCategorias();
    },
    getCategoria(id: string): Categoria {
      if (this.categoriaArbol === null) return null;
      const f = categoria => {
        if (categoria._id === id) {
          return categoria;
        } else if (categoria.hijas) {
          for (const hija of categoria.hijas) {
            const res = f(hija);
            if (res) return res;
          }
        } else {
          return null;
        }
      };
      return f(this.categoriaArbol);
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
          errFailback(err);
          return;
        }
      }
      return this.marcas;
    },
    async refreshMarcas(): Promise<void> {
      this.marcas = null;
      await this.getMarcas();
    },

    /**
     * Retorna la lista de los proveedores de la base de datos
     */
    async getProveedores(): Promise<Entidad[]> {
      if (this.proveedores == null) {
        try {
          this.proveedores = await api.buscarEntidades_basico(
            { tipo: ['PROVEEDOR'] },
            { sort: 'nombre' }
          );
          return this.proveedores;
        } catch (err) {
          errFailback(err);
          return;
        }
      }
      return this.proveedores;
    },
    async refreshProveedores(): Promise<void> {
      this.proveedores = null;
      await await this.getProveedores();
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
          errFailback(err);
          return;
        }
      }
      return this.medidas;
    },
    async refreshMedidas(): Promise<void> {
      this.medidas = null;
      await this.getMedidas();
    },

    /**
     * Retorna la entidad con sus bloques
     */
    async getEntidad(): Promise<Entidad> {
      if (this.entidad == null) {
        try {
          this.entidad = await api.buscarEntidad_bloques(
            useAuthStore().negocio._id
          );
          return this.entidad;
        } catch (err) {
          errFailback(err);
          return;
        }
      }
      return this.entidad;
    },
    async refreshEntidad(): Promise<void> {
      this.entidad = null;
      await this.getEntidad();
    },

    /**
     * Retorna la lista de las problemas de la base de datos
     */
    async getProblemas(): Promise<Problema[]> {
      if (!this.problemas) {
        try {
          const entidad = await api.buscarEntidad_problemas(
            useAuthStore().getNegocio._id
          );
          this.problemas = entidad.problemas;
          // this.problemas = entidad.problemas.sort((p1, p2) =>
          //   p1._modificado > p2._modificado ? -1 : 1,
          // );
        } catch (err) {
          errFailback(err);
          return;
        }
      }
      return this.problemas;
    },
    async refreshProblemas(): Promise<void> {
      this.problemas = null;
      await this.getProblemas();
      // if (this.problema) {
      //   await this.useProblema(this.problema._id);
      // }
    }
  },

  persist: {
    paths: ['producto', 'marcas', 'medidas', 'proveedores', 'problemas']
  }
});
