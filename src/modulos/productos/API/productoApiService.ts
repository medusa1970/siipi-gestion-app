import type { CrearProductoBasico } from '../negocio/producto.interface';

export const productoApiService = {
  /**
   * Buscar todos los productos
   * @returns Producto
   */
  buscarProductos: async () => {
    const productos = await postDataGql(
      GqlProductosBuscar({
        opciones: {
          populate: true,
          sort: '-_modificado -_creado',
        },
      }),
    );
    return productos;
  },

  /**
   * Crear una producto con datos basicos
   * @returns Producto
   */
  crearProductoBasico: async (datos: CrearProductoBasico) => {
    // console.log(datos);
    const producto = await postDataGql(
      GqlProductosCrearBasico({
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
    const arbol = await postDataGql(
      GqlProductosCategoriaArbol({
        busqueda: { nombre: ['CATEGORIA RAIZ'] },
      }),
    );
    // console.log('arbol');
    // console.log(arbol);
    return arbol;
  },
};
