import type { CrearProductoBasico } from './producto.interface';
import { useProductoGql } from './useProductoGql';
import { useProductoStore } from './useProductoStore';

export const useProducto = () => {
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
    console.log('creando producto (useProducto)');
    const productoCreado = await useProductoGql.crearProductoBasico(datos);
    if (productoCreado) {
      NotifySucessCenter('Producto agregado correctamente');
      productoStore.addProducto(productoCreado);
    } else {
      NotifyError('Problema al agregar el producto');
    }
  };

  return { categoriaSelectOptions, crearProductoBasico };
};
