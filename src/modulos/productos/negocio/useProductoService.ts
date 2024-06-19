import type { CrearProductoBasico } from './producto.interface';
import { productoApiService } from '../API/productoApiService';
import { useProductoStore } from './useProductoStore';

export const useProductoService = () => {
  const productoStore = useProductoStore();

  /**
   * Generar una lista de opciones para q-select a partir del
   * arbol de categorias
   */
  const categoriaSelectOptions = async () => {
    const options = [];
    const arbol = await productoStore.getCategoriaArbol();
    for (const cat of arbol.hijas) {
      options.push({
        label: `${cat.nombre} (${cat.hijas.length})`,
        disable: true,
        class: 'title',
      });
      for (const subcat of cat.hijas) {
        options.push({
          label: subcat.nombre,
          value: subcat._id,
          class: 'option',
        });
      }
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

  return { categoriaSelectOptions, crearProductoBasico };
};
