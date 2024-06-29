import type { Categoria, Entidad, Marca, Medida, Producto } from '#gql';
import type { CrearCategoriaDto } from '#gql';
import { extraerUno } from '~/utils/objeto';
import type { CrearProductoBasico } from '../negocio/producto.interface';

export const productoService = {
  /**
   * Buscar todos los productos
   */
  buscarProductos: async (): Promise<Producto[]> =>
    extraer(
      await GqlProductosBuscar({
        opciones: {
          populate: true,
          sort: '-_modificado -_creado',
        },
      }),
    ),

  /**
   * Crear una producto con datos basicos
   */
  crearProductoBasico: async (
    datos: CrearProductoBasico,
  ): Promise<Producto | null> =>
    extraerUno(
      await GqlProductosCrearBasico({
        datos: [datos],
        opciones: { populate: true, aceptarInexistentes: true },
      }),
    ),

  /**
   * Busca todas las categorias en forma de arbol
   * Retorna una categoria con sus hijas populadas
   */
  obtenerTodasCategorias: async (): Promise<Categoria | null> =>
    extraer(
      await GqlProductosCategoriaArbol({
        busqueda: { nombre: ['CATEGORIA RAIZ'] },
      }),
    ),

  /**
   * Crea una categoria
   */
  crearCategoria: async (
    categoria: CrearCategoriaDto,
  ): Promise<Categoria | null> =>
    extraerUno(await GqlProductosCrearCategoria({ categoria })),

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
  ): Promise<Producto | null> =>
    extraerUno(
      await GqlModificarProductosBasicos({
        busqueda: { _id: [productoID] },
        datos,
        opciones: { populate: true, aceptarInexistentes: true },
      }),
    ),

  /**
   * Buscar todas las marcas globales
   */
  buscarMarcas: async (): Promise<Marca[]> =>
    extraer(
      await GqlBuscarMarcas({
        opciones: { sort: 'nombre' },
      }),
    ),

  /**
   * Crear una marca global
   */
  crearMarca: async (datos: { nombre: string }): Promise<Marca | null> =>
    extraerUno(await GqlCrearMarcas({ datos })),

  /**
   * Modificar un producto : agregar una marca
   */
  crearProductosMarca: async (
    productoID: string,
    productoMarca: {
      imagen: { data: any; mimetype: string };
      marca: string;
      cantidadMax: number;
      cantidadMin: number;
    },
  ): Promise<Producto | null> =>
    extraerUno(
      await GqlModificarProductosMarca({
        busqueda: { _id: [productoID] },
        datos: {
          variedades: {
            agregar: [productoMarca],
          },
        },
        opciones: { populate: true },
      }),
    ),

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
  ): Promise<Producto | null> =>
    extraerUno(
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
    ),

  /**
   * Crear una medida global
   */
  crearMedida: async (datos: { nombre: string }): Promise<Medida | null> =>
    extraerUno(await GqlCrearMedidas({ datos })),

  /**
   * Buscar todas las medidas globales
   */
  buscarMedidas: async (): Promise<Medida[]> =>
    extraer(await GqlBuscarMedidas()),

  /**
   * Agregar un tipo de empaque a una medida global
   */
  agregarEmpaqueMedida: async (
    medidaID: string,
    empaque: { nombre: string; abreviacion: string; cantidad: number },
  ): Promise<Medida | null> =>
    extraerUno(
      await GqlModificarMedidas({
        busqueda: { _id: [medidaID] },
        datos: {
          tipoEmpaques: {
            agregar: [empaque],
          },
        },
      }),
    ),

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
  ): Promise<Producto | null> =>
    extraerUno(
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
    ),

  /**
   * Guarda la medida basica del producto
   */
  guardarMedidaProducto: async (
    productoID: string,
    medidaID: string,
  ): Promise<Producto | null> =>
    extraerUno(
      await GqlModificarProductoMedida({
        busqueda: { _id: [productoID] },
        datos: {
          medida: medidaID,
        },
        opciones: { populate: true },
      }),
    ),

  /**
   * Modificar un producto : agregar empaque
   */
  agregarProductosMedidaEmpaque: async (
    productoID: string,
    empaque: {
      marca: string;
      nombre: string;
      abreviacion: string;
      cantidad: number;
    },
  ): Promise<Producto | null> =>
    extraerUno(
      await GqlModificarProductosMedidaEmpaque({
        busqueda: { _id: [productoID] },
        datos: {
          empaques: {
            agregar: [empaque],
          },
        },
        opciones: { populate: true },
      }),
    ),

  /**
   * PROVEEDORES PRODUCTO
   */
  buscarEntidadesProveedor: async (): Promise<Entidad[]> =>
    extraer(
      await GqlBuscarEntidadesProveedor({
        busqueda: {
          tipo: ['PROVEEDOR'],
        },
      }),
    ),

  crearEntidadProveedor: async (datos: {
    nombre: string;
    tipo?: string;
    descripcion: string;
  }): Promise<Entidad | null> => {
    const datosDefecto = { ...datos, tipo: 'PROVEEDOR' };
    return extraerUno(await GqlCrearEntidadProveedor({ datos: datosDefecto }));
  },

  agregarProveedorProducto: async (
    proveedorId: string,
    servicio: {
      marca: string;
      producto: string;
      identificativo: string;
      precioConFactura: number;
      precioSinFactura: number;
      preciosPorMayor: [
        {
          cantidadMin: number;
          precioConFactura: number;
          precioSinFactura: number;
        },
      ];
    },
  ): Promise<Entidad | null> =>
    extraerUno(
      await GqlModificarProveedorServicio({
        busqueda: { _id: [proveedorId] },
        datos: {
          servicios: {
            agregar: [servicio],
          },
        },
        opciones: { populate: true },
      }),
    ),

  modificarProveedorProducto: async (
    proveedorId: string,
    servicioId: string,
    servicio: {
      marca: string;
      identificativo: string;
      precioConFactura: number;
      precioSinFactura: number;
    },
  ): Promise<Entidad | null> =>
    extraerUno(
      await GqlModificarProveedorServicio({
        busqueda: { _id: [proveedorId] },
        datos: {
          servicios: {
            buscar: { _id: [servicioId] },
            modificar: servicio,
          },
        },
        opciones: { populate: true },
      }),
    ),

  buscarProveedoresProducto: async (productoID: string): Promise<Entidad[]> =>
    extraer(
      await GqlBuscarEntidadProveedoresProducto({
        busqueda: {
          servicios: {
            producto: productoID,
          },
        },
      }),
    ),

  /**
   * Borrar un producto
   */
  borrarProducto: async (
    productoID: string,
    comentario: string = 'test comentario borrar',
    token: any,
  ): Promise<Producto | null> => {
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
  },
};
