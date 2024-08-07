import type { Oferta } from "#gql";
import { useOfertas } from "~/modulos/ofertas/ofertas.composable";

/**
 * Permisos requeridos para esta pagina
 */
export const permisosOfertas = ["ADQUISICION", "LOGISTICA", "ALMACEN"];

/**
 * Composable
 */

const init_crearOfertaBasico = {
  nombre: null as string,
  abreviacion: null as string,
  catalogo: null as { _id: string; nombre: string },
  imagen: null as { data: string; mimetype: string },
};

export const useOferta = () => {
  const { store, authStore, estadoOfertas, router } = useOfertas();
  if (!authStore.autorizar(permisosOfertas)) goTo(router, "noAutorizado");

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
    authStore,
    router,
    handleOfertaSimpleCreada,
    handleOfertaBasicaCreada,
  };
};
