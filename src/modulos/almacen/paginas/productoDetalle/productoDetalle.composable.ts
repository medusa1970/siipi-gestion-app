import { useAlmacen } from "~/modulos/almacen/almacen.composable";

export const useProductoDetalle = () => {
  const { store } = useAlmacen();
  const estado = reactive({
    tab: "datosBasicos",
  });

  return {
    store,
    estado,
  };
};
