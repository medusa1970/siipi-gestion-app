import type { Catalogo } from "#gql";
import { useQuasar } from "quasar";
import { useOfertas } from "~/modulos/ofertas/ofertas.composable";

/**
 * Permisos requeridos para esta pagina
 */
export const permisosCatalogos = ["ACCEDER"];

/**
 * Composable
 */
const init_catalogoCategoria = {
  _id: null as string,
  nombre: null as string,
};

export const useCatalogos = () => {
  const $q = useQuasar();
  const { store, authStore, estadoOfertas, router } = useOfertas();
  if (!authStore.autorizar(permisosCatalogos)) goTo(router, "noAutorizado");

  const estado = reactive({
    catalogoSeleccionado: null as Catalogo,
    modal: {
      show_agregarCatalogo: false,
      show_agregarCategoriaCatalogo: false,
      show_modificarCategoriaCatalogo: false,
    },
    datos_catalogoCategoria: clone(init_catalogoCategoria),
  });

  const modalCrearCatalogoCategoria = (datos: any) => {
    estado.modal.show_agregarCategoriaCatalogo = true;
    estado.datos_catalogoCategoria._id = datos._id;
    estado.datos_catalogoCategoria.nombre = null;
  };

  const crearCatalogoArbol = async (catalogoID: string) => {
    let catalogoCreado;
    try {
      catalogoCreado = await api.crearCatalogo({
        nombre: estado.datos_catalogoCategoria.nombre,
        pariente: estado.datos_catalogoCategoria._id,
      });
      if (!catalogoCreado) throw "No se pudo crear el catalogo";
    } catch (err) {
      errFallBack(err);
    }
    estado.catalogoSeleccionado = await store.refreshCatalogoArbol(catalogoID);
    NotifySucessCenter("Categoria creada correctamente");
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
      catalogoModificado = await api.modificarCatalogo(
        { _id: [estado.datos_catalogoCategoria._id] },
        { nombre: estado.datos_catalogoCategoria.nombre },
      );
      if (!catalogoModificado) throw "No se pudo modificar el catalogo";
    } catch (err) {
      errFallBack(err);
    }
    NotifySucessCenter("Catalogo modificado correctamente");
    estado.catalogoSeleccionado = await store.refreshCatalogoArbol(catalogoID);
    estado.modal.show_modificarCategoriaCatalogo = false;
  };

  const borrarCatalogoArbol = async (row: any, catalogoID: string) => {
    $q.dialog({
      title: `Eliminar ${row.nombre}`,
      message: `¿Está seguro de eliminar este catalogo${
        row.hijas?.length > 0
          ? ", tiene " + row.hijas.length + " subcategorias"
          : ""
      }?`,
      cancel: true,
      persistent: true,
    }).onOk(async () => {
      try {
        await api.borrarCatalogo({
          _id: [row._id],
        });
      } catch (err) {
        errFallBack(err);
      }
      NotifySucessCenter("Catalogo eliminada correctamente");
      estado.catalogoSeleccionado = await store.refreshCatalogoArbol(
        catalogoID,
      );
    });
  };

  return {
    estado,
    store,
    authStore,
    router,
    crearCatalogoArbol,
    modalCrearCatalogoCategoria,
    modalModificarCatalogoCategoria,
    modificarCatalogoArbol,
    borrarCatalogoArbol,
  };
};
