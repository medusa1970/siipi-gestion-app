import { productoService } from '../../API/productoService';
import { storeProducto } from '@/modulos/productos/negocio/producto.store';
import { useAuthStore } from '@/modulos/main/negocio/useAuthStore.js';
import type { Empaque, Entidad, Marca, Medida, Producto, Servicio } from '#gql';
import { useQuasar } from 'quasar';
import type { SelectOpcion } from '~/components/input/select.interface';

export const useDetalleMedida = () => {
  const productoStore = storeProducto();
  const authStore = useAuthStore();
  const router = useRouter();
  const $q = useQuasar();

  /**
   * INIT
   */

  const init_productoMedida = {
    medida: null as string,
    empaque: {
      _id: null as string,
      marca: undefined as string,
      nombre: null as string,
      abreviacion: null as string,
      cantidad: null as number,
    },
    marca: null as string,
  };

  /**
   * ESTADO
   */

  const estado = reactive({
    producto: null as Producto,
    modal: {
      show_crearProductoEmpaque: false,
      show_modificarProductoEmpaque: false,
      show_crearMedida: false,
      show_crearEmpaque: false,
    },
    medidas: [] as Medida[], // lista de las medidas
    empaque: null as Empaque, // para crear un empaque de medida global
    medida: null as Medida, // para crear medida al nivel global
    datos_productoMedida: init_productoMedida,
    resetEmpaque: null,
  });

  /**
   * FUNCIONES
   */

  /**
   * buscar todas las medidas
   */
  const buscarMedidas = async () => {
    const medidas = await productoService.buscarMedidas();
    estado.medidas = medidas;
    console.log(medidas);
  };

  /**
   * Guardar la medida basica
   */
  const guardarMedidaBasicaProducto = async () => {
    // hacemos la consulta con manejo de errores
    let producto;
    try {
      producto = await productoService.guardarMedidaProducto(
        productoStore.producto._id,
        estado.datos_productoMedida.medida,
      );
      if (!producto) throw 'No se pudo modificar el producto';
    } catch (e) {
      NotifyError(`Error no tratado, ver consola`);
      console.log('error:', e);
      return;
    }
    // Avisamos que todo bien
    NotifySucess('Medida guardada correctamente');
    // ponemos al dia el productoStore
    const medida = estado.medidas.find(
      (medida) => medida._id === producto.medida._id,
    );
    productoStore.producto.medida = medida;
  };

  /**
   * Crear un empaque (boton)
   */
  const crearProductoEmpaque = async () => {
    // preparamos los datos
    const datos = {
      marca: estado.datos_productoMedida.empaque.marca,
      nombre: estado.datos_productoMedida.empaque.nombre,
      abreviacion: estado.datos_productoMedida.empaque.abreviacion,
      cantidad: estado.datos_productoMedida.empaque.cantidad,
    };
    // hacemos la consulta con manejo de errores
    let productoModificado;
    try {
      productoModificado = await productoService.agregarProductosMedidaEmpaque(
        productoStore.producto._id,
        datos,
      );
      if (!productoService) throw 'No se pudo modificar el producto';
    } catch (e) {
      NotifyError(`Error no tratado, ver consola`);
      console.log('error:', e);
      return;
    }
    // Avisamos que todo bien y reinicializamos el dialog
    NotifySucessCenter('Medida&Empaque creado correctamente');
    estado.modal.show_crearProductoEmpaque = false;
    estado.datos_productoMedida.empaque = init_productoMedida.empaque;
    // ponemos al dia el productoStore
    const nuevaMedida = productoModificado.empaques.pop();
    productoStore.producto.empaques.push(nuevaMedida);
  };

  /**
   * Inicializar el modal de modificacion de empaque
   */
  const modalModificarProductoEmpaque = (empaque: any) => {
    estado.modal.show_modificarProductoEmpaque = true;
    estado.modal.show_crearProductoEmpaque = true;
    estado.datos_productoMedida.empaque = {
      _id: empaque._id,
      nombre: empaque.nombre,
      marca: empaque.marca._id,
      abreviacion: empaque.abreviacion,
      cantidad: empaque.cantidad,
    };
  };

  /**
   * Modificar un empaque (icono lapiz)
   */
  const modificarProductoEmpaque = async () => {
    // preparamos los datos
    const datos = {
      nombre: estado.datos_productoMedida.empaque.nombre,
      marca: estado.datos_productoMedida.empaque.marca,
      abreviacion: estado.datos_productoMedida.empaque.abreviacion,
      cantidad: estado.datos_productoMedida.empaque.cantidad,
    };
    // hacemos la consulta con manejo de errores
    let productoEmpaque;
    try {
      const productoEmpaque = await productoService.modificarEmpaqueProducto(
        productoStore.producto._id,
        estado.datos_productoMedida.empaque._id,
        datos,
      );
      if (!productoEmpaque) throw 'No se pudo modificar el producto';
    } catch (e) {
      NotifyError(`Error no tratado, ver consola`);
      console.log('error:', e);
      return;
    }
    // Avisamos que todo bien y reinicializamos el dialog
    NotifySucessCenter('Marca modificado correctamente');
    estado.modal.show_crearProductoEmpaque = false;
    estado.modal.show_modificarProductoEmpaque = false;
    estado.datos_productoMedida.empaque = init_productoMedida.empaque;
    // ponemos al dia el productoStore
    productoStore.producto.empaques = productoStore.producto.empaques.map((e) =>
      e._id === estado.datos_productoMedida.empaque._id
        ? {
            _id: estado.datos_productoMedida.empaque._id,
            marca: productoStore.producto.variedades.find(
              (v) => v.marca._id === estado.datos_productoMedida.empaque.marca,
            ).marca,
            cantidad: estado.datos_productoMedida.empaque.cantidad,
            nombre: estado.datos_productoMedida.empaque.nombre,
            abreviacion: estado.datos_productoMedida.empaque.abreviacion,
          }
        : e,
    );
  };

  /**
   * Prellenar el empaque con seleccionar un tipo de empaque
   */
  const prellenarEmpaque = async (empaqueID) => {
    const empaque = productoStore.producto.medida.tipoEmpaques.find(
      (tipoE) => tipoE._id === empaqueID,
    );
    if (!empaque) {
      // return false;
    }
    estado.resetEmpaque = 'Eligido ' + empaque.nombre;
    estado.datos_productoMedida.empaque.cantidad = empaque.cantidad;
    estado.datos_productoMedida.empaque.nombre = empaque.nombre;
    estado.datos_productoMedida.empaque.abreviacion = empaque.abreviacion;
    await setTimeout(() => {
      estado.resetEmpaque = null;
    }, 1500);
  };

  return {
    estado,
    productoStore,
    authStore,
    buscarMedidas,
    guardarMedidaBasicaProducto,
    crearProductoEmpaque,
    modificarProductoEmpaque,
    modalModificarProductoEmpaque,
    prellenarEmpaque,
  };
};
