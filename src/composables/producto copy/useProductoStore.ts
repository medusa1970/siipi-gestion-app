/**
 * ProductoStore: Almacén de estado para la autenticación
 * Contiene información sobre el usuario autenticado, el token y el negocio seleccionado.
 */

interface ProductoStoreProps {
  producto: Producto | null;
  isEdit: boolean;
  ListInventario: InventarioProps[];
  ListInventarioPDF: Array<Object>;
}

export const useProductoStore = defineStore('producto', {
  /**
   * state
   */
  state: (): ProductoStoreProps => ({
    // producto que se esta editando en el formulario detalle
    producto: {
      _id: '',
      nombre: '',
      comentario: '',
      categoria: { _id: '', nombre: '' },
      imagen: '',
      variedades: [],
      empaques: [],
    },

    // ?
    isEdit: false,
    ListInventario: [],
    ListInventarioPDF: [],
  }),

  persist: true,
});
