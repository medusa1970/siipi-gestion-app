import type { CrearProductoBasico } from './producto.interface';

export const useProductoGql = {
  /**
   * Buscar todos los productos
   * @returns Producto
   */
  buscarProductos: async () => {
    const productos = await postDataGql(
      GqlBuscarProductos({
        opciones: {
          populate: true,
          sort: '-_modificado -_creado',
        },
      }),
    );
    return productos;
  },

  /**
   * Crear una producto con datos basicos
   * @returns Producto
   */
  crearProductoBasico: async (datos: CrearProductoBasico) => {
    // console.log(datos);
    const producto = await postDataGql(
      GqlCrearProductosBasico({
        datos: [datos],
        opciones: { populate: true, aceptarInexistentes: true },
      }),
    );
    return producto[0];
  },

  /**
   * Busca todas las categorias en forma de arbol
   * @returns Categoria (con sus hijas populadas)
   */
  obtenerTodasCategorias: async () => {
    const arbol = await postDataGql(
      GqlCategoriaArbol({
        busqueda: { nombre: ['CATEGORIA RAIZ'] },
      }),
    );
    // console.log('arbol');
    // console.log(arbol);
    return arbol;
  },

  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///
  ///

  /**
   * Borrar un producto
   * @returns Producto
   */
  borrarProducto: async (
    productoID: string,
    comentario: string = 'test comentario borrar',
    token: any,
  ) => {
    // borramos el producto
    const [producto] = await postDataGql(
      GqlBorrarProductos({
        busqueda: { _id: [productoID] },
      }),
    );
    // en caso de que no se borró nada
    if (!producto) {
      console.log('no se elimino el producto', productoID);
      return false;
    }
    // creamos la accion
    const accion = await postDataGql(
      GqlCrearAccion(
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

  /**
   * Modifica un producto
   * @returns Producto
   */
  editarProducto: async (productoID: string, datos: any) => {
    const [producto] = await postDataGql(
      GqlModificarProductos({
        busqueda: { _id: [productoID] },
        datos: datos,
        opciones: { limit: 1, errorSiVacio: true },
      }),
    );
    return producto;
  },

  /**
   * Busca todas las categorias
   * @returns Categoria[]
   */
  // buscarCategorias: async () => {
  //   const categorias = await postDataGql(GqlBuscarCategorias({}));
  //   return categorias;
  // },

  /**
   * Crear una categoria
   * @returns Categoria
   */
  crearCategoria: async (categoriaID: string, nombre: string) => {
    const categoria = await postDataGql(
      GqlCrearCategorias({
        datos: [
          {
            nombre,
            pariente: categoriaID,
          },
        ],
      }),
    );
    return categoria;
  },

  /**
   * Modificar un producto : modificar los datos basicos
   * @returns Producto
   */
  modificarProductoBasico: async (
    productoID: string,
    datos: {
      nombre: string;
      categoria: string;
      comentario: string;
      imagen?: { data: any; mimetype: string };
    },
  ) => {
    const [producto] = await postDataGql(
      GqlModificarProductosBasicos({
        busqueda: { _id: [productoID] },
        datos,
      }),
    );
    return producto;
  },

  /**
   * Modificar un producto : agregar una marca
   * @returns Producto
   */
  agregarProductosMarca: async (
    productoID: string,
    productoMarca: {
      imagen: { data: any; mimetype: string };
      marca: string;
      cantidadMax: number;
      cantidadMin: number;
    },
  ) => {
    const [producto] = await postDataGql(
      GqlModificarProductosMarca({
        busqueda: { _id: [productoID] },
        datos: {
          variedades: {
            agregar: [productoMarca],
          },
        },
        opciones: { populate: true },
      }),
    );
    return producto;
  },

  /**
   * Modificar un producto : agregar una marca
   * @returns Producto
   */
  modificarProductosMarca: async (
    productoID: string,
    variedadID: string,
    productoMarca: {
      cantidadMax: number;
      cantidadMin: number;
    },
  ) => {
    const [producto] = await postDataGql(
      GqlModificarProductosMarca({
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
    return producto;
  },

  /**
   * Modificar un producto : agregar empaque
   * @returns Producto
   */
  agregarProductosMedidaEmpaque: async (
    productoID: string,
    empaque: {
      marca: string;
      nombre: string;
      abreviacion: string;
      cantidad: number;
    },
  ) => {
    console.log(productoID, empaque);
    const [producto] = await postDataGql(
      GqlModificarProductosMedidaEmpaque({
        busqueda: { _id: [productoID] },
        datos: {
          empaques: {
            agregar: [empaque],
          },
        },
        opciones: { populate: true },
      }),
    );
    return producto;
  },

  /**
   * Crear una marca global
   * @returns Marca
   */
  crearMarca: async (datos: { nombre: string }) => {
    const [marca] = await postDataGql(GqlCrearMarcas({ datos }));
    return marca;
  },

  /**
   * Buscar todas las marcas globales
   * @returns Marca
   */
  buscarMarcas: async () => {
    const marcas = postDataGql(
      GqlBuscarMarcas({
        opciones: { sort: 'nombre' },
      }),
    );
    return marcas;
  },

  /**
   * Crear una medida global
   * @returns Medida
   */
  crearMedida: async (datos: { nombre: string }) => {
    const [medida] = await postDataGql(GqlCrearMedidas({ datos }));
    return medida;
  },

  /**
   * Buscar todas las medidas globales
   * @returns Medida
   */
  buscarMedidas: async () => {
    const medidas = await postDataGql(GqlBuscarMedidas());
    return medidas;
  },

  /**
   * Agregar un tipo de empaque a una medida global
   * @returns Medida
   */
  agregarEmpaqueMedida: async (
    medidaID: string,
    empaque: { nombre: string; abreviacion: string; cantidad: number },
  ) => {
    const [medida] = await postDataGql(
      GqlModificarMedidas({
        busqueda: { _id: [medidaID] },
        datos: {
          tipoEmpaques: {
            agregar: [empaque],
          },
        },
      }),
    );
    return medida;
  },
  /**
   * Modifica un empaque del producto
   * @returns PRODUCTO
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
  ) => {
    const [producto] = await postDataGql(
      GqlModificarProductosMedidaEmpaque({
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
    return producto;
  },
  /**
   * PROVEEDORES PRODUCTO
   */
  buscarEntidadesProveedor: async () =>
    postDataGql(
      GqlBuscarEntidadesProveedor({
        busqueda: {
          tipo: ['PROVEEDOR'],
        },
      }),
    ),
  crearEntidadProveedor: async (datos: {
    nombre: string;
    tipo?: string;
    descripcion: string;
  }) => {
    const datosDefecto = { ...datos, tipo: 'PROVEEDOR' };
    return postDataGql(GqlCrearEntidadProveedor({ datos: datosDefecto }));
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
  ) => {
    const proveedor = await postDataGql(
      GqlModificarProveedorServicio({
        busqueda: { _id: [proveedorId] },
        datos: {
          servicios: {
            agregar: [servicio],
          },
        },
        opciones: { populate: true },
      }),
    );
    return proveedor;
  },
  modificarProveedorProducto: async (
    proveedorId: string,
    servicioId: string,
    servicio: {
      marca: string;
      identificativo: string;
      precioConFactura: number;
      precioSinFactura: number;
    },
  ) => {
    const [proveedor] = await postDataGql(
      GqlModificarProveedorServicio({
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
    return proveedor;
  },
  buscarProveedoresProducto: async (productoID: string) => {
    const proveedores = await postDataGql(
      GqlBuscarEntidadProveedoresProducto({
        busqueda: {
          servicios: {
            producto: productoID,
          },
        },
      }),
    );
    return proveedores;
  },
  /**
   * MEDIDA PRODUCTO
   */
  guardarMedidaProducto: async (productoID: string, medidaID: string) => {
    const [producto] = await postDataGql(
      GqlModificarProductoMedida({
        busqueda: { _id: [productoID] },
        datos: {
          medida: medidaID,
        },
        opciones: { populate: true },
      }),
    );
    return producto;
  },
};
