import type {
  BuscarProductoDto,
  Categoria,
  CrearEmpaqueDto,
  CrearMedidaDto,
  CrearTipoEmpaqueDto,
  CrearVariedadDto,
  Entidad,
  Marca,
  Medida,
  ModificarProductoDto,
  ModificarServicioDto,
  Producto,
  CrearCategoriaDto,
  CrearProductoDto,
  ModificarVariedadDto,
} from '#gql';
import { extraerUno } from '~/utils/objeto';

export const productoService = {
  /**
   * Buscar un producto
   */
  buscarProducto: async (productoId: string): Promise<Producto> => {
    try {
      return extraerUno(
        await GqlProductosBuscar({ busqueda: { _id: [productoId] } }),
      );
    } catch (err) {
      throw formatApiError(err);
    }
  },

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
    } catch (err) {
      throw formatApiError(err);
    }
  },

  /**
   * Crear una producto con datos basicos
   */
  crearProductoBasico: async (
    datos: CrearProductoDto,
  ): Promise<Producto | null> => {
    try {
      return extraerUno(
        await GqlProductosCrearBasico({
          datos: [datos],
          opciones: { populate: true },
        }),
      );
    } catch (err) {
      throw formatApiError(err);
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
    } catch (err) {
      throw formatApiError(err);
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
    } catch (err) {
      throw formatApiError(err);
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
    } catch (err) {
      throw formatApiError(err);
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
    } catch (err) {
      throw formatApiError(err);
    }
  },

  /**
   * Crear una marca global
   */
  crearMarca: async (datos: { nombre: string }): Promise<Marca | null> => {
    try {
      return extraerUno(await GqlCrearMarcas({ datos }));
    } catch (err) {
      throw formatApiError(err);
    }
  },

  /**
   * Modificar un producto : agregar una marca
   */
  crearProductosMarca: async (
    productoID: string,
    datos: CrearVariedadDto,
  ): Promise<Producto | null> => {
    try {
      return extraerUno(
        await GqlModificarProductosMarca({
          busqueda: { _id: [productoID] },
          datos: {
            variedades: {
              agregar: [datos],
            },
          },
          opciones: { populate: true },
        }),
      );
    } catch (err) {
      throw formatApiError(err);
    }
  },

  /**
   * Modificar un producto : agregar una marca
   */
  modificarProductosMarca: async (
    productoID: string,
    variedadID: string,
    datos: ModificarVariedadDto,
  ): Promise<Producto | null> => {
    //@ts-expect-error estamos cambiando el tipo a proposito
    datos.cantidadLimite = { reemplazar: datos.cantidadLimite };
    //@ts-expect-error estamos cambiando el tipo a proposito
    datos.inventarioLimite = { reemplazar: datos.inventarioLimite };
    try {
      return extraerUno(
        await GqlModificarProductosMarca({
          busqueda: { _id: [productoID] },
          datos: {
            variedades: {
              buscar: { _id: [variedadID] },
              modificar: datos,
            },
          },
          opciones: { populate: true },
        }),
      );
    } catch (err) {
      throw formatApiError(err);
    }
  },

  /**
   * Modificar un producto : agregar una marca
   */
  modificarProductoVencimiento: async (
    productoID: string,
    vencimientoLimite: [number, number],
  ): Promise<Producto | null> => {
    try {
      return extraerUno(
        await GqlModificarProductosBasicos({
          busqueda: { _id: [productoID] },
          datos: {
            vencimientoLimite: {
              reemplazar: vencimientoLimite,
            },
          },
        }),
      );
    } catch (err) {
      throw formatApiError(err);
    }
  },

  /**
   * Crear una medida global
   */
  crearMedida: async (datos: CrearMedidaDto): Promise<Medida | null> => {
    try {
      return extraerUno(await GqlCrearMedidas({ datos }));
    } catch (err) {
      throw formatApiError(err);
    }
  },

  /**
   * Buscar todas las medidas globales
   */
  buscarMedidas: async (): Promise<Medida[]> => {
    try {
      return extraer(await GqlBuscarMedidas());
    } catch (err) {
      throw formatApiError(err);
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
    } catch (err) {
      throw formatApiError(err);
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
    } catch (err) {
      throw formatApiError(err);
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
    } catch (err) {
      throw formatApiError(err);
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
    } catch (err) {
      throw formatApiError(err);
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
    } catch (err) {
      throw formatApiError(err);
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
    } catch (err) {
      throw formatApiError(err);
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
    } catch (err) {
      throw formatApiError(err);
    }
  },

  modificarServicioProducto: async (
    proveedorId: string,
    servicioId: string,
    servicio: ModificarServicioDto,
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
    } catch (err) {
      throw formatApiError(err);
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
    } catch (err) {
      throw formatApiError(err);
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
    } catch (err) {
      throw formatApiError(err);
    }
  },

  /**
   * Borra un empaque de un prodcuto
   */
  borrarEmpaqueProducto: async (
    busqueda: BuscarProductoDto,
    datos: ModificarProductoDto,
  ) => {
    try {
      const empaqueBorrado = extraerUno(
        await GqlBorrarEmpaqueProducto({ busqueda, datos }),
      );
      return empaqueBorrado;
    } catch (error) {
      console.log(error);
    }
  },
  /**
   * Borra una variedad de un prodcuto
   */
  borrarVariedadProducto: async (
    busqueda: BuscarProductoDto,
    datos: ModificarProductoDto,
  ) => {
    try {
      const variedadBorrado = extraerUno(
        await GqlBorrarVariedadProducto({
          busqueda,
          datos,
          opciones: { populate: true },
        }),
      );
      return variedadBorrado;
    } catch (error) {
      console.log(error);
    }
  },
};
