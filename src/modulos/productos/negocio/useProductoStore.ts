/**
 * ProductoStore: Almacén de estado para la autenticación
 * Contiene información sobre el usuario autenticado, el token y el negocio seleccionado.
 */

import { productoApiService } from '../API/productoApiService';
import type { Producto, Categoria } from '../API/producto.interfaceApi';

interface ProductoStoreProps {
  // producto que se esta editando en el formulario detalle
  producto: Producto | null;
  // cache del arbol de categorias
  categoriaArbol: Categoria | null;
  // cache de la lista de los productos
  productos: Producto[] | null;
}

export const useProductoStore = defineStore('producto', {
  state: (): ProductoStoreProps => ({
    producto: null,
    categoriaArbol: null,
    productos: null,
  }),

  getters: {
    getProducto: (state) => state.producto,

    /**
     * Retorna el arbol de categoria
     * Si no existe o si se indico refresh=true, lo obtiene de la API
     * @retorne Categoria con sus hijas populadas
     */
    getCategoriaArbol: (state) => {
      return async (refresh: boolean = false): Promise<Categoria> => {
        if (state.categoriaArbol === null || refresh) {
          state.categoriaArbol =
            await productoApiService.obtenerTodasCategorias();
        }
        if (!state.categoriaArbol) {
          // Lanzar un error
        }
        return state.categoriaArbol as Categoria;
      };
    },

    /**
     * Retorna la lista de los productos
     * Si no existe o si se indico refresh=true, lo obtiene de la API
     * @retorne Producto[]
     */
    getProductos: (state) => {
      return async (refresh: boolean = false): Promise<Producto[]> => {
        if (state.productos === null || refresh) {
          state.productos = await productoApiService.buscarProductos();
        }
        if (!state.productos) {
          // Lanzar un error
        }
        return state.productos as Producto[];
      };
    },
  },

  actions: {
    /**
     * Agrega un producto
     * @retorne Producto
     */
    async addProducto(producto: Producto) {
      if (this.productos === null) {
        this.productos = await this.getProductos();
      }
      // TODO si el id ya existe, reemplaza
      this.productos.push(producto);
      return this.productos;
    },
  },

  persist: true,
});
