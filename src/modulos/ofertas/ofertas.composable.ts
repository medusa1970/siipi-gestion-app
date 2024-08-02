import { storeOferta } from "./ofertas.store";

export const useOfertas = () => {
  const store = storeOferta();
  const estado = reactive({
    catalogoSeleccionado: null as string,
  });

  const ofertaAbreviacion = (nombre: string): string => {
    return nombre.substring(0, 15) + "...";
  };

  // exports
  return {
    estado,
    store,
    ofertaAbreviacion,
  };
};
