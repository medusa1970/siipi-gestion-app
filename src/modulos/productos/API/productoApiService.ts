import type { CrearCategoriaDto } from '#gql';
import type { CrearProductoBasico } from '../negocio/producto.interface';

export const productoApiService = {
  /**
   * Buscar todos los productos
   * @returns Producto
   */
  buscarProductos: async () => {
    return extraer(
      await GqlProductosBuscar({
        opciones: {
          populate: true,
          sort: '-_modificado -_creado',
        },
      }),
    );
  },

  /**
   * Crear una producto con datos basicos
   * @returns Producto
   */
  crearProductoBasico: async (datos: CrearProductoBasico) => {
    const producto = extraer(
      await GqlProductosCrearBasico({
        datos: [datos],
        opciones: { populate: true, aceptarInexistentes: true },
      }),
    );
    return producto[0];
  },

  /**
   * Busca todas las categorias en forma de arbol
   * @returns Categoria (con sus hijas populadas)
   */
  obtenerTodasCategorias: async () => {
    return extraer(
      await GqlProductosCategoriaArbol({
        busqueda: { nombre: ['CATEGORIA RAIZ'] },
      }),
    );
  },

  /**
   * Crea una categoria
   * @returns Categoria
   */
  crearCategoria: async (categoria: CrearCategoriaDto) => {
    return extraer(await GqlProductosCrearCategoria({ categoria }));
  },
};
