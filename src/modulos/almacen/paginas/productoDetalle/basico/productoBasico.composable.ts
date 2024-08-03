import type { CrearProductoDto } from "#gql";
import { useAlmacen } from "~/modulos/almacen/almacen.composable";

const initForm = {
  nombre: null,
  categoria: null,
  comentario: null,
  puedeVencer: false,
  vencimentoAlertaSuave: null,
  vencimentoAlertaFuerte: null,
  imagen: null,
} as CrearProductoDto;

export const useProductoBasico = () => {
  const { store, authStore, estadoAlmacen, router } = useAlmacen();
  const estado = reactive({
    dataForm: clone(initForm),
    errorNombre: null,
    catOpciones: [],
  });

  const handleProductoModificado = (producto) => {
    NotifySucessCenter("Producto modificado correctamente");
    store.producto = producto;
  };

  return {
    estado,
    store,
    authStore,
    router,
    handleProductoModificado,
  };
};
