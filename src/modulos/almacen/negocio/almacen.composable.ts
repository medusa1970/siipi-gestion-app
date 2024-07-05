import { almacenService } from '../API/almacen.service';
import { storeAlmacen } from './almacen.store';

import type { CrearEntidadDto, Entidad } from '#gql';

export const useAlmacen = () => {
  // declaraciones
  const store = storeAlmacen();
  const service = almacenService;

  // inits
  const init_crearEntidad = {
    nombre: null as string,
    tipo: null as string,
    descripcion: null as string,
  } as CrearEntidadDto;

  // reactivos
  const estado = reactive({
    crearEntidadData: clone(init_crearEntidad),
  });

  // crearEntidad
  const crearEntidad = async () => {
    let resultado: Entidad;
    try {
      await loadingAsync(async () => {
        resultado = await almacenService.crearEntidad(estado.crearEntidadData);
      });
    } catch (err) {
      if (isApiBadRequest(err, 'duplicado')) {
        NotifyError('Ya existe una entidad con este nombre');
      }
      errFallBack(err);
      return;
    }
    NotifySucessCenter('Entidad agregada correctamente');
  };

  // exports
  return {
    estado,
    store,
    service,
    crearEntidad,
  };
};
