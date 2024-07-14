import type {
  Accion,
  BorrarOpciones,
  BuscarAccionDto,
  BuscarCatalogoDto,
  BuscarCategoriaDto,
  BuscarEntidadDto,
  BuscarMarcaDto,
  BuscarMedidaDto,
  BuscarOpciones,
  BuscarProductoDto,
  Catalogo,
  Categoria,
  CrearAccionDto,
  CrearCatalogoDto,
  CrearCategoriaDto,
  CrearEntidadDto,
  CrearMarcaDto,
  CrearMedidaDto,
  CrearOpciones,
  CrearProductoDto,
  Entidad,
  Marca,
  Medida,
  ModificarAccionDto,
  ModificarCatalogoDto,
  ModificarCategoriaDto,
  ModificarEntidadDto,
  ModificarMarcaDto,
  ModificarMedidaDto,
  ModificarOpciones,
  ModificarProductoDto,
  Producto,
} from '#gql';

const bu = buscarUno;
const bv = buscarVarios;
const cu = crearUno;
const cv = crearVarios;
const mu = modificarUno;
const mv = modificarVarios;
const du = borrarUno;
const dv = borrarVarios;

export const api = {
  /**
   * Entidades / basico
   */
  buscarEntidad_basico: async (
    b: string | BuscarEntidadDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    f: BuscarEntidadDto = {},
    t: any = null,
  ): Promise<Entidad> =>
    <Entidad>await bu(GqlBuscarEntidades_basico, t, b, o, f, o.loading),
  buscarEntidades_basico: async (
    b: BuscarEntidadDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    f: BuscarEntidadDto = {},
    t: any = null,
  ): Promise<Entidad[]> =>
    <Entidad[]>await bv(GqlBuscarEntidades_basico, t, b, o, f, o.loading),
  crearEntidad_basico: async (
    d: CrearEntidadDto,
    o: CrearOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Entidad> =>
    <Entidad>await cu(GqlCrearEntidades_basico, t, d, o, o.loading),
  crearEntidades_basico: async (
    d: CrearEntidadDto,
    o: CrearOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Entidad[]> =>
    <Entidad[]>await cv(GqlCrearEntidades_basico, t, d, o, o.loading),
  modificarEntidad_basico: async (
    b: string | BuscarEntidadDto,
    d: ModificarEntidadDto,
    o: ModificarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Entidad> =>
    <Entidad>await mu(GqlModificarEntidades_basico, t, b, d, o, o.loading),
  modificarEntidades_basico: async (
    b: BuscarEntidadDto,
    d: ModificarEntidadDto,
    o: ModificarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Entidad[]> =>
    <Entidad[]>await mv(GqlModificarEntidades_basico, t, b, d, o, o.loading),
  borrarEntidad_basico: async (
    b: string | BuscarEntidadDto,
    o: BorrarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Entidad> =>
    <Entidad>await du(GqlBorrarEntidades_basico, t, b, o, o.loading),
  borrarEntidades_basico: async (
    b: BuscarEntidadDto,
    o: BorrarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Entidad[]> =>
    <Entidad[]>await dv(GqlBorrarEntidades_basico, t, b, o, o.loading),

  /**
   * Entidades / servicios
   */
  buscarEntidad_servicios: async (
    b: string | BuscarEntidadDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    f: BuscarEntidadDto = {},
    t: any = null,
  ): Promise<Entidad> =>
    <Entidad>await bu(GqlBuscarEntidades_servicios, t, b, o, f, o.loading),
  buscarEntidades_servicios: async (
    b: BuscarEntidadDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    f: BuscarEntidadDto = {},
    t: any = null,
  ): Promise<Entidad[]> =>
    <Entidad[]>(
      await buscarVarios(GqlBuscarEntidades_servicios, t, b, o, f, o.loading)
    ),
  crearEntidad_servicios: async (
    d: CrearEntidadDto,
    o: CrearOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Entidad> =>
    <Entidad>await cu(GqlCrearEntidades_servicios, t, d, o, o.loading),
  crearEntidades_servicios: async (
    d: CrearEntidadDto,
    o: CrearOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Entidad[]> =>
    <Entidad[]>await cv(GqlCrearEntidades_servicios, t, d, o, o.loading),
  modificarEntidad_servicios: async (
    b: string | BuscarEntidadDto,
    d: ModificarEntidadDto,
    o: ModificarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Entidad> =>
    <Entidad>await mu(GqlModificarEntidades_servicios, t, b, d, o, o.loading),
  modificarEntidades_servicios: async (
    b: BuscarEntidadDto,
    d: ModificarEntidadDto,
    o: ModificarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Entidad[]> =>
    <Entidad[]>await mv(GqlModificarEntidades_servicios, t, b, d, o, o.loading),
  borrarEntidad_servicios: async (
    b: string | BuscarEntidadDto,
    o: BorrarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Entidad> =>
    <Entidad>await du(GqlBorrarEntidades_servicios, t, b, o, o.loading),
  borrarEntidades_servicios: async (
    b: BuscarEntidadDto,
    o: BorrarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Entidad[]> =>
    <Entidad[]>await dv(GqlBorrarEntidades_servicios, t, b, o, o.loading),

  /**
   * Entidades / almacen
   */
  buscarEntidad_almacen: async (
    b: string | BuscarEntidadDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    f: BuscarEntidadDto = {},
    t: any = null,
  ): Promise<Entidad> =>
    <Entidad>await bu(GqlBuscarEntidades_almacen, t, b, o, f, o.loading),
  buscarEntidades_almacen: async (
    b: BuscarEntidadDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    f: BuscarEntidadDto = {},
    t: any = null,
  ): Promise<Entidad[]> =>
    <Entidad[]>(
      await buscarVarios(GqlBuscarEntidades_almacen, t, b, o, f, o.loading)
    ),
  crearEntidad_almacen: async (
    d: CrearEntidadDto,
    o: CrearOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Entidad> =>
    <Entidad>await cu(GqlCrearEntidades_almacen, t, d, o, o.loading),
  crearEntidades_almacen: async (
    d: CrearEntidadDto,
    o: CrearOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Entidad[]> =>
    <Entidad[]>await cv(GqlCrearEntidades_almacen, t, d, o, o.loading),
  modificarEntidad_almacen: async (
    b: string | BuscarEntidadDto,
    d: ModificarEntidadDto,
    o: ModificarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Entidad> =>
    <Entidad>await mu(GqlModificarEntidades_almacen, t, b, d, o, o.loading),
  modificarEntidades_almacen: async (
    b: BuscarEntidadDto,
    d: ModificarEntidadDto,
    o: ModificarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Entidad[]> =>
    <Entidad[]>await mv(GqlModificarEntidades_almacen, t, b, d, o, o.loading),
  borrarEntidad_almacen: async (
    b: string | BuscarEntidadDto,
    o: BorrarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Entidad> =>
    <Entidad>await du(GqlBorrarEntidades_almacen, t, b, o, o.loading),
  borrarEntidades_almacen: async (
    b: BuscarEntidadDto,
    o: BorrarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Entidad[]> =>
    <Entidad[]>await dv(GqlBorrarEntidades_almacen, t, b, o, o.loading),

  /**
   * Marcas
   */
  buscarMarca: async (
    b: string | BuscarMarcaDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    f: BuscarMarcaDto = {},
    t: any = null,
  ): Promise<Marca> => <Marca>await bu(GqlBuscarMarcas, t, b, o, f, o.loading),
  buscarMarcas: async (
    b: BuscarMarcaDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    f: BuscarMarcaDto = {},
    t: any = null,
  ): Promise<Marca[]> =>
    <Marca[]>await buscarVarios(GqlBuscarMarcas, t, b, o, f, o.loading),
  crearMarca: async (
    d: CrearMarcaDto,
    o: CrearOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Marca> => <Marca>await cu(GqlCrearMarcas, t, d, o, o.loading),
  crearMarcas: async (
    d: CrearMarcaDto,
    o: CrearOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Marca[]> => <Marca[]>await cv(GqlCrearMarcas, t, d, o, o.loading),
  modificarMarca: async (
    b: string | BuscarMarcaDto,
    d: ModificarMarcaDto,
    o: ModificarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Marca> =>
    <Marca>await mu(GqlModificarMarcas, t, b, d, o, o.loading),
  modificarMarcas: async (
    b: BuscarMarcaDto,
    d: ModificarMarcaDto,
    o: ModificarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Marca[]> =>
    <Marca[]>await mv(GqlModificarMarcas, t, b, d, o, o.loading),
  borrarMarca: async (
    b: string | BuscarMarcaDto,
    o: BorrarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Marca> => <Marca>await du(GqlBorrarMarcas, t, b, o, o.loading),
  borrarMarcas: async (
    b: BuscarMarcaDto,
    o: BorrarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Marca[]> => <Marca[]>await dv(GqlBorrarMarcas, t, b, o, o.loading),

  /**
   * Productos / basico
   */
  buscarProducto_basico: async (
    b: string | BuscarProductoDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    f: BuscarProductoDto = {},
    t: any = null,
  ): Promise<Producto> =>
    <Producto>await bu(GqlBuscarProductos_basico, t, b, o, f, o.loading),
  buscarProductos_basico: async (
    b: BuscarProductoDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    f: BuscarProductoDto = {},
    t: any = null,
  ): Promise<Producto[]> =>
    <Producto[]>(
      await buscarVarios(GqlBuscarProductos_basico, t, b, o, f, o.loading)
    ),
  crearProducto_basico: async (
    d: CrearProductoDto,
    o: CrearOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Producto> =>
    <Producto>await cu(GqlCrearProductos_basico, t, d, o, o.loading),
  crearProductos_basico: async (
    d: CrearProductoDto,
    o: CrearOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Producto[]> =>
    <Producto[]>await cv(GqlCrearProductos_basico, t, d, o, o.loading),
  modificarProducto_basico: async (
    b: string | BuscarProductoDto,
    d: ModificarProductoDto,
    o: ModificarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Producto> =>
    <Producto>await mu(GqlModificarProductos_basico, t, b, d, o, o.loading),
  modificarProductos_basico: async (
    b: BuscarProductoDto,
    d: ModificarProductoDto,
    o: ModificarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Producto[]> =>
    <Producto[]>await mv(GqlModificarProductos_basico, t, b, d, o, o.loading),
  borrarProducto_basico: async (
    b: string | BuscarProductoDto,
    o: BorrarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Producto> =>
    <Producto>await du(GqlBorrarProductos_basico, t, b, o, o.loading),
  borrarProductos_basico: async (
    b: BuscarProductoDto,
    o: BorrarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Producto[]> =>
    <Producto[]>await dv(GqlBorrarProductos_basico, t, b, o, o.loading),

  /**
   * Categorias
   */
  buscarCategoria: async (
    b: string | BuscarCategoriaDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    f: BuscarCategoriaDto = {},
    t: any = null,
  ): Promise<Categoria> =>
    <Categoria>await bu(GqlBuscarCategorias, t, b, o, f, o.loading),
  buscarCategorias: async (
    b: BuscarCategoriaDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    f: BuscarCategoriaDto = {},
    t: any = null,
  ): Promise<Categoria[]> =>
    <Categoria[]>await buscarVarios(GqlBuscarCategorias, t, b, o, f, o.loading),
  crearCategoria: async (
    d: CrearCategoriaDto,
    o: CrearOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Categoria> =>
    <Categoria>await cu(GqlCrearCategorias, t, d, o, o.loading),
  crearCategorias: async (
    d: CrearCategoriaDto,
    o: CrearOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Categoria[]> =>
    <Categoria[]>await cv(GqlCrearCategorias, t, d, o, o.loading),
  modificarCategoria: async (
    b: string | BuscarCategoriaDto,
    d: ModificarCategoriaDto,
    o: ModificarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Categoria> =>
    <Categoria>await mu(GqlModificarCategorias, t, b, d, o, o.loading),
  modificarCategorias: async (
    b: BuscarCategoriaDto,
    d: ModificarCategoriaDto,
    o: ModificarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Categoria[]> =>
    <Categoria[]>await mv(GqlModificarCategorias, t, b, d, o, o.loading),
  borrarCategoria: async (
    b: string | BuscarCategoriaDto,
    o: BorrarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Categoria> =>
    <Categoria>await du(GqlBorrarCategorias, t, b, o, o.loading),
  borrarCategorias: async (
    b: BuscarCategoriaDto,
    o: BorrarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Categoria[]> =>
    <Categoria[]>await dv(GqlBorrarCategorias, t, b, o, o.loading),
  buscarArbolCategorias: async (
    b: BuscarCategoriaDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Categoria> => {
    o.limit = 0;
    return <Categoria>await bu(GqlCategoriaArbol, t, b, o, null, o.loading);
  },

  /**
   * Catalogos
   */
  buscarCatalogo: async (
    b: string | BuscarCatalogoDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    f: BuscarCatalogoDto = {},
    t: any = null,
  ): Promise<Catalogo> =>
    <Catalogo>await bu(GqlBuscarCatalogos, t, b, o, f, o.loading),
  buscarCatalogos: async (
    b: BuscarCatalogoDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    f: BuscarCatalogoDto = {},
    t: any = null,
  ): Promise<Catalogo[]> =>
    <Catalogo[]>await buscarVarios(GqlBuscarCatalogos, t, b, o, f, o.loading),
  crearCatalogo: async (
    d: CrearCatalogoDto,
    o: CrearOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Catalogo> =>
    <Catalogo>await cu(GqlCrearCatalogos, t, d, o, o.loading),
  crearCatalogos: async (
    d: CrearCatalogoDto,
    o: CrearOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Catalogo[]> =>
    <Catalogo[]>await cv(GqlCrearCatalogos, t, d, o, o.loading),
  modificarCatalogo: async (
    b: string | BuscarCatalogoDto,
    d: ModificarCatalogoDto,
    o: ModificarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Catalogo> =>
    <Catalogo>await mu(GqlModificarCatalogos, t, b, d, o, o.loading),
  modificarCatalogos: async (
    b: BuscarCatalogoDto,
    d: ModificarCatalogoDto,
    o: ModificarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Catalogo[]> =>
    <Catalogo[]>await mv(GqlModificarCatalogos, t, b, d, o, o.loading),
  borrarCatalogo: async (
    b: string | BuscarCatalogoDto,
    o: BorrarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Catalogo> =>
    <Catalogo>await du(GqlBorrarCatalogos, t, b, o, o.loading),
  borrarCatalogos: async (
    b: BuscarCatalogoDto,
    o: BorrarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Catalogo[]> =>
    <Catalogo[]>await dv(GqlBorrarCatalogos, t, b, o, o.loading),
  buscarArbolCatalogos: async (
    b: BuscarCatalogoDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Catalogo> => {
    o.limit = 0;
    return <Catalogo>await bu(GqlCatalogoArbol, t, b, o, null, o.loading);
  },

  /**
   * Acciones
   */
  buscarAccion: async (
    b: string | BuscarAccionDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    f: BuscarAccionDto = {},
    t: any = null,
  ): Promise<Accion> =>
    <Accion>await bu(GqlBuscarAcciones, t, b, o, f, o.loading),
  buscarAcciones: async (
    b: BuscarAccionDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    f: BuscarAccionDto = {},
    t: any = null,
  ): Promise<Accion[]> =>
    <Accion[]>await buscarVarios(GqlBuscarAcciones, t, b, o, f, o.loading),
  crearAccion: async (
    d: CrearAccionDto,
    o: CrearOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Accion> => <Accion>await cu(GqlCrearAcciones, t, d, o, o.loading),
  crearAcciones: async (
    d: CrearAccionDto,
    o: CrearOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Accion[]> =>
    <Accion[]>await cv(GqlCrearAcciones, t, d, o, o.loading),
  modificarAccion: async (
    b: string | BuscarAccionDto,
    d: ModificarAccionDto,
    o: ModificarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Accion> =>
    <Accion>await mu(GqlModificarAcciones, t, b, d, o, o.loading),
  modificarAcciones: async (
    b: BuscarAccionDto,
    d: ModificarAccionDto,
    o: ModificarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Accion[]> =>
    <Accion[]>await mv(GqlModificarAcciones, t, b, d, o, o.loading),
  borrarAccion: async (
    b: string | BuscarAccionDto,
    o: BorrarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Accion> => <Accion>await du(GqlBorrarAcciones, t, b, o, o.loading),
  borrarAcciones: async (
    b: BuscarAccionDto,
    o: BorrarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Accion[]> =>
    <Accion[]>await dv(GqlBorrarAcciones, t, b, o, o.loading),

  /**
   * Medidas
   */
  buscarMedida: async (
    b: string | BuscarMedidaDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    f: BuscarMedidaDto = {},
    t: any = null,
  ): Promise<Medida> =>
    <Medida>await bu(GqlBuscarMedidas, t, b, o, f, o.loading),
  buscarMedidas: async (
    b: BuscarMedidaDto,
    o: BuscarOpciones & { loading?: boolean } = {},
    f: BuscarMedidaDto = {},
    t: any = null,
  ): Promise<Medida[]> =>
    <Medida[]>await buscarVarios(GqlBuscarMedidas, t, b, o, f, o.loading),
  crearMedida: async (
    d: CrearMedidaDto,
    o: CrearOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Medida> => <Medida>await cu(GqlCrearMedidas, t, d, o, o.loading),
  crearMedidas: async (
    d: CrearMedidaDto,
    o: CrearOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Medida[]> =>
    <Medida[]>await cv(GqlCrearMedidas, t, d, o, o.loading),
  modificarMedida: async (
    b: string | BuscarMedidaDto,
    d: ModificarMedidaDto,
    o: ModificarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Medida> =>
    <Medida>await mu(GqlModificarMedidas, t, b, d, o, o.loading),
  modificarMedidas: async (
    b: BuscarMedidaDto,
    d: ModificarMedidaDto,
    o: ModificarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Medida[]> =>
    <Medida[]>await mv(GqlModificarMedidas, t, b, d, o, o.loading),
  borrarMedida: async (
    b: string | BuscarMedidaDto,
    o: BorrarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Medida> => <Medida>await du(GqlBorrarMedidas, t, b, o, o.loading),
  borrarMedidas: async (
    b: BuscarMedidaDto,
    o: BorrarOpciones & { loading?: boolean } = {},
    t: any = null,
  ): Promise<Medida[]> =>
    <Medida[]>await dv(GqlBorrarMedidas, t, b, o, o.loading),
};
