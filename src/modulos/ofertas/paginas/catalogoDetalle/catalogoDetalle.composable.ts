import type { Catalogo } from "#gql";
import { useQuasar } from "quasar";
import { apiOfertas } from "@/modulos/ofertas/API/ofertas.api";

const init_catalogoCategoria = {
  _id: null as string,
  nombre: null as string,
};

export const useCatalogoDetalle = () => {
  const router = useRouter();
  const $q = useQuasar();

  const estado = reactive({
    catalogoSeleccionado: null as Catalogo[],

    modal: {
      show_agregarCatalogo: false,
      show_agregarCategoriaCatalogo: false,
      show_modificarCategoriaCatalogo: false,
    },

    datos_catalogoCategoria: clone(init_catalogoCategoria),
  });

  const irCatalogoID = (id: string) => {
    router.push(`catalogos/${id}`);
  };

  const obtenerCatalogoId = async (catalogoId: string) => {
    const catalogoArbol = await apiOfertas.buscarArbolCatalogos({
      _id: [catalogoId],
    });
    if (catalogoArbol) estado.catalogoSeleccionado = [catalogoArbol];
    return catalogoArbol;
  };

  const modalCrearCatalogoCategoria = (datos: any) => {
    estado.modal.show_agregarCategoriaCatalogo = true;

    estado.datos_catalogoCategoria._id = datos._id;
  };

  const crearCatalogoArbol = async (catalogoID: string) => {
    const catalogoCreado = await api.crearCatalogo({
      nombre: estado.datos_catalogoCategoria.nombre,
      pariente: estado.datos_catalogoCategoria._id,
    });
    if (catalogoCreado) {
      obtenerCatalogoId(catalogoID);
      NotifySucessCenter("Categoria creada correctamente");
      estado.datos_catalogoCategoria = clone(init_catalogoCategoria);
    }
    estado.modal.show_agregarCategoriaCatalogo = false;
  };

  const modalModificarCatalogoCategoria = (datos: any) => {
    estado.modal.show_modificarCategoriaCatalogo = true;
    estado.datos_catalogoCategoria._id = datos._id;
    estado.datos_catalogoCategoria.nombre = datos.nombre;
  };
  const modificarCatalogoArbol = async (catalogoID: string) => {
    const catalogoModificado = await api.modificarCatalogo(
      { _id: [estado.datos_catalogoCategoria._id] },
      { nombre: estado.datos_catalogoCategoria.nombre }
    );
    if (catalogoModificado) {
      NotifySucessCenter("Catalogo modificado correctamente");
      obtenerCatalogoId(catalogoID);
    }
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
      const catalogoBorrada = await api.borrarCatalogo({
        _id: [row._id],
      });
      if (catalogoBorrada) {
        NotifySucessCenter("Catalogo eliminada correctamente");
        obtenerCatalogoId(catalogoID);
      }
    });
  };

  const obtenerTodasCategorias = async () => {
    const categoriaArbol = await apiOfertas.buscarArbolCatalogosRaiz();

    const data = [
      {
        label: categoriaArbol.nombre,
        avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
        children: categoriaArbol.hijas.map((hija: any) => ({
          icon: "room_service",
          label: hija.nombre,
          children: hija.hijas.map((hija2: any) => ({
            label: hija2.nombre,
          })),
        })),
      },
    ];
    // estado.props = data;
  };

  return {
    estado,
    irCatalogoID,
    obtenerCatalogoId,
    crearCatalogoArbol,
    modalCrearCatalogoCategoria,
    modalModificarCatalogoCategoria,
    modificarCatalogoArbol,
    borrarCatalogoArbol,
    obtenerTodasCategorias,
  };
};
