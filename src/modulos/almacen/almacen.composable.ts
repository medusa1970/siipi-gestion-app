import { storeAlmacen } from "./almacen.store";
import type { Producto } from "#gql";

export const useAlmacen = () => {
  const store = storeAlmacen();
  const estado = reactive({});

  /**
   * Saber si un producto esta completo.
   */
  const productoIncompleto = (producto: Producto) => {
    const res = [];
    if (!producto.imagen) res.push("imagen");
    if (producto.variedades.length === 0) res.push("variedad");
    if (!producto.medida) res.push("medida");
    if (!producto.categoria) res.push("categoria");
    return res.length > 0 ? res : null;
  };

  // exports
  return {
    estado,
    store,
    productoIncompleto,
  };
};
