import type { CrearProductoBasico } from './producto.interface';
import { productoApiService } from '../API/productoApiService';
import { useProductoStore } from './useProductoStore';
import type { Categoria, CrearCategoriaDto } from '#gql';

export const useProductoService = () => {
  const productoStore = useProductoStore();

  /**
   * Generar una lista de opciones para q-select a partir del
   * arbol de categorias
   */
  const categoriaSelectOptions = async (refresh = false) => {
    const options = [];
    const arbol = await productoStore.getCategoriaArbol(refresh);
    for (const cat of arbol.hijas) {
      options.push({
        label: `${cat.nombre} (${cat.hijas.length})`,
        value: cat._id,
        disable: true,
      });
      for (const subcat of cat.hijas) {
        options.push({
          label: subcat.nombre,
          value: subcat._id,
          disable: false,
        });
      }
    }
    return options;
  };
  /**
   * Generar una lista de opciones para q-select a partir del
   * arbol de categorias
   */
  const categoriaSelectOptions1nivel = async () => {
    const options = [];
    const arbol = await productoStore.getCategoriaArbol();
    for (const cat of arbol.hijas) {
      options.push({
        label: cat.nombre,
        value: cat._id,
        disable: false,
      });
    }
    return options;
  };

  /**
   * Agregar un producto (solo datos basicos)
   */
  const crearProductoBasico = async (datos: CrearProductoBasico) => {
    const productoCreado = await productoApiService.crearProductoBasico(datos);
    if (productoCreado) {
      productoStore.addProducto(productoCreado);
    }
    return productoCreado;
  };

  /**
   * Agregar una categoria
   */
  const crearCategoria = async (
    datos: CrearCategoriaDto,
  ): Promise<Categoria> => {
    const [categoriaCreada] = await productoApiService.crearCategoria(datos);
    if (categoriaCreada) {
      // TODO Ajouter la categorie a l'arbol
      // productoStore.addCategoria(categoriaCreada);
    }
    return categoriaCreada;
  };

  return {
    categoriaSelectOptions,
    categoriaSelectOptions1nivel,
    crearProductoBasico,
    crearCategoria,
  };
};
