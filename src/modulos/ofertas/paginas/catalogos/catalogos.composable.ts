import type { Catalogo } from "#gql";
import { catalogoService } from "./catalogo.service";
import { useQuasar } from "quasar";
import { storeOferta } from "@/modulos/ofertas/ofertas.store";

const init_catalogoCategoria = {
  _id: null as string,
  nombre: null as string,
};

export const useCatalogos = () => {
  const ofertaStore = storeOferta();
  const router = useRouter();
  const $q = useQuasar();

  const estado = reactive({
    catalogoSeleccionado: null as Catalogo[],
    catalogos: [] as Catalogo[],

    modal: {
      show_agregarCatalogo: false,
      show_agregarCategoriaCatalogo: false,
      show_modificarCategoriaCatalogo: false,
    },

    datos_catalogoCategoria: clone(init_catalogoCategoria),
  });

  /**
   * Trae todos los catalogos de la BD y los guarda en el estado y store
   */
  const traerCatalagoso = async () => {
    const { catalogoArbol: catalogos } = await GqlCatalogoArbol({
      busqueda: { nombre: ["CATALOGO RAIZ"] },
    });
    //@ts-ignore
    if (catalogos) ofertaStore.catalogos = estado.catalogos = catalogos?.hijas;

    if (ofertaStore.catalogoSeleccionado == null)
      ofertaStore.catalogoSeleccionado = catalogos[0];
  };

  const irCatalogoID = (id: string) => {
    router.push(`catalogos/${id}`);
  };

  const obtenerCatalogoId = async (catalogoId: string) => {
    const catalogoArbol = await catalogoService.buscarCatalogoID({
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
    const catalogoCreado = await catalogoService.crearCatalogo({
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
    const catalogoModificado = await catalogoService.modificarCatalogo(
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
      const catalogoBorrada = await catalogoService.borrarCatalogo({
        _id: [row._id],
      });
      if (catalogoBorrada) {
        NotifySucessCenter("Catalogo eliminada correctamente");
        obtenerCatalogoId(catalogoID);
      }
    });
  };

  const obtenerTodasCategorias = async () => {
    const [categoriaArbol] = await catalogoService.obtenerTodasCategorias();

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
    traerCatalagoso,
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
