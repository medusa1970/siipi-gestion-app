import type { CategoriaSelectOpcion } from '@/modulos2/almacen/almacen.interface';
import { storeAlmacen } from './almacen.store';
import localforage from 'localforage';
import type { Producto } from '#gql';

export const useAlmacen = () => {
  const store = storeAlmacen();
  const estado = reactive({});

  /**
   * Generar una lista de opciones para q-select a partir del
   * arbol de categorias, con dos niveles y el nivel 1 esta desabilitado.
   */
  const categoriaSelectOptions = async (
    nivel2: boolean = true,
  ): Promise<CategoriaSelectOpcion[]> => {
    const arbol = await store.getCategoriaArbol();
    const options = [];
    for (const cat of arbol.hijas) {
      if (nivel2) {
        options.push(<CategoriaSelectOpcion>{
          label: `${cat.nombre} (${cat.hijas.length})`,
          value: cat._id,
          disable: true,
          class: 'titulo',
        });
        for (const subcat of cat.hijas) {
          options.push(<CategoriaSelectOpcion>{
            label: subcat.nombre,
            value: subcat._id,
            class: 'opcion',
          });
        }
      } else {
        options.push({
          label: cat.nombre,
          value: cat._id,
        });
      }
    }
    return options;
  };

  /**
   * Generar una lista de opciones para q-select a partir del
   * arbol de categorias, con dos niveles pero se puede elegir en el nivel 1
   * Util para popular el select de los filtros de busqueda por categoria
   */
  const categoriaSelectOptionsFiltro = async (): Promise<
    CategoriaSelectOpcion[]
  > => {
    const arbol = await store.getCategoriaArbol();
    const options = [];
    for (const cat of arbol.hijas) {
      const todas = [];
      options.push(<CategoriaSelectOpcion>{
        label: `${cat.nombre} (${cat.hijas.length})`,
        value: todas,
      });
      for (const subcat of cat.hijas) {
        options.push(<CategoriaSelectOpcion>{
          label: subcat.nombre,
          value: [subcat._id],
          class: 'opcion',
        });
        todas.push(subcat._id);
      }
    }
    return options;
  };

  /**
   * Actualizar la base de datos local de productos si escucha un cambio
   * desde el servidor
   */
  const actProductosDB = async () => {
    const productos = extraer(
      await GqlProductosBuscar({
        opciones: {
          populate: true,
          sort: '-_modificado -_creado',
        },
      }),
    );
    store.productos = productos;
    // estado.productos = productos;
    const res = await localforage.setItem(
      'productos',
      productos ? productos : [],
    );
    if (res) console.log('Se actualizo la base de datos de productos');
  };

  /**
   * Saber si un producto esta completo.
   */
  const productoIncompleto = (producto: Producto) => {
    const res = [];
    if (!producto.imagen) res.push('imagen');
    if (producto.variedades.length === 0) res.push('variedad');
    if (!producto.medida) res.push('medida');
    if (!producto.categoria) res.push('categoria');
    return res.length > 0 ? res : null;
  };

  // exports
  return {
    estado,
    store,
    actProductosDB,
    categoriaSelectOptions,
    categoriaSelectOptionsFiltro,
    productoIncompleto,
  };
};
