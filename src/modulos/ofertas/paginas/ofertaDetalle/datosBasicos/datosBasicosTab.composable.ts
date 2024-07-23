import { storeOferta } from '@/modulos/ofertas/ofertas.store';

const init_ofertaBasica = {
  _id: null as string,
  nombre: null as string,
  abreviacion: null as string,
  catalogo: null as { _id: string; nombre: string },
  // categoria: null as { _id: string; nombre: string },
  imagen: null as { data: string; mimetype: string },
};

export const useDatosBasicosTab = () => {
  const store = storeOferta();

  const estado = reactive({
    datos_ofertaBasica: init_ofertaBasica,
    categoriaOpciones: [] as any[],
    modOfertaBasicaImagen: null,
  });

  /**
   * Generar una lista de opciones para q-select a partir del
   * arbol de categorias
   */
  const modificarDatosBasicosOferta = async () => {
    const { _id, nombre, abreviacion, catalogo, imagen } =
      estado.datos_ofertaBasica;
    const ofertaModificada = await api.modificarOferta(
      { _id: [store.oferta._id] },
      { nombre, abreviacion, imagen, catalogo: catalogo._id },
    );
    if (ofertaModificada) {
      NotifySucessCenter('Oferta modificada correctamente');
      store.oferta.nombre = ofertaModificada.nombre;
      store.oferta.abreviacion = ofertaModificada.abreviacion;
      store.oferta.catalogo = ofertaModificada.catalogo;
      store.oferta.imagen = ofertaModificada.imagen;
    }
  };

  const handleOfertaModificada = (oferta) => {
    NotifySucessCenter('Oferta modificada correctamente');
    store.oferta = oferta;
  };

  return { estado, store, modificarDatosBasicosOferta };
};
