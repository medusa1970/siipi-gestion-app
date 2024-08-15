import type { Oferta } from '#gql';
import { storeOferta } from './ofertas.store';
import { useAuthStore } from '@/modulos/main/useAuthStore';

export const useOfertas = () => {
  const store = storeOferta();
  const router = useRouter();
  const authStore = useAuthStore();

  const estadoOfertas = reactive({
    catalogoSeleccionado: null as string
  });

  const ofertaAbreviacion = (nombre: string): string => {
    return nombre.substring(0, 27) + '...';
  };

  /**
   * Saber si una oferta esta completa.
   */
  const ofertaIncompleta = (oferta: Oferta) => {
    const res = [];
    if (!oferta.imagen) res.push('imagen');
  };

  // exports
  return {
    estadoOfertas,
    store,
    authStore,
    router,
    ofertaAbreviacion,
    ofertaIncompleta
  };
};
