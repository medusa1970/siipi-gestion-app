import { storeOferta } from "@/modulos/ofertas/ofertas.store";

export const useDatosBasicosTab = () => {
  const store = storeOferta();
  const estado = reactive({});

  const handleOfertaModificada = (oferta) => {
    NotifySucessCenter("Oferta modificada correctamente");
    store.oferta = oferta;
  };

  return { estado, store, handleOfertaModificada };
};
