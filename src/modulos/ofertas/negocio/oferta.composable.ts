import { ofertaService } from '../API/oferta.service.js';
import { storeOferta } from '@/modulos/ofertas/negocio/oferta.store.js';

import localforage from 'localforage';
import type { Catalogo, Oferta } from '../API/oferta.interface';
import type { CrearOfertaDto } from '#gql';
import type { CrearOferta } from './oferta.interface.js';

// import type { CrearProductoBasico } from '~/modulos/productos/negocio/producto.interface';
// import type { Producto } from '~/modulos/productos/API/producto.interfaceApi';

const init_crearOfertaBasico: CrearOferta = {
  nombre: '',
  abreviacion: '',
  imagen: null,
  catalogo: null,
  categoria: null,
};

export const useOferta = () => {
  /** DECLARACIONES */
  const ofertaStore = storeOferta();
  const { $socket } = useNuxtApp();
  const router = useRouter();

  /** REACTIVOS */

  const estado = reactive({
    ofertas: [] as Oferta[],
    oferta: {} as Oferta,
    catalogos: [] as Catalogo[],
    catalogoSeleccionado: null as Catalogo | null,

    modal: {
      show_crearOfertaBasico: false,
      show_informacionOferta: false,
    },

    datos_ofertaBasica: init_crearOfertaBasico,
  });

  /** FUNCIONES */
  /**
   * Traer ofertas de la base de datos local y si no existe le carga
   * ofertas al indexedDB.
   */
  const traerOfertas = async () => {
    let ofertas = await localforage.getItem<Oferta[]>('ofertas');
    if (!ofertas) {
      ofertas = await ofertaService.buscarOfertas();
      await localforage.setItem('ofertas', ofertas);
    }
    ofertaStore.ofertas = estado.ofertas = ofertas;
  };
  /**
   * Actualizar la base de datos local de ofertas si escucha un cambio
   * desde el servidor
   */
  const actOfertasDB = async () => {
    const ofertas = await postDataGql(
      GqlBuscarOfertas({
        opciones: {
          populate: true,
          sort: '-_modificado -_creado',
        },
      }),
    );
    const res = await localforage.setItem('ofertas', ofertas ? ofertas : []);
    if (res) console.log('Se actualizo la base de datos');
  };
  /**
   * Trae todos los catalogos de la BD y los guarda en el estado y store
   */
  const traerCatalagos = async () => {
    let catalogos = await localforage.getItem<Catalogo[]>('catalogos');

    if (!catalogos) {
      const res = await ofertaService.buscarCatalogos();
      catalogos = res?.hijas || [];
      await localforage.setItem('catalogos', catalogos);
    }
    ofertaStore.catalogos = estado.catalogos = catalogos;
  };

  return {
    estado,
    traerOfertas,
    actOfertasDB,
    ofertaStore,
    traerCatalagos,
  };
};
