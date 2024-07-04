import { productoService } from '../../API/productoService';
import { storeProducto } from '@/modulos/productos/negocio/producto.store';
import { useAuthStore } from '@/modulos/main/negocio/useAuthStore.js';
import type { Empaque, Entidad, Marca, Medida, Producto, Servicio } from '#gql';
import { useQuasar } from 'quasar';
import type { SelectOpcion } from '~/components/input/select.interface';

export const useDetalleProveedores = () => {
  const productoStore = storeProducto();
  const authStore = useAuthStore();
  const router = useRouter();
  const $q = useQuasar();

  /**
   * INIT
   */

  const init_servicioProducto = {
    servicioID: null as string,
    marca: null as string,
    proveedor: null as string,
    identificativo: null as string,
    precioConFactura: null as number,
    precioSinFactura: null as number,
    preciosPorMayor: [] as {
      cantidadMin: number;
      precioConFactura: number;
      precioSinFactura: number;
    }[],
  };

  const init_precioPorMayor = {
    cantidadMin: null as number,
    precioConFactura: null as number,
    precioSinFactura: null as number,
  };

  /**
   * ESTADO
   */

  const estado = reactive({
    producto: null as Producto,
    modal: {
      show_crearServicioProducto: false,
      show_modificarServicioProducto: false,
      show_crearProveedor: false,
      show_crearPrecioPorMayor: false,
    },
    serviciosProducto: [] as Servicio[],
    proveedores: [] as Entidad[],
    errorProveedor: '',
    proveedor: null as Entidad, // de tipo proveedor
    datos_servicioProducto: clone(
      init_servicioProducto,
    ) as typeof init_servicioProducto,
    proveedoresParaSelect: [] as SelectOpcion[],
    datos_preciosPorMayor: clone(
      init_precioPorMayor,
    ) as typeof init_precioPorMayor,
  });

  /**
   * FUNCIONES
   */

  const buscarProveedores = async () => {
    const proveedores = await productoService.buscarEntidadesProveedor();
    estado.proveedores = proveedores;
  };

  // const buscarProveedoresProducto = async () => {
  //   const proveedores = await productoService.buscarProveedoresProducto(
  //     productoStore.producto._id,
  //   );
  //   const resultado = [];
  //   for (const proveedor of proveedores) {
  //     resultado.push({
  //       ...proveedor,
  //       servicios: proveedor.servicios,
  //     });
  //   }
  //   estado.serviciosProducto = resultado;
  //   console.log('servicios', estado.serviciosProducto);
  // };

  const buscarServiciosProducto = async () => {
    const proveedores = await productoService.buscarProveedoresProducto(
      productoStore.producto._id,
    );
    let resultado = [];
    for (const proveedor of proveedores) {
      const serviciosConProveedor = proveedor.servicios.map((servicio) => {
        Object.assign(servicio, { proveedor });
        return servicio;
      });
      resultado = [...resultado, ...serviciosConProveedor];
    }
    estado.serviciosProducto = resultado;
    console.log('resultado', estado.serviciosProducto);
  };

  /**
   * Agregar precios por mayor
   */
  const agregarPrecio = () => {
    console.log(estado.datos_servicioProducto);
    console.log(estado.datos_preciosPorMayor);
    estado.datos_servicioProducto.preciosPorMayor.push(
      estado.datos_preciosPorMayor,
    );
    estado.modal.show_crearPrecioPorMayor = false;
    estado.datos_preciosPorMayor = init_precioPorMayor;
  };

  /**
   * Proveedor >> agregar proveedores
   */
  const crearServicioProducto = async () => {
    // preparamos los datos
    const datos = {
      producto: productoStore.producto._id,
      marca: estado.datos_servicioProducto.marca,
      identificativo: estado.datos_servicioProducto.identificativo,
      precioConFactura: estado.datos_servicioProducto.precioConFactura,
      precioSinFactura: estado.datos_servicioProducto.precioSinFactura,
      preciosPorMayor: estado.datos_servicioProducto.preciosPorMayor,
    };
    // hacemos la consulta con manejo de errores
    let proveedor;
    try {
      await loadingAsync(async () => {
        proveedor = await productoService.agregarServicio(
          estado.datos_servicioProducto.proveedor,
          datos,
        );
        console.log(proveedor);
        if (!proveedor) throw 'No se pudo agregar el proveedor';
      });
    } catch (e) {
      if (isApiError(e, 'B206')) {
        estado.errorProveedor = 'Este proveedor ya existe';
      } else {
        NotifyError(`Error no tratado, ver consola`);
        console.log('error:', e);
      }
      return;
    }
    // ponemos al dia el productoStore
    const nuevoServicio = proveedor.servicios.pop();
    Object.assign(nuevoServicio, { proveedor });
    estado.serviciosProducto.push(nuevoServicio);
    // Avisamos que todo bien y reinicializamos el dialog
    NotifySucessCenter('Proveedor creado correctamente');
    estado.datos_servicioProducto = init_servicioProducto;
    estado.datos_preciosPorMayor = init_precioPorMayor;
    estado.modal.show_crearServicioProducto = false;
  };

  /**
   * Proveedor >> modificar servicio (lapiz)
   */

  const modalModificarServicioProducto = (servicio: any) => {
    estado.modal.show_modificarServicioProducto = true;
    estado.modal.show_crearServicioProducto = true;
    estado.datos_servicioProducto.servicioID = servicio._id;
    estado.datos_servicioProducto.marca = servicio.marca;
    estado.datos_servicioProducto.identificativo = servicio.identificativo;
    estado.datos_servicioProducto.precioSinFactura = servicio.precioSinFactura;
    estado.datos_servicioProducto.precioConFactura = servicio.precioConFactura;
    estado.datos_servicioProducto.preciosPorMayor = servicio.preciosPorMayor;
    estado.datos_servicioProducto.proveedor = servicio.proveedor._id;
    estado.datos_servicioProducto = init_servicioProducto;
    estado.datos_preciosPorMayor = init_precioPorMayor;
  };

  const modificarServicioProducto = async () => {
    // preparamos los datos
    const datos = {
      identificativo: estado.datos_servicioProducto.identificativo,
      precioConFactura: estado.datos_servicioProducto.precioConFactura,
      precioSinFactura: estado.datos_servicioProducto.precioSinFactura,
      preciosPorMayor: {
        reemplazar: estado.datos_servicioProducto.preciosPorMayor,
      },
    };
    console.log(datos);
    // hacemos la consulta con manejo de errores
    let proveedor;
    try {
      await loadingAsync(async () => {
        proveedor = await productoService.modificarServicioProducto(
          estado.datos_servicioProducto.proveedor,
          estado.datos_servicioProducto.servicioID,
          datos,
        );
      });
      if (!proveedor) throw 'No se pudo modificar el producto';
    } catch (e) {
      if (isApiError(e, 'B206')) {
        estado.errorProveedor = 'Este proveedor ya existe';
      } else {
        NotifyError(`Error no tratado, ver consola`);
        console.log('error:', e);
      }
      return;
    }
    // ponemos al dia el productoStore
    const indexMod = estado.serviciosProducto.findIndex(
      (v) => v._id === estado.datos_servicioProducto.servicioID,
    );
    const indexStore = proveedor.servicios.findIndex(
      (v) => v._id === estado.datos_servicioProducto.servicioID,
    );
    if (indexStore !== -1 && indexMod !== -1) {
      const servicio = proveedor.servicios[indexMod];
      console.log('servicio:', indexStore, indexMod, proveedor.servicios);
      Object.assign(servicio, { proveedor });
      estado.serviciosProducto[indexStore] = servicio;
    }
    // Avisamos que todo bien y reinicializamos el dialog
    NotifySucessCenter('Proveedor modificado correctamente');
    estado.datos_servicioProducto = init_servicioProducto;
    estado.datos_preciosPorMayor = init_precioPorMayor;
    estado.modal.show_modificarServicioProducto = false;
    estado.modal.show_crearServicioProducto = false;
  };

  const crearProveedorGlobal = async () => {
    const proveedorCreado = await productoService.crearEntidadProveedor({
      nombre: estado.proveedor.nombre,
      descripcion: estado.proveedor.descripcion,
    });
    if (proveedorCreado) {
      NotifySucessCenter('Proveedor creado correctamente');
      estado.proveedor.nombre = '';
      estado.proveedor.descripcion = ''; //@ts-ignore
      estado.proveedores.push(proveedorCreado);
    }
    estado.datos_servicioProducto.proveedor = proveedorCreado._id;
    estado.modal.show_crearProveedor = false;
  };

  return {
    estado,
    productoStore,
    authStore,
    agregarPrecio,
    buscarProveedores,
    crearServicioProducto,
    modalModificarServicioProducto,
    modificarServicioProducto,
    crearProveedorGlobal,
    buscarServiciosProducto,
  };
};
