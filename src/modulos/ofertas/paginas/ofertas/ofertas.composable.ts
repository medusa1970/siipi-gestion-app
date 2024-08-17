import type { Catalogo, Oferta } from '#gql';
import { useOfertas } from '~/modulos/ofertas/ofertas.composable';

/**
 * Permisos requeridos para esta pagina
 */
export const permisosOfertas = ['ADQUISICION', 'LOGISTICA', 'ALMACEN'];

/**
 * Composable
 */

const init_crearOfertaBasico = {
  nombre: null as string,
  abreviacion: null as string,
  catalogo: null as { _id: string; nombre: string },
  imagen: null as { data: string; mimetype: string }
};

export const useOferta = () => {
  const { store, authStore, estadoOfertas, router, ofertaIncompleta } =
    useOfertas();
  if (!authStore.autorizar(permisosOfertas)) goTo(router, 'noAutorizado');

  const estado = reactive({
    ofertas: [] as Oferta[],

    catalogoSeleccionado: null as Catalogo,
    catFiltroGlobal: [],

    modal: {
      show_crearOfertaBasico: false,
      show_informacionOferta: false,
      show_crearOfertaSimple: false
    },

    filtros: {
      catalogoSeleccionado: null,
      catalogoSeleccionado2: null,
      buscarFiltro: null,
      completud: 'todos'
    }
  });

  const handleOfertaSimpleCreada = async oferta => {
    NotifySucessCenter('Oferta creada éxitosamente');
    estado.modal.show_crearOfertaSimple = false;
  };
  const handleOfertaBasicaCreada = async oferta => {
    NotifySucessCenter('Oferta creada éxitosamente');
    estado.modal.show_crearOfertaBasico = false;
  };

  return {
    estado,
    store,
    authStore,
    router,
    handleOfertaSimpleCreada,
    handleOfertaBasicaCreada,
    ofertaIncompleta
  };
};
