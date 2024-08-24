import { useQuasar } from 'quasar';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';

/**
 * Permisos requeridos para esta pagina
 */
export const permisosCategoria = ['ADQUISICION', 'LOGISTICA', 'ALMACEN'];

/**
 * Composable
 */

const init_categoria = {
  _id: null as string,
  nombre: null as string
};

export const useCategorias = () => {
  const { store, authStore, router } = useAlmacen();
  if (!authStore.autorizar(permisosCategoria)) goTo(router, 'noAutorizado');

  const $q = useQuasar();

  const estado = reactive({
    categorias: [] as any,

    modal: {
      show_agregarCategoria: false,
      show_modificarCategoria: false
    },

    datos_categoria: clone(init_categoria)
  });

  // BUSCAR
  const buscarCategorias = async () => {
    const { categoriaArbol } = await GqlCategoriaArbol({
      busqueda: { nombre: ['CATEGORIA RAIZ'] }
    });
    estado.categorias = [categoriaArbol];

    const data = [
      {
        label: categoriaArbol.nombre,
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        children: categoriaArbol.hijas.map((hija: any) => ({
          icon: 'room_service',
          label: hija.nombre,
          children: hija.hijas.map((hija2: any) => ({
            label: hija2.nombre
          }))
        }))
      }
    ]; //@ts-ignore
    // console.log(data);
  };

  // AGREGAR
  const modalCrearCategoria = (datos: any) => {
    estado.modal.show_agregarCategoria = true;

    estado.datos_categoria._id = datos._id;
  };

  const crearCategoriaArbol = async () => {
    try {
      await crearUno(GqlCrearCategorias, {
        datos: {
          nombre: estado.datos_categoria.nombre,
          pariente: estado.datos_categoria._id
        },
        opciones: { populate: true }
      });
    } catch (err) {
      estado.modal.show_agregarCategoria = false;
      errFailback(err);
      return;
    }
    await buscarCategorias();
    NotifySucessCenter('Categoria creada correctamente');
    estado.datos_categoria = clone(init_categoria);
  };

  // MODIFICAR
  const modalModificarCategoria = (datos: any) => {
    estado.modal.show_modificarCategoria = true;
    estado.datos_categoria._id = datos._id;
    estado.datos_categoria.nombre = datos.nombre;
  };

  const modificarCategoriaArbol = async () => {
    try {
      const categoriaModificada = await crearVarios(GqlCrearCategorias, {
        busqueda: { _id: estado.datos_categoria._id },
        datos: { nombre: estado.datos_categoria.nombre },
        opciones: { populate: true }
      });
    } catch (err) {
      estado.modal.show_modificarCategoria = false;
      errFailback(err);
      return;
    }
    await buscarCategorias();
    NotifySucessCenter('Categoria modificada correctamente');
    estado.datos_categoria = clone(init_categoria);
  };

  // BORRAR
  const borrarCategoriaArbol = async (row: any) => {
    $q.dialog({
      title: `Eliminar ${row.nombre}`,
      message: `¿Está seguro de eliminar esta categoria${
        row.hijas?.length > 0
          ? ', tiene ' + row.hijas.length + ' subcategorias'
          : ''
      }?`,
      cancel: true,
      persistent: true
    }).onOk(async () => {
      try {
        const categoriaBorrada = await borrarUno(GqlBorrarCategorias, {
          busqueda: row._id
        });
      } catch (err) {
        errFailback(err);
        return;
      }
      NotifySucessCenter('Categoria eliminada correctamente');
      await buscarCategorias();
    });
  };

  return {
    estado,
    store,
    authStore,
    router,
    buscarCategorias,
    modalCrearCategoria,
    crearCategoriaArbol,
    modalModificarCategoria,
    modificarCategoriaArbol,
    borrarCategoriaArbol
  };
};
