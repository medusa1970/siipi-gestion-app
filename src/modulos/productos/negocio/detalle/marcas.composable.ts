import { productoService } from '../../API/productoService';
import { storeProducto } from '@/modulos/productos/negocio/producto.store';
import { useAuthStore } from '@/modulos/main/negocio/useAuthStore.js';
import type { Empaque, Entidad, Marca, Medida, Producto, Servicio } from '#gql';
import { useQuasar } from 'quasar';
import type { SelectOpcion } from '~/components/input/select.interface';

export const useDetalleMarcas = () => {
  const productoStore = storeProducto();
  const authStore = useAuthStore();
  const router = useRouter();
  const $q = useQuasar();

  /**
   * INIT
   */

  const init_productoMarca = {
    _id: null as string,
    cantidadMax: null as number,
    cantidadMin: null as number,
    imagen: null as { data: string; mimetype: string },
    marca: null as string,
  };

  /**
   * ESTADO
   */

  const estado = reactive({
    producto: null as Producto,
    modal: {
      show_crearProductoMarca: false,
      show_modificarProductoMarca: false,
      show_crearMarca: false,
    },
    marcas: [] as Marca[], // lista de las marcas
    marca: null as Marca, // para crear marca al nivel global
    datos_productoMarca: init_productoMarca,
    marcasParaSelect: [] as SelectOpcion[],
    errorMarca: '',
  });

  /**
   * ESTADO
   */

  /**
   * buscarMarcas
   */
  const buscarMarcas = async () => {
    estado.marcas = await productoService.buscarMarcas();
  };

  /**
   * crearMarcaGlobal
   */
  const crearMarcaGlobal = async () => {
    let marcaNueva;
    try {
      await loadingAsync(async () => {
        marcaNueva = await productoService.crearMarca({
          nombre: estado.marca.nombre,
        });
      });
      if (!marcaNueva) throw 'No se pudo modificar el producto';
    } catch (e) {
      if (isApiError(e, 'B206')) {
        NotifyError(`Error 206`);
      } else {
        NotifyError(`Error no tratado, ver consola`);
        console.log('error:', e);
      }
      return;
    }
    NotifySucessCenter('Marca creado correctamente');
    estado.marcas.push(marcaNueva);
    estado.modal.show_crearMarca = false;
    estado.datos_productoMarca.marca = marcaNueva._id;
  };

  /**
   * Marcas >> Registrar una marca
   */

  const crearProductoMarca = async () => {
    // preparacion de los datos
    const datos = {
      marca: estado.datos_productoMarca.marca,
      cantidadMin: estado.datos_productoMarca.cantidadMin,
      cantidadMax: estado.datos_productoMarca.cantidadMax,
      imagen: estado.datos_productoMarca.imagen,
    };
    if (estado.datos_productoMarca.imagen) {
      Object.assign(datos, {
        imagen: estado.datos_productoMarca.imagen,
      });
    }
    // hacemos la consulta
    let productoModificado;
    try {
      await loadingAsync(async () => {
        productoModificado = await productoService.crearProductosMarca(
          productoStore.producto._id,
          datos,
        );
        if (!productoModificado) throw 'No se pudo modificar el producto';
      });
    } catch (e) {
      if (isApiError(e, 'B206')) {
        estado.errorMarca = 'Esta marca ya esta registrada';
      } else {
        NotifyError(`Error no tratado, ver consola`);
        console.log('error:', e);
      }
      return;
    }
    NotifySucessCenter('Marca creado correctamente');
    const nuevaMarca = productoModificado.variedades.pop();
    productoStore.producto.variedades.push(nuevaMarca);
    estado.modal.show_crearProductoMarca = false;
    estado.datos_productoMarca = init_productoMarca;
  };

  /**
   * Marcas >> Modificar una marca (icono lapiz)
   * (preparacion del modal)
   */

  const modalModificarProductoMarca = (marca) => {
    // mostrar el modal en modo "modificar"
    estado.modal.show_modificarProductoMarca = true;
    estado.modal.show_crearProductoMarca = true;

    // inicializar el formulario
    for (const key in estado.datos_productoMarca) {
      estado.datos_productoMarca[key] =
        key === 'marca' ? marca[key]._id : marca[key];
    }
  };

  /**
   * Marcas >> Modificar una marca (icono lapiz)
   */
  const modificarProductoMarca = async () => {
    // preparacion de los datos
    const datos = {
      cantidadMax: estado.datos_productoMarca.cantidadMax,
      cantidadMin: estado.datos_productoMarca.cantidadMin,
    };
    if (estado.datos_productoMarca.imagen) {
      Object.assign(datos, {
        imagen: estado.datos_productoMarca.imagen,
      });
    }
    // hacemos la consulta
    let marcaModificada;
    try {
      marcaModificada = await productoService.modificarProductosMarca(
        productoStore.producto._id,
        estado.datos_productoMarca._id,
        datos,
      );
      if (!marcaModificada) throw 'No se pudo modificar el producto';
    } catch (e) {
      NotifyError(`Error no tratado, ver consola`);
      console.log('error:', e);
      return;
    }
    NotifySucessCenter('Marca modificado correctamente');
    // encontrar index de la variedad modificada
    const index = productoStore.producto.variedades.findIndex(
      (v) => v._id === estado.datos_productoMarca._id,
    );
    if (index !== -1) {
      // encontrar objeto variedad modificada
      const variedadModificada = marcaModificada.variedades.find(
        (v: any) => v._id === estado.datos_productoMarca._id,
      );
      // Si se encontró la variedad modificada, actualiza la variedad en el array con la variedad modificada
      if (variedadModificada) {
        productoStore.producto.variedades[index] = variedadModificada;
      }
      estado.modal.show_modificarProductoMarca = false;
      estado.modal.show_crearProductoMarca = false;
    }
  };

  return {
    productoStore,
    authStore,
    estado,
    buscarMarcas,
    crearMarcaGlobal,
    crearProductoMarca,
    modificarProductoMarca,
    modalModificarProductoMarca,
  };
};
