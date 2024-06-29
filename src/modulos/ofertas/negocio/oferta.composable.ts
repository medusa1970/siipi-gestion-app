import { ofertaService } from '../API/oferta.service.js';
import { storeOferta } from '@/modulos/ofertas/negocio/oferta.store.js';

import localforage from 'localforage';
import type { Oferta } from '../API/oferta.interface';

// import type { CrearProductoBasico } from '~/modulos/productos/negocio/producto.interface';
// import type { Producto } from '~/modulos/productos/API/producto.interfaceApi';

export const useOferta = () => {
  /** DECLARACIONES */
  const ofertaStore = storeOferta();
  const { $socket } = useNuxtApp();
  const router = useRouter();

  /** REACTIVOS */

  const estado = reactive({
    ofertas: [] as Oferta[],

    oferta: {} as Oferta,
  });

  /** FUNCIONES */
  /**
   * Traer productos de la base de datos local
   */
  const traerOfertas = async () => {
    const ofertasAlmacenados = await localforage.getItem('ofertas');

    if (!ofertasAlmacenados) {
      const ofertas = await ofertaService.buscarOfertas();

      //si existe producto lo guardamos y si no le damos un []
      await localforage.setItem('ofertas', ofertas ? ofertas : []);
    }
  };

  /**
   * Actualizar la base de datos local de productos
   */
  const actOfertasDB = async () => {
    const productos = await postDataGql(
      GqlProductosBuscar({
        opciones: {
          populate: true,
          sort: '-_modificado -_creado',
        },
      }),
    );
    const res = await localforage.setItem(
      'productos',
      productos ? productos : [],
    );
    if (res) console.log('Se actualizo la base de datos');
  };

  const getOfertas = async () => {
    ofertaStore.ofertas = await localforage.getItem('ofertas');
    estado.ofertas = ofertaStore.ofertas;
  };

  return {
    estado,
    traerOfertas,
    actOfertasDB,
    ofertaStore,
    getOfertas,
  };
};
