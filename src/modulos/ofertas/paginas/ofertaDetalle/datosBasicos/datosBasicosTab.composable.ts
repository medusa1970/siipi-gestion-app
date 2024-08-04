import { useOfertas } from "~/modulos/ofertas/ofertas.composable";

export const useDatosBasicosTab = () => {
  const { store, authStore, estadoOfertas, router } = useOfertas();
  const estado = reactive({});

  const handleOfertaModificada = (oferta) => {
    NotifySucessCenter("Oferta modificada correctamente");
    store.oferta = oferta;
  };

  return { estado, store, handleOfertaModificada };
};
