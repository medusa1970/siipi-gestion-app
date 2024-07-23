import { storeOferta } from '@/modulos/ofertas/ofertas.store';

export const usePrecioTab = () => {
  const store = storeOferta();

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
    const ofertaModificada = await api.modificarOferta(
      { _id: [store.oferta._id] },
      estado.datos_preciosOferta,
    );
    if (ofertaModificada) {
      NotifySucessCenter('Precio modificado correctamente');
      store.oferta = ofertaModificada;
    }
  };

  return { estado, modificarOfertaPrecio, store };
};
