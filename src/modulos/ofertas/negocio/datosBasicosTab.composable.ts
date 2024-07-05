import { storeOferta } from '@/modulos/ofertas/negocio/oferta.store';
import { ofertaService } from '../API/oferta.service';

const init_ofertaBasica = {
  _id: null as string,
  nombre: null as string,
  abreviacion: null as string,
  catalogo: null as { _id: string; nombre: string },
  // categoria: null as { _id: string; nombre: string },
  imagen: null as { data: string; mimetype: string },
};

export const useDatosBasicosTab = () => {
  const ofertaStore = storeOferta();

  const estado = reactive({
    datos_ofertaBasica: init_ofertaBasica,
    categoriaOpciones: [] as any[],
  });

  /**
   * Generar una lista de opciones para q-select a partir del
   * arbol de categorias
   */
  const modificarDatosBasicosOferta = async () => {
    const { _id, nombre, abreviacion, catalogo, imagen } =
      estado.datos_ofertaBasica;
    const ofertaModificada = await ofertaService.modificarOfertaBasica(
      { _id: [ofertaStore.oferta._id] },
      { nombre, abreviacion, imagen, catalogo: catalogo._id },
    );
    if (ofertaModificada) {
      NotifySucessCenter('Oferta modificada correctamente');
      ofertaStore.oferta.nombre = ofertaModificada.nombre;
      ofertaStore.oferta.abreviacion = ofertaModificada.abreviacion;
      ofertaStore.oferta.catalogo = ofertaModificada.catalogo;
      ofertaStore.oferta.imagen = ofertaModificada.imagen;
    }
  };

  return { estado, ofertaStore, modificarDatosBasicosOferta };
};
