import { useAlmacen } from "~/modulos/almacen/almacen.composable";

export const useMedidaBasico = () => {
  const { store, authStore, estadoAlmacen, router } = useAlmacen();
  const estado = reactive({});

  const handleMedidaModificada = (medida) => {
    NotifySucessCenter("Medida modificada correctamente");
    store.refreshMedidas();
    store.medida = medida;
  };

  return {
    estado,
    store,
    authStore,
    router,
    handleMedidaModificada,
  };
};
