import { storeOferta } from '@/modulos/ofertas/negocio/oferta.store';
import { ofertaService } from '../API/oferta.service';

export const usePrecioTab = () => {
  const ofertaStore = storeOferta();

  const estado = reactive({
    datos_preciosOferta: {
      precioSinFactura: null as number,
      precioConFactura: null as number,
      precios: [] as any[],
    },
  });

  //Modificar precio de la oferta
  const modificarOfertaPrecio = async () => {
    delete estado.datos_preciosOferta.precios;
    const precioModificado = await ofertaService.modificarOfertaPrecios(
      { _id: [ofertaStore.oferta._id] },
      estado.datos_preciosOferta,
    );
    if (precioModificado) {
      NotifySucessCenter('Precio modificado correctamente');
      ofertaStore.oferta.precioSinFactura = precioModificado.precioSinFactura;
      ofertaStore.oferta.precioConFactura = precioModificado.precioConFactura;
    }
  };

  return { estado, modificarOfertaPrecio, ofertaStore };
};
