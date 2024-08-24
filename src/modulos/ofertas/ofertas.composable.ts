import type { Oferta } from '#gql';
import { storeOferta } from './ofertas.store';
import { useAuthStore } from '@/modulos/main/useAuthStore';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';

export const useOfertas = () => {
  const route = useRoute();
  const store = storeOferta();
  const router = useRouter();
  const authStore = useAuthStore();

  const estadoOfertas = reactive({
    catalogoSeleccionado: null as string
  });
  const { productoIncompleto } = useAlmacen();

  const ofertaAbreviacion = (nombre: string): string => {
    return nombre.substring(0, 27) + '...';
  };

  /**
   * Saber si una oferta esta completa.
   */
  const ofertaIncompleta = (oferta: Oferta) => {
    const res = [];

    // debe tener un producto
    if (!oferta.ingredientes || oferta.ingredientes.length === 0) {
      res.push('ingredienteIncompleto');
    }

    // debe tener marca al producto
    else {
      for (const ingrediente of oferta.ingredientes) {
        if (!ingrediente.marca) res.push('sinMarca', ingrediente);
        if (!ingrediente.producto) res.push('sin producto', ingrediente);
        else if (productoIncompleto(ingrediente.producto))
          res.push('productoIncompleto', ingrediente);
      }
    }

    // la oferta debe tener una imagen
    // if (!oferta.imagen) res.push('imagen');

    // tiene que tener precios

    return res.length > 0 ? res : null;
  };

  // exports
  return {
    estadoOfertas,
    store,
    authStore,
    router,
    route,
    ofertaAbreviacion,
    ofertaIncompleta
  };
};
