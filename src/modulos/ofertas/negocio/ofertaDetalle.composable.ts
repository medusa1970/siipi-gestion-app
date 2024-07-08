import { storeOferta } from '@/modulos/ofertas/negocio/oferta.store.js';

export const useOfertaDetalle = () => {
  /** DECLARACIONES */
  const ofertaStore = storeOferta();

  /** REACTIVOS */
  const estado = reactive({
    tab: 'datosBasicos',
  });

  /** FUNCIONES */

  return { estado, ofertaStore };
};
