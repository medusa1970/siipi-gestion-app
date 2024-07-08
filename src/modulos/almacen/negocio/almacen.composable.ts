import { almacenService } from '../API/almacen.service';
import { storeAlmacen } from './almacen.store';

import type { CrearEntidadDto, Entidad } from '#gql';

export const useAlmacen = () => {
  // declaraciones
  const store = storeAlmacen();
  const service = almacenService;

  // reactivos
  const estado = reactive({});

  // exports
  return {
    estado,
    store,
    service,
  };
};
