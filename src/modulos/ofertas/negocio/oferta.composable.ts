import { ofertaService } from '../API/oferta.service.js';
import { storeOferta } from '@/modulos/ofertas/negocio/oferta.store.js';

import localforage from 'localforage';
import type { Catalogo, Oferta } from '../API/oferta.interface';
import type { CrearOfertaDto } from '#gql';
import type { CrearOferta } from './oferta.interface.js';

const init_crearOfertaBasico = {
  nombre: null as string,
  abreviacion: null as string,
  catalogo: null as { _id: string; nombre: string },
  imagen: null as { data: string; mimetype: string },
};

export const useOferta = () => {
  /** DECLARACIONES */
  const ofertaStore = storeOferta();
  const { $socket } = useNuxtApp();
  const router = useRouter();

  /** REACTIVOS */

  const estado = reactive({
    ofertas: [] as Oferta[],
    ofertasFiltradas: [] as Catalogo[],
    oferta: {} as Oferta,
    catalogos: [] as Catalogo[],
    catalogoSeleccionado: null as Catalogo | null,
    categoriaOpciones: [] as any[],

    modal: {
      show_crearOfertaBasico: false,
      show_informacionOferta: false,
    },

    datos_ofertaBasica: clone(init_crearOfertaBasico),
  });

  /** FUNCIONES */
  /**
   * Traer ofertas de la base de datos local y si no existe le carga
   * ofertas al indexedDB.
   */
  const traerOfertas = async () => {
    let ofertas = await localforage.getItem<Oferta[]>('ofertas');
    // console.log(ofertas);
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
    const ofertas = extraer(
      await GqlBuscarOfertas({
        opciones: {
          populate: true,
          sort: '-_modificado -_creado',
        },
      }),
    );
    const res = await localforage.setItem('ofertas', ofertas ? ofertas : []);
    if (res) {
      const catalogoIDS = encontrarYExtraerIds(
        estado.catalogos,
        ofertaStore.catalogoSeleccionado._id,
      ); //@ts-ignore
      estado.ofertasFiltradas = ofertas.filter((oferta: any) =>
        catalogoIDS.includes(oferta.catalogo._id),
      );
      console.log('Se actualizo la base de datos de ofertas');
    }
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
    if (ofertaStore.catalogoSeleccionado == null)
      ofertaStore.catalogoSeleccionado = catalogos[0];
    const catalogoIDS = encontrarYExtraerIds(
      estado.catalogos,
      ofertaStore.catalogoSeleccionado._id,
    ); //@ts-ignore
    estado.ofertasFiltradas = estado.ofertas.filter((oferta: any) =>
      catalogoIDS.includes(oferta.catalogo._id),
    );

    // console.log(estado.ofertasFiltradas);
  };

  const catalogosID = () => {
    // 75a4475e446a5885b05739c4
    estado.catalogos;

    // console.log(estado.catalogos);
    const res = estado.catalogos.map((cat) => {
      return {
        _id: cat._id,
        nombre: cat.nombre,
        hijas: cat.hijas.map((hija) => {
          return {
            _id: hija._id,
            nombre: hija.nombre,
            hijas: hija.hijas.map((hija2) => {
              return {
                _id: hija2._id,
                nombre: hija2.nombre,
              };
            }),
          };
        }),
      };
    });
    // console.log(res);

    //sacame todas las id de los catalogos
    function encontrarYExtraerIds(catalogos, idBuscada) {
      const extraerIds = (catalogo) => [
        catalogo._id,
        ...(catalogo.hijas ? catalogo.hijas.flatMap(extraerIds) : []),
      ];
      console.log(extraerIds);

      return catalogos.flatMap((catalogo) =>
        catalogo._id === idBuscada ||
        (catalogo.hijas &&
          catalogo.hijas.some(
            (hija) => encontrarYExtraerIds([hija], idBuscada).length > 0,
          ))
          ? extraerIds(catalogo)
          : [],
      );
    }
    // Ejemplo de uso
    const idBuscada = '85a4475e446a5885b05739c4';
    const todasLasIds = encontrarYExtraerIds(res, idBuscada);
    // console.log(todasLasIds);
    // console.log(estado.ofertas);
    const ofertasFiltradas = estado.ofertas.filter((oferta: any) =>
      todasLasIds.includes(oferta.catalogo._id),
    );
    // PUNTO 520 OFERTAS
    // PROVEEDOR 143 OFERTAS

    // console.log(ofertasFiltradas);
  };

  const encontrarYExtraerIds = (catalogos, idBuscada) => {
    const extraerIds = (catalogo) => [
      catalogo._id,
      ...(catalogo.hijas ? catalogo.hijas.flatMap(extraerIds) : []),
    ];

    return catalogos.flatMap((catalogo) =>
      catalogo._id === idBuscada ||
      (catalogo.hijas &&
        catalogo.hijas.some(
          (hija) => encontrarYExtraerIds([hija], idBuscada).length > 0,
        ))
        ? extraerIds(catalogo)
        : [],
    );
  };

  const ctrlCatalogoCambios = (catalogo) => {
    const catalogoIDS = encontrarYExtraerIds(
      estado.catalogos,
      ofertaStore.catalogoSeleccionado._id,
    ); //@ts-ignore
    estado.ofertasFiltradas = estado.ofertas.filter((oferta: any) =>
      catalogoIDS.includes(oferta.catalogo._id),
    );
    estado.categoriaOpciones = categoriaSelectOptions(true);

    // console.log(estado.ofertasFiltradas);
  };

  const irEdicionOfertas = (oferta: Oferta) => {
    ofertaStore.oferta = oferta;
    ofertaStore.categoriaOpciones = estado.categoriaOpciones;

    router.push('ofertas/ofertaDetalle');
  };

  const categoriaSelectOptions = (nivel2 = true) => {
    const options = [];
    if (ofertaStore.catalogoSeleccionado.hijas.length == 0) {
      options.push({
        label: ofertaStore.catalogoSeleccionado.nombre,
        value: {
          _id: ofertaStore.catalogoSeleccionado._id,
          nombre: ofertaStore.catalogoSeleccionado.nombre,
        },
        class: 'option',
      });
    } else {
      for (const cat of ofertaStore.catalogoSeleccionado.hijas) {
        options.push({
          label: `${cat.nombre} (${cat.hijas.length})`,
          disable: true,
          class: 'title',
        });
        if (nivel2) {
          for (const subcat of cat.hijas) {
            options.push({
              label: subcat.nombre,
              value: { _id: subcat._id, nombre: subcat.nombre },
              class: 'option',
            });
          }
        }
      }
      // return options;
    }

    return options;
  };

  const crearOferta = async () => {
    const ofertaCreada = await ofertaService.crearOferta({
      ...estado.datos_ofertaBasica,
      catalogo: ofertaStore.catalogoSeleccionado._id,
    });

    if (ofertaCreada) {
      // ofertaStore.ofertas.push(ofertaCreada);
      // estado.ofertasFiltradas.push(ofertaCreada);

      NotifySucessCenter('Oferta creada con exito');
      estado.datos_ofertaBasica = init_crearOfertaBasico;
    }
    estado.modal.show_crearOfertaBasico = false;
  };

  return {
    estado,
    traerOfertas,
    actOfertasDB,
    ofertaStore,
    traerCatalagos,
    catalogosID,
    ctrlCatalogoCambios,
    irEdicionOfertas,
    categoriaSelectOptions,
    crearOferta,
  };
};
