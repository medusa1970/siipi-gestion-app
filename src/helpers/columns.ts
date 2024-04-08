export const columnsEmpleados = [
  {
    name: 'foto',
    label: 'Imagen',
    align: 'left',
    field: (row: any) => row.foto,
  },
  {
    name: 'nombre',
    required: true,
    label: 'Nombre(s)',
    align: 'left',
    field: (row: any) => row.nombre,
    sortable: true,
  },
  {
    name: 'correo',
    required: true,
    label: 'Correo',
    align: 'left',
    field: (row: any) => row.correo,
    sortable: true,
  },
  {
    name: 'telefono',
    required: true,
    label: 'Telefono',
    align: 'left',
    field: (row: any) => row.telefono,
    sortable: true,
  },
  {
    name: 'rol',
    required: true,
    label: 'Rol',
    align: 'left',
    field: (row: any) => row.cargo,
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right',
  },
];

export const columnsOfertas = [
  {
    name: 'creado',
    label: 'Creado',
    align: 'left',
    field: (row: any) => row._creado,
  },
  {
    name: 'nombre',
    label: 'Nombre',
    align: 'left',
    field: (row: any) => row.nombre,
  },
  {
    name: 'ingredientes',
    required: true,
    label: 'Ingredientes',
    align: 'left',
    field: (row: any) => row.ingredientes,
    sortable: true,
  },
  // {
  //   name: 'preparados',
  //   required: true,
  //   label: 'Preparados',
  //   align: 'left',
  //   field: (row: any) => row.preparados.map((p: any) => p),
  //   sortable: true,
  // },
  {
    name: 'catalogo',
    required: true,
    label: 'Catalogo',
    align: 'left',
    field: (row: any) => row.catalogo,
    sortable: true,
  },
  {
    name: 'precio',
    required: true,
    label: 'precio',
    align: 'left',
    field: (row: any) => row.precio,
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right',
  },
];

export const columnsProductos = [
  {
    name: 'creado',
    label: 'Creado',
    align: 'left',
    field: (row: any) => row._creado,
  },
  {
    name: 'nombre',
    required: true,
    label: 'Nombre(s)',
    align: 'left',
    field: (row: any) => row.nombre,
    sortable: true,
  },
  {
    name: 'comentario',
    required: true,
    label: 'Comentario',
    align: 'left',
    field: (row: any) => row.comentario,
    sortable: true,
  },
  {
    name: 'presentacionBasica',
    required: true,
    label: 'U.M',
    align: 'left',
    field: (row: any) => row.presentacionBasica,
    sortable: true,
  },
  {
    name: 'presentaciones',
    required: true,
    label: 'presentaciones',
    align: 'left',
    field: (row: any) => row.presentaciones.map((p: any) => p.nombre),
    sortable: true,
  },
  {
    name: 'categoria',
    required: true,
    label: 'categoria',
    align: 'left',
    field: (row: any) => row.categoria,
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right',
  },
];

export const stockProducts = [
  // {
  //   name: 'foto',
  //   label: 'Imagen',
  //   align: 'left',
  //   field: (row: any) => row.foto,
  // },
  {
    name: 'producto',
    required: true,
    label: 'Producto',
    align: 'left',
    field: (row: any) => row.producto.nombre,
    sortable: true,
  },
  {
    name: 'presentacionBasica',
    required: true,
    label: 'P. basica',
    align: 'left',
    field: (row: any) => row.producto.presentacionBasica,
    sortable: true,
  },
  {
    name: 'presentaciones',
    required: true,
    label: 'Presentaciones',
    align: 'left',
    field: (row: any) => row.presentaciones.map((p: any) => p.nombre),
    sortable: true,
  },
  {
    name: 'lotes',
    required: true,
    label: 'Lotes',
    align: 'left',
    field: (row: any) => row.lotes,
    sortable: true,
  },
  {
    name: 'cantidad',
    required: true,
    label: 'Cantidad Total',
    align: 'left',
    field: (row: any) => row.cantidad,
    sortable: true,
  },
  {
    name: 'cantidadMinima',
    required: true,
    label: 'Cantidad Minima',
    align: 'left',
    field: (row: any) => row.cantidadMinima,
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right',
  },
];

export const detallePedido = [
  {
    name: 'oferta',
    required: true,
    label: 'Oferta',
    align: 'left',
    field: (row: any) => row.oferta.nombre,
    sortable: true,
  },
  {
    name: 'precio',
    required: true,
    label: 'Precio U.',
    align: 'center',
    field: (row: any) => row.oferta.precio,
    sortable: true,
  },
  {
    name: 'cantidad',
    required: true,
    label: 'Cantidad',
    align: 'center',
    field: (row: any) => row.cantidad,
    sortable: true,
  },
  {
    name: 'precioTotal',
    required: true,
    label: 'Precio Total',
    align: 'right',
    field: (row: any) => row.cantidad * row.oferta.precio,
    sortable: true,
  },
];

export const detallePedidoAccion = [
  {
    name: 'oferta',
    required: true,
    label: 'Oferta',
    align: 'left',
    field: (row: any) => row.oferta.nombre,
    sortable: true,
  },
  {
    name: 'precio',
    required: true,
    label: 'Precio U.',
    align: 'center',
    field: (row: any) => row.oferta.precio,
    sortable: true,
  },
  {
    name: 'cantidad',
    required: true,
    label: 'Cantidad',
    align: 'center',
    field: (row: any) => row.cantidad,
    sortable: true,
  },
  {
    name: 'precioTotal',
    required: true,
    label: 'Precio Total',
    align: 'right',
    field: (row: any) => row.cantidad * row.oferta.precio,
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right',
  },
];

export const pedidoGlobal = [
  {
    name: 'nombre',
    required: true,
    label: 'Nombre(s)',
    align: 'left',
    field: (row: any) => row.oferta.nombre,
    sortable: true,
  },
  {
    name: 'cantidadPedido',
    required: true,
    label: 'Cantidad Pedido',
    align: 'center',
    field: (row: any) => row.cantidad,
    sortable: true,
  },
  {
    name: 'cantidadStock',
    required: true,
    label: 'Cantidad Stock',
    align: 'center',
    field: (row: any) => row.stockEntidad,
    sortable: true,
  },
  {
    name: 'diferencia',
    required: true,
    label: 'Diferencia',
    align: 'right',
    field: (row: any) => row.stockEntidad - row.cantidad,
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right',
  },
];

export const tesoreriaCobrar = [
  {
    name: 'entidad',
    required: true,
    label: 'Cliente',
    align: 'left',
    field: (row: any) => row.entidad,
    sortable: true,
  },
  {
    name: 'pedidosAnteriores',
    required: true,
    label: 'Semanas Anteriores',
    align: 'center',
    field: (row: any) => row.pedidosAnteriores,
    sortable: true,
  },
  {
    name: 'pedidosSemanaActual',
    required: true,
    label: 'Ultima Semana',
    align: 'center',
    field: (row: any) => row.pedidosSemanaActual,
    sortable: true,
  },
  {
    name: 'total',
    required: true,
    label: 'Total',
    align: 'right',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right',
  },
];

export const tesoreriaPendiente = [
  {
    name: 'entidad',
    required: true,
    label: 'Cliente',
    align: 'left',
    field: (row: any) => row.entidad,
    sortable: true,
  },
  {
    name: '_creado',
    required: true,
    label: 'Fecha',
    align: 'center',
    field: (row: any) => row._creado,
    sortable: true,
  },
  {
    name: 'monto',
    required: true,
    label: 'Monto',
    align: 'center',
    field: (row: any) => row.monto,
    sortable: true,
  },
  {
    name: 'tipo',
    required: true,
    label: 'Tipo',
    align: 'center',
    field: (row: any) => row.tipo,
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right',
  },
];
