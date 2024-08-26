import type { Catalogo } from '#gql';
import { useQuasar } from 'quasar';
import { useOfertas } from '~/modulos/ofertas/ofertas.composable';

/**
 * Permisos requeridos para esta pagina
 */
export const permisosCatalogos = ['ADQUISICION', 'LOGISTICA', 'ALMACEN'];

/**
 * Composable
 */
const init_catalogoCategoria = {
  _id: null as string,
  nombre: null as string
};

export const useCatalogos = () => {
  const $q = useQuasar();
  const { store, authStore, router, route } = useOfertas();
  if (!authStore.autorizar(permisosCatalogos)) goTo(router, 'noAutorizado');

  const estado = reactive({
    catalogoId: null as string,
    catalogoSeleccionado: null as Catalogo,
    modal: {
      show_agregarCatalogo: false,
      show_agregarCategoriaCatalogo: false,
      show_modificarCategoriaCatalogo: false
    },
    datos_catalogoCategoria: clone(init_catalogoCategoria)
  });

  const modalCrearCatalogoCategoria = (datos: any) => {
    estado.modal.show_agregarCategoriaCatalogo = true;
    estado.datos_catalogoCategoria._id = datos._id;
    estado.datos_catalogoCategoria.nombre = null;
  };

  const crearCatalogoArbol = async (catalogoID: string) => {
    let catalogoCreado;
    try {
      catalogoCreado = await crearUno(GqlCrearCatalogos, {
        datos: {
          nombre: estado.datos_catalogoCategoria.nombre,
          pariente: estado.datos_catalogoCategoria._id
        }
      });
      if (!catalogoCreado) throw 'No se pudo crear el catalogo';
    } catch (err) {
      errFailback(err);
    }
    NotifySucessCenter('Catalogo creado correctamente');
    estado.catalogoSeleccionado = await store.getCatalogoArbol(
      estado.catalogoSeleccionado._id
    );
    estado.datos_catalogoCategoria = clone(init_catalogoCategoria);
    estado.modal.show_agregarCategoriaCatalogo = false;
  };

  const modalModificarCatalogoCategoria = (datos: any) => {
    estado.modal.show_modificarCategoriaCatalogo = true;
    estado.datos_catalogoCategoria._id = datos._id;
    estado.datos_catalogoCategoria.nombre = datos.nombre;
  };

  const modificarCatalogoArbol = async (catalogoID: string) => {
    let catalogoModificado;
    try {
      catalogoModificado = await modificarUno(GqlModificarCatalogos, {
        busqueda: { _id: [estado.datos_catalogoCategoria._id] },
        datos: { nombre: estado.datos_catalogoCategoria.nombre }
      });
      if (!catalogoModificado) throw 'No se pudo modificar el catalogo';
    } catch (err) {
      errFailback(err);
    }
    NotifySucessCenter('Catalogo modificado correctamente');
    estado.catalogoSeleccionado = await store.getCatalogoArbol(catalogoID);
    estado.modal.show_modificarCategoriaCatalogo = false;
  };

  const borrarCatalogoArbol = async (row: any, catalogoID: string) => {
    $q.dialog({
      title: `Eliminar ${row.nombre}`,
      message: `¿Está seguro de eliminar este catalogo${
        row.hijas?.length > 0
          ? ', tiene ' + row.hijas.length + ' subcategorias'
          : ''
      }?`,
      cancel: true,
      persistent: true
    }).onOk(async () => {
      try {
        await borrarVarios(GqlBorrarCatalogos, {
          busqueda: { _id: [row._id] }
        });
      } catch (err) {
        errFailback(err);
      }
      NotifySucessCenter('Catalogo eliminada correctamente');
      estado.catalogoSeleccionado = await store.getCatalogoArbol(catalogoID);
    });
  };

  return {
    estado,
    store,
    authStore,
    router,
    route,
    crearCatalogoArbol,
    modalCrearCatalogoCategoria,
    modalModificarCatalogoCategoria,
    modificarCatalogoArbol,
    borrarCatalogoArbol
  };
};
