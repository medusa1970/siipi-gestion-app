/**
 * ProductoStore: Almacén de estado para la autenticación
 * Contiene información sobre el usuario autenticado, el token y el negocio seleccionado.
 */

import { productoService } from '../API/productoService';
import type { Producto, Categoria } from '../API/producto.interfaceApi';
import localforage from 'localforage';
import { defineStore } from 'pinia';

interface ProductoStoreProps {
  // producto que se esta editando en el formulario detalle
  producto: Producto | null;
  // cache del arbol de categorias
  categoriaArbol: Categoria | null;
  // cache de la lista de los productos
  productos: Producto[] | null;
}

export const storeProducto = defineStore('producto', {
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
          state.categoriaArbol = await productoService.obtenerTodasCategorias();
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
        state.productos = await localforage.getItem('productos');
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

    async actualizarProductos() {
      const productosExistentes: any[] =
        (await localforage.getItem('productos')) || [];
      // console.log(productosExistentes.length);
      // console.log(this.productos?.length);
      if (productosExistentes.length != this.productos?.length) {
        // await localforage.setItem('productos', productos);
        console.log('no son iguales');
      } else {
        console.log('son iguales');
      }
      // if (productos) {
      //   console.log('first');
      //   const res = await localforage.setItem('productos', productos);
      //   console.log(res);
      // }
    },
  },

  persist: false,
});
