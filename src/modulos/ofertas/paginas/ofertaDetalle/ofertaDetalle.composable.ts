import { storeOferta } from "@/modulos/ofertas/ofertas.store.js";

export const useOfertaDetalle = () => {
  /** DECLARACIONES */
  const store = storeOferta();

  /** REACTIVOS */
  const estado = reactive({
    tab: "datosBasicos",
  });

  /** FUNCIONES */

  return { estado, store };
};
