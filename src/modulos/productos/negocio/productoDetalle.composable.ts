import { productoService } from '../API/productoService';
import { storeProducto } from '@/modulos/productos/negocio/producto.store';
import { useAuthStore } from '@/modulos/main/negocio/useAuthStore.js';
import type { Marca, Medida, Producto } from '#gql';
import { useQuasar } from 'quasar';

/*
interface ModificarProductoBasico {
  nombre: string;
  categoria: string;
  comentario: string | null | undefined;
  imagen: { data: string; mimetype: string };
}
interface ProductoMarca {
  _id: string;
  cantidadMax: number;
  cantidadMin: number;
  imagen: { data: string; mimetype: string };
  marca: string;
}
*/

export const useProductoDetalle = () => {
  /** DECLARACIONES */
  const productoStore = storeProducto();
  const authStore = useAuthStore();
  const { $socket } = useNuxtApp();
  const router = useRouter();
  const $q = useQuasar();

  /** Modificar PRoducto Basico */
  const init_modificarProductoBasico = {
    nombre: null as string,
    categoria: null as string,
    comentario: null as string | null | undefined,
    imagen: null as { data: string; mimetype: string },
  };

  /** Modificar Producto Marca */
  const init_productoMarca = {
    _id: null as string,
    cantidadMax: null as number,
    cantidadMin: null as number,
    imagen: null as { data: string; mimetype: string },
    marca: null as string,
  };

  /** Modificar Producto Medidas y empaques */
  const init_productoMedida = {
    medida: {
      _id: null as string,
      nombre: null as string,
      tipoEmpaques: [] as {
        nombre: string;
        abreviacion: string;
        cantidad: number;
      }[],
    },
    empaque: {
      _id: null as string,
      nombre: null as string,
      abreviacion: null as string,
      cantidad: null as number,
    },
    marca: {
      _id: null as string,
      nombre: null as string,
    },
    cantidad: null as number,
  };

  /** Modificar Proveedores */
  const init_productoProveedor = {
    servicioID: null as string,
    marca: {
      _id: null as string,
      nombre: null as string,
    },
    proveedor: {
      _id: null as string,
      nombre: null as string,
    },
    identificativo: null as string,
    precioConFactura: null as number,
    precioSinFactura: null as number,
    precios: [],
  };

  /** Estado */
  const estado = reactive({
    // productos en la lista
    productos: [] as Producto[],

    // producto activo para modificar
    producto: {} as Producto,

    // tab por defecto
    tab: 'datosBasicos',

    // opciones de los selects
    categoriaSelectOpciones: [] as any[],

    // modales
    modal: {
      show_crearProductoBasico: false,
      show_informacionProducto: false,
      show_crearProductoMarca: false,
      show_modificarProductoMarca: false,
      show_crearProductoEmpaque: false,
      show_modificarProductoEmpaque: false,
      show_crearProductoProveedor: false,
      show_modificarProductoProveedor: false,

      show_crearMarca: false,
      show_crearMedida: false,
      show_crearEmpaque: false,
      show_crearProveedor: false,
    },

    marcas: [] as Marca[],
    marcasSelectOpciones: [],
    marca: {
      _id: '',
      nombre: '',
    },
    medidas: [] as Medida[],
    medida: {} as Medida,
    empaque: {
      nombre: '',
      abreviacion: '',
      cantidad: 0,
    },

    datos_modificarProductoBasico: init_modificarProductoBasico,
    modProductoBasicoImagen: null,

    datos_productoMarca: init_productoMarca,
    errorMarca: null,

    datos_productoMedida: init_productoMedida,

    showTableEmpaque: false,

    proveedoresProducto: [],
    proveedores: [],
    proveedor: {
      _id: '',
      nombre: '',
      descripcion: '',
    },
    datos_productoProveedor: init_productoProveedor,
    motivoEliminacion: '',
  });

  /** FUNCIONES */

  /**
   ********************* DATOS BASICOS *********************
   */

  /**
   * Datos básicos >> Guardar
   */

  const modificarProductoBasico = async () => {
    // preparacion de los datos
    const datos = {
      nombre: estado.datos_modificarProductoBasico.nombre,
      categoria: estado.datos_modificarProductoBasico.categoria,
      comentario: estado.datos_modificarProductoBasico.comentario,
    };
    if (estado.datos_modificarProductoBasico.imagen) {
      Object.assign(datos, {
        imagen: estado.datos_modificarProductoBasico.imagen,
      });
    }
    // hacemos la consulta
    let productoModificado;
    try {
      await loadingAsync(async () => {
        productoModificado = productoService.modificarProductoBasico(
          productoStore.producto._id,
          datos,
        );
      });
      if (!productoModificado) {
        throw 'No se pudo modificar el producto';
      }
    } catch (e) {
      NotifyError(`Error no tratado, ver consola`);
      console.log(e);
      return;
    }

    NotifySucessCenter('Producto modificado correctamente');
  };

  /**
   ********************* MARCAS *********************
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
        console.log(e);
      }
      return;
    }
    NotifySucessCenter('Marca creado correctamente');
    estado.marcas.push(marcaNueva.value);
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
        productoModificado.value = await productoService.crearProductosMarca(
          productoStore.producto._id,
          datos,
        );
      });
    } catch (e) {
      if (isApiError(e, 'B206')) {
        estado.errorMarca = 'Esta marca ya esta registrada';
      } else {
        NotifyError(`Error no tratado, ver consola`);
      }
      return;
    }
    if (productoModificado) {
      NotifySucessCenter('Marca creado correctamente');
      const nuevaMarca = productoModificado.variedades.pop();
      productoStore.producto.variedades.push(nuevaMarca);
    }
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
    } catch (e) {
      NotifyError(`Error no tratado, ver consola`);
      console.log(e);
      return;
    }
    if (marcaModificada) {
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
      }
      estado.modal.show_modificarProductoMarca = false;
      estado.modal.show_crearProductoMarca = false;
    }
  };

  /**
   ********************* MEDIDAS & EMPAQUES *********************
   */

  const buscarMedidas = async () => {
    const medidas = await productoService.buscarMedidas();
    estado.medidas = medidas;
  };
  const crearMedidaGlobal = async () => {
    const medidaNueva = await productoService.crearMedida({
      nombre: estado.medida.nombre,
    });
    if (medidaNueva) {
      NotifySucessCenter('Medida creado correctamente');
      estado.medidas.push(medidaNueva);
      estado.datos_productoMedida.medida = medidaNueva;
    }
    estado.modal.show_crearMedida = false;
    estado.medida.nombre = '';
  };
  const guardarMedidaBasicaProducto = async () => {
    const medidaModificada = await productoService.guardarMedidaProducto(
      productoStore.producto._id,
      estado.datos_productoMedida.medida._id,
    );
    // console.log(medidaModificada);
    if (medidaModificada) {
      NotifySucess('Medida guardada correctamente');
    }
    estado.showTableEmpaque = true;
  };
  const limpiarProductoEmpaque = () => {
    estado.datos_productoMedida.marca = { _id: '', nombre: '' };
    estado.datos_productoMedida.empaque = {
      nombre: '',
      abreviacion: '',
      cantidad: 0,
      _id: '',
    };
    // estado.dataEmpaque = { nombre: '', abreviacion: '', cantidad: 0 };
  };
  const crearProductoEmpaque = async () => {
    const productoModificado =
      await productoService.agregarProductosMedidaEmpaque(
        productoStore.producto._id,
        {
          marca: estado.datos_productoMedida.marca._id,
          nombre: estado.datos_productoMedida.empaque.nombre,
          abreviacion: estado.datos_productoMedida.empaque.abreviacion,
          cantidad: estado.datos_productoMedida.empaque.cantidad,
        },
      );
    if (productoModificado) {
      NotifySucessCenter('Medida&Empaque creado correctamente');

      const nuevaMedida = productoModificado.empaques.pop();
      productoStore.producto.empaques.push(nuevaMedida);
    }
    estado.modal.show_crearProductoEmpaque = false;
    limpiarProductoEmpaque();
  };

  const modificarProductoEmpaque = async () => {
    const productoEmpaque = await productoService.modificarEmpaqueProducto(
      productoStore.producto._id,
      estado.datos_productoMedida.empaque._id,
      {
        marca: estado.datos_productoMedida.marca._id,
        cantidad: estado.datos_productoMedida.empaque.cantidad,
        nombre: estado.datos_productoMedida.empaque.nombre,
        abreviacion: estado.datos_productoMedida.empaque.abreviacion,
      },
    );
    if (productoEmpaque) {
      NotifySucessCenter('Marca modificado correctamente');
      // encontrar index de la variedad modificada
      const index = productoStore.producto.empaques.findIndex(
        (e: any) => e._id === estado.datos_productoMedida.empaque._id,
      );
      if (index !== -1) {
        // encontrar objeto variedad modificada
        const empaqueModificada = productoEmpaque.empaques.find(
          (v: any) => v._id === estado.datos_productoMedida.empaque._id,
        );
        // Si se encontró la variedad modificada, actualiza la variedad en el array con la variedad modificada
        if (empaqueModificada) {
          productoStore.producto.empaques[index] = empaqueModificada;
        }
      }
      estado.modal.show_crearProductoEmpaque = false;
      estado.modal.show_modificarProductoEmpaque = false;
    }
  };
  const modalModificarProductoEmpaque = (empaque: any) => {
    estado.modal.show_modificarProductoEmpaque = true;
    estado.modal.show_crearProductoEmpaque = true;

    estado.datos_productoMedida.marca = empaque.marca;
    estado.datos_productoMedida.cantidad = empaque.cantidad;
    estado.datos_productoMedida.empaque = {
      _id: empaque._id,
      nombre: empaque.nombre,
      abreviacion: empaque.abreviacion,
      cantidad: empaque.cantidad,
    };
  };

  const crearEmpaqueGlobal = async () => {
    const medidaConEmpaqueNuevo = await productoService.agregarEmpaqueMedida(
      estado.datos_productoMedida.medida._id,
      estado.empaque,
    );

    if (medidaConEmpaqueNuevo) {
      NotifySucessCenter('Empaque creado correctamente');
      const nuevoEmpaque = medidaConEmpaqueNuevo.tipoEmpaques.pop();
      estado.datos_productoMedida.empaque = nuevoEmpaque;
      delete nuevoEmpaque._id;
      estado.datos_productoMedida.medida.tipoEmpaques.push(nuevoEmpaque);
    }

    estado.empaque = { nombre: '', abreviacion: '', cantidad: 0 };
    estado.modal.show_crearEmpaque = false;
  };

  /**
   ********************* PROVEEDORES *********************
   */

  const buscarProveedores = async () => {
    const proveedores = await productoService.buscarEntidadesProveedor();
    estado.proveedores = proveedores;
  };
  // BUSCAR PROVEEDORES DE PRODUCTO BUG - falta filtrar
  const buscarProveedoresProducto = async () => {
    const proveedorProducto = await productoService.buscarProveedoresProducto(
      productoStore.producto._id,
    );
    const resultado = proveedorProducto.reduce((acc: any, proveedor: any) => {
      const serviciosFiltrados = proveedor.servicios.filter(
        (servicio: any) => servicio.producto._id === productoStore.producto._id,
      );
      if (serviciosFiltrados.length > 0) {
        acc.push({
          ...proveedor,
          servicios: serviciosFiltrados,
        });
      }
      return acc;
    }, []);
    estado.proveedoresProducto = resultado;
  };
  const limpiarProductoProveedor = () => {
    estado.datos_productoProveedor.marca = { _id: '', nombre: '' };
    estado.datos_productoProveedor.proveedor = { _id: '', nombre: '' };
    estado.datos_productoProveedor.identificativo = '';
    estado.datos_productoProveedor.precioConFactura = 0;
    estado.datos_productoProveedor.precioSinFactura = 0;
    estado.datos_productoProveedor.precios = [];
  };
  const crearProductoProveedor = async () => {
    const nuevoProveedor = await productoService.agregarProveedorProducto(
      estado.datos_productoProveedor.proveedor._id,
      {
        marca: estado.datos_productoProveedor.marca._id,
        producto: productoStore.producto._id,
        identificativo: estado.datos_productoProveedor.identificativo,
        precioConFactura: estado.datos_productoProveedor.precioConFactura,
        precioSinFactura: estado.datos_productoProveedor.precioSinFactura, //@ts-expect-error
        preciosPorMayor: estado.datos_productoProveedor.precios,
      },
    );
    nuevoProveedor.servicios = [nuevoProveedor.servicios.pop()];
    if (nuevoProveedor) {
      NotifySucessCenter('Proveedor creado correctamente');
      console.log(nuevoProveedor);
      estado.proveedoresProducto.push(nuevoProveedor);
    }
    estado.modal.show_crearProductoProveedor = false;
    // limpiarProductoProveedor();
  };
  const modalModificarProductoProveedor = (fila: any) => {
    estado.modal.show_modificarProductoProveedor = true;
    estado.modal.show_crearProductoProveedor = true;
    estado.datos_productoProveedor.proveedor = {
      _id: fila._id,
      nombre: fila.nombre,
    };
    estado.datos_productoProveedor.marca = fila.servicios?.[0]?.marca;
    estado.datos_productoProveedor.identificativo =
      fila.servicios?.[0]?.identificativo;
    estado.datos_productoProveedor.precioSinFactura =
      fila.servicios?.[0]?.precioSinFactura;
    estado.datos_productoProveedor.precioConFactura =
      fila.servicios?.[0]?.precioConFactura;
    estado.datos_productoProveedor.servicioID = fila.servicios?.[0]?._id;
    estado.datos_productoProveedor.precios =
      fila.servicios?.[0]?.preciosPorMayor;
  };
  const modificarProveedorProducto = async () => {
    const servicioProveedor = await productoService.modificarProveedorProducto(
      estado.datos_productoProveedor.proveedor._id,
      estado.datos_productoProveedor.servicioID,
      {
        marca: estado.datos_productoProveedor.marca._id,
        identificativo: estado.datos_productoProveedor.identificativo,
        precioConFactura: estado.datos_productoProveedor.precioConFactura,
        precioSinFactura: estado.datos_productoProveedor.precioSinFactura,
      },
    );
    if (servicioProveedor) {
      NotifySucessCenter('Proveedor modificado correctamente');
      buscarProveedoresProducto();
    }
    estado.modal.show_modificarProductoProveedor = false;
    estado.modal.show_crearProductoProveedor = false;
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
    estado.datos_productoProveedor.proveedor = proveedorCreado;
    estado.modal.show_crearProveedor = false;
  };

  /**
   * PRODUCTO BORRAR
   */
  const borrarProducto = () => {
    $q.dialog({
      title: `Eliminar ${productoStore.producto.nombre}`,
      message: 'No se puede deshacer.',
      cancel: true,
      persistent: true,
    }).onOk(async () => {
      productoService
        .borrarProducto(
          productoStore.producto._id,
          estado.motivoEliminacion,
          useGqlToken(authStore.token),
        )
        .then(() => {
          estado.motivoEliminacion = '';
          NotifySucess('Producto eliminado correctamente');
        });
      // getAllProductos();
      router.push('/cathering/productos');
    });
  };

  return {
    estado,
    modificarProductoBasico,
    productoStore,
    buscarMarcas,
    crearMarcaGlobal,
    crearProductoMarca,
    modificarProductoMarca,
    modalModificarProductoMarca,
    buscarMedidas,
    crearMedidaGlobal,
    guardarMedidaBasicaProducto,
    limpiarProductoEmpaque,
    crearProductoEmpaque,
    modificarProductoEmpaque,
    modalModificarProductoEmpaque,
    crearEmpaqueGlobal,
    buscarProveedores,
    limpiarProductoProveedor,
    crearProductoProveedor,
    buscarProveedoresProducto,
    modalModificarProductoProveedor,
    modificarProveedorProducto,
    crearProveedorGlobal,
    borrarProducto,
  };
};
