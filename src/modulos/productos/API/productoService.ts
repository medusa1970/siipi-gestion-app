import type {
  Categoria,
  CrearEmpaqueDto,
  CrearMedidaDto,
  CrearTipoEmpaqueDto,
  CrearVariedadDto,
  Entidad,
  Marca,
  Medida,
  Producto,
} from '#gql';
import type { CrearCategoriaDto } from '#gql';
import { extraerUno } from '~/utils/objeto';
import type { CrearProductoBasico } from '../negocio/producto.interface';

export const productoService = {
  /**
   * Buscar todos los productos
   */
  buscarProductos: async (): Promise<Producto[]> => {
    try {
      return extraer(
        await GqlProductosBuscar({
          opciones: {
            populate: true,
            sort: '-_modificado -_creado',
          },
        }),
      );
    } catch (e) {
      throw {
        tipo: 'API',
        error: getApiErrorCode(e),
      };
    }
  },

  /**
   * Crear una producto con datos basicos
   */
  crearProductoBasico: async (
    datos: CrearProductoBasico,
  ): Promise<Producto | null> => {
    try {
      return extraerUno(
        await GqlProductosCrearBasico({
          datos: [datos],
          opciones: { populate: true, aceptarInexistentes: true },
        }),
      );
    } catch (e) {
      throw {
        tipo: 'API',
        code: getApiErrorCode(e),
        detalle: e,
      };
    }
  },

  /**
   * Busca todas las categorias en forma de arbol
   * Retorna una categoria con sus hijas populadas
   */
  obtenerTodasCategorias: async (): Promise<Categoria | null> => {
    try {
      return extraer(
        await GqlProductosCategoriaArbol({
          busqueda: { nombre: ['CATEGORIA RAIZ'] },
        }),
      );
    } catch (e) {
      throw {
        tipo: 'API',
        error: getApiErrorCode(e),
      };
    }
  },

  /**
   * Crea una categoria
   */
  crearCategoria: async (
    categoria: CrearCategoriaDto,
  ): Promise<Categoria | null> => {
    try {
      return extraerUno(await GqlProductosCrearCategoria({ categoria }));
    } catch (e) {
      throw {
        tipo: 'API',
        error: getApiErrorCode(e),
      };
    }
  },

  /**
   * Modifica un producto con datos basicos
   */
  modificarProductoBasico: async (
    productoID: string,
    datos: {
      nombre: string;
      categoria: string;
      comentario: string;
      imagen?: { data: any; mimetype: string };
    },
  ): Promise<Producto | null> => {
    try {
      return extraerUno(
        await GqlModificarProductosBasicos({
          busqueda: { _id: [productoID] },
          datos,
          opciones: { populate: true, aceptarInexistentes: true },
        }),
      );
    } catch (e) {
      throw {
        tipo: 'API',
        error: getApiErrorCode(e),
      };
    }
  },

  /**
   * Buscar todas las marcas globales
   */
  buscarMarcas: async (): Promise<Marca[]> => {
    try {
      return extraer(
        await GqlBuscarMarcas({
          opciones: { sort: 'nombre' },
        }),
      );
    } catch (e) {
      throw {
        tipo: 'API',
        error: getApiErrorCode(e),
      };
    }
  },

  /**
   * Crear una marca global
   */
  crearMarca: async (datos: { nombre: string }): Promise<Marca | null> => {
    try {
      return extraerUno(await GqlCrearMarcas({ datos }));
    } catch (e) {
      throw {
        tipo: 'API',
        error: getApiErrorCode(e),
      };
    }
  },

  /**
   * Modificar un producto : agregar una marca
   */
  crearProductosMarca: async (
    productoID: string,
    productoMarca: CrearVariedadDto,
  ): Promise<Producto | null> => {
    try {
      return extraerUno(
        await GqlModificarProductosMarca({
          busqueda: { _id: [productoID] },
          datos: {
            variedades: {
              agregar: [productoMarca],
            },
          },
          opciones: { populate: true },
        }),
      );
    } catch (e) {
      throw {
        tipo: 'API',
        error: getApiErrorCode(e),
      };
    }
  },

  /**
   * Modificar un producto : agregar una marca
   */
  modificarProductosMarca: async (
    productoID: string,
    variedadID: string,
    productoMarca: {
      cantidadMax: number;
      cantidadMin: number;
    },
  ): Promise<Producto | null> => {
    try {
      return extraerUno(
        await GqlModificarProductosMarca({
          busqueda: { _id: [productoID] },
          datos: {
            variedades: {
              buscar: { _id: [variedadID] },
              modificar: productoMarca,
            },
          },
          opciones: { populate: true },
        }),
      );
    } catch (e) {
      throw {
        tipo: 'API',
        error: getApiErrorCode(e),
      };
    }
  },

  /**
   * Crear una medida global
   */
  crearMedida: async (datos: CrearMedidaDto): Promise<Medida | null> => {
    try {
      return extraerUno(await GqlCrearMedidas({ datos }));
    } catch (e) {
      throw {
        tipo: 'API',
        error: getApiErrorCode(e),
      };
    }
  },

  /**
   * Buscar todas las medidas globales
   */
  buscarMedidas: async (): Promise<Medida[]> => {
    try {
      return extraer(await GqlBuscarMedidas());
    } catch (e) {
      throw {
        tipo: 'API',
        error: getApiErrorCode(e),
      };
    }
  },

  /**
   * Agregar un tipo de empaque a una medida global
   */
  agregarEmpaqueMedida: async (
    medidaID: string,
    tipoEmpaque: CrearTipoEmpaqueDto,
  ): Promise<Medida | null> => {
    try {
      return extraerUno(
        await GqlModificarMedidas({
          busqueda: { _id: [medidaID] },
          datos: {
            tipoEmpaques: {
              agregar: [tipoEmpaque],
            },
          },
        }),
      );
    } catch (e) {
      throw {
        tipo: 'API',
        error: getApiErrorCode(e),
      };
    }
  },

  /**
   * Modifica un empaque del producto
   */
  modificarEmpaqueProducto: async (
    productoID: string,
    empaqueID: string,
    productoEmpaque: {
      marca: string;
      nombre: string;
      abreviacion: string;
      cantidad: number;
    },
  ): Promise<Producto | null> => {
    try {
      return extraerUno(
        await GqlModificarProductosMedidaEmpaque({
          busqueda: { _id: [productoID] },
          datos: {
            empaques: {
              buscar: { _id: [empaqueID] },
              modificar: productoEmpaque,
            },
          },
          opciones: { populate: true },
        }),
      );
    } catch (e) {
      throw {
        tipo: 'API',
        error: getApiErrorCode(e),
      };
    }
  },

  /**
   * Guarda la medida basica del producto
   */
  guardarMedidaProducto: async (
    productoID: string,
    medidaID: string,
  ): Promise<Producto | null> => {
    try {
      return extraerUno(
        await GqlModificarProductosMedidaEmpaque({
          busqueda: { _id: [productoID] },
          datos: {
            medida: medidaID,
          },
          opciones: { populate: true },
        }),
      );
    } catch (e) {
      throw {
        tipo: 'API',
        error: getApiErrorCode(e),
      };
    }
  },

  /**
   * Modificar un producto : agregar empaque
   */
  agregarProductosMedidaEmpaque: async (
    productoID: string,
    empaque: CrearEmpaqueDto,
  ): Promise<Producto | null> => {
    try {
      return extraerUno(
        await GqlModificarProductosMedidaEmpaque({
          busqueda: { _id: [productoID] },
          datos: {
            empaques: {
              agregar: [empaque],
            },
          },
          opciones: { populate: true },
        }),
      );
    } catch (e) {
      throw {
        tipo: 'API',
        error: getApiErrorCode(e),
      };
    }
  },

  /**
   * PROVEEDORES PRODUCTO
   */
  buscarEntidadesProveedor: async (): Promise<Entidad[]> => {
    try {
      return extraer(
        await GqlBuscarEntidadesProveedor({
          busqueda: {
            tipo: ['PROVEEDOR'],
          },
        }),
      );
    } catch (e) {
      throw {
        tipo: 'API',
        error: getApiErrorCode(e),
      };
    }
  },

  crearEntidadProveedor: async (datos: {
    nombre: string;
    tipo?: string;
    descripcion?: string;
  }): Promise<Entidad | null> => {
    const datosDefecto = { ...datos, tipo: 'PROVEEDOR' };
    try {
      return extraerUno(
        await GqlCrearEntidadProveedor({ datos: datosDefecto }),
      );
    } catch (e) {
      throw {
        tipo: 'API',
        error: getApiErrorCode(e),
      };
    }
  },

  agregarServicio: async (
    proveedorId: string,
    servicio: {
      marca: string;
      producto: string;
      identificativo: string;
      precioConFactura: number;
      precioSinFactura: number;
      preciosPorMayor: {
        cantidadMin: number;
        precioConFactura: number;
        precioSinFactura: number;
      }[];
    },
  ): Promise<Entidad | null> => {
    try {
      return extraerUno(
        await GqlModificarEntidadesServicio({
          busqueda: { _id: [proveedorId] },
          datos: {
            servicios: {
              agregar: [servicio],
            },
          },
          opciones: { populate: true },
        }),
      );
    } catch (e) {
      throw {
        tipo: 'API',
        error: getApiErrorCode(e),
      };
    }
  },

  modificarServicioProducto: async (
    proveedorId: string,
    servicioId: string,
    servicio: {
      identificativo: string;
      precioConFactura: number;
      precioSinFactura: number;
    },
  ): Promise<Entidad | null> => {
    try {
      return extraerUno(
        await GqlModificarEntidadesServicio({
          busqueda: { _id: [proveedorId] },
          datos: {
            servicios: {
              buscar: { _id: [servicioId] },
              modificar: servicio,
            },
          },
          opciones: { populate: true },
        }),
      );
    } catch (e) {
      throw {
        tipo: 'API',
        error: getApiErrorCode(e),
      };
    }
  },

  buscarProveedoresProducto: async (productoID: string): Promise<Entidad[]> => {
    try {
      return extraer(
        await GqlBuscarEntidadesServicios({
          busqueda: {
            tipo: ['PROVEEDOR'],
            servicios: {
              producto: productoID,
            },
          },
          filtro: {
            servicios: {
              producto: productoID,
            },
          },
        }),
      );
    } catch (e) {
      throw {
        tipo: 'API',
        error: getApiErrorCode(e),
      };
    }
  },

  /**
   * Borrar un producto
   */
  borrarProducto: async (
    productoID: string,
    comentario: string = 'test comentario borrar',
    token: any,
  ): Promise<Producto | null> => {
    try {
      // borramos el producto
      const producto = extraerUno(
        await GqlBorrarProductos({
          busqueda: { _id: [productoID] },
        }),
      );

      // en caso de que no se borró nada
      if (!producto) {
        console.log('no se elimino el producto', productoID);
        return null;
      }
      // creamos la accion
      const accion = extraerUno(
        await GqlCrearAccion(
          {
            datos: {
              // persona: va con el token
              comentario: comentario,
              producto: producto._id,
              accion: 'borrado',
            },
            opciones: {
              aceptarInexistentes: true,
            },
          },
          token,
        ),
      );
      // retornamos el producto
      return producto;
    } catch (e) {
      throw {
        tipo: 'API',
        error: getApiErrorCode(e),
      };
    }
  },
};
