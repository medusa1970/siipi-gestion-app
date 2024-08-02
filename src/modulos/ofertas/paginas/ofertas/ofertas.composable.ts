import type { Catalogo, Oferta } from "#gql";
import { apiOfertas } from "@/modulos/ofertas/API/ofertas.api";
import { storeOferta } from "@/modulos/ofertas/ofertas.store";
import localforage from "localforage";

const init_crearOfertaBasico = {
  nombre: null as string,
  abreviacion: null as string,
  catalogo: null as { _id: string; nombre: string },
  imagen: null as { data: string; mimetype: string },
};

export const useOferta = () => {
  const store = storeOferta();
  const estado = reactive({
    ofertas: [] as Oferta[],

    modal: {
      show_crearOfertaBasico: false,
      show_informacionOferta: false,
      show_crearOfertaSimple: false,
    },

    filtros: {
      catalogoSeleccionado: null,
      buscarFiltro: null,
    },
  });

  const handleOfertaSimpleCreada = async (oferta) => {
    NotifySucessCenter("Oferta creada éxitosamente");
    estado.modal.show_crearOfertaSimple = false;
  };
  const handleOfertaBasicaCreada = async (oferta) => {
    NotifySucessCenter("Oferta creada éxitosamente");
    estado.modal.show_crearOfertaBasico = false;
  };

  return {
    estado,
    store,
    handleOfertaSimpleCreada,
    handleOfertaBasicaCreada,
  };
};
