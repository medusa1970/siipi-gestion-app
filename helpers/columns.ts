export const columnsEmpleados = [
  {
    name: 'foto',
    label: 'Imagen',
    align: 'left',
    field: (row: any) => row.foto
  },
  {
    name: 'nombre',
    required: true,
    label: 'Nombre(s)',
    align: 'left',
    field: (row: any) => row.nombre,
    sortable: true
  },
  {
    name: 'correo',
    required: true,
    label: 'Correo',
    align: 'left',
    field: (row: any) => row.correo,
    sortable: true
  },
  {
    name: 'telefono',
    required: true,
    label: 'Telefono',
    align: 'left',
    field: (row: any) => row.telefono,
    sortable: true
  },
  {
    name: 'rol',
    required: true,
    label: 'Rol',
    align: 'left',
    field: (row: any) => row.cargo,
    sortable: true
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right'
  }
];

export const columnsOfertas = [
  {
    name: 'nombre',
    label: 'Nombre',
    align: 'left',
    field: (row: any) => row.nombre
  },
  {
    name: 'descripcion',
    required: true,
    label: 'descripcion',
    align: 'left',
    field: (row: any) => row.descripcion,
    sortable: true
  },
  {
    name: 'productos',
    required: true,
    label: 'producto',
    align: 'left',
    field: (row: any) => row.productos.map((p: any) => p.p),
    sortable: true
  },
  {
    name: 'grupos',
    required: true,
    label: 'grupos',
    align: 'left',
    field: (row: any) => row.grupos,
    sortable: true
  },
  {
    name: 'precio',
    required: true,
    label: 'precio',
    align: 'left',
    field: (row: any) => row.precio,
    sortable: true
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right'
  }
];

export const columnsProductos = [
  {
    name: 'nombre',
    label: 'Nombre',
    align: 'left',
    field: (row: any) => row.nombre
  },
  {
    name: 'descripcion',
    required: true,
    label: 'descripcion',
    align: 'left',
    field: (row: any) => row.descripcion,
    sortable: true
  },
  {
    name: 'presentacionBasica',
    required: true,
    label: 'U.M',
    align: 'left',
    field: (row: any) => row.presentacionBasica,
    sortable: true
  },
  {
    name: 'presentaciones',
    required: true,
    label: 'presentaciones',
    align: 'left',
    field: (row: any) => row.presentaciones.map((p: any) => p.nombre),
    sortable: true
  },
  {
    name: 'categoria',
    required: true,
    label: 'categoria',
    align: 'left',
    field: (row: any) => row.categoria.nombre,
    sortable: true
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right'
  }
];

export const stockProducts = [
  {
    name: 'foto',
    label: 'Imagen',
    align: 'left',
    field: (row: any) => row.foto
  },
  {
    name: 'producto',
    required: true,
    label: 'Producto',
    align: 'left',
    field: (row: any) => row.producto.nombre,
    sortable: true
  },
  {
    name: 'presentaciones',
    required: true,
    label: 'Presentaciones',
    align: 'left',
    field: (row: any) => row.presentaciones.map((p: any) => p.nombre),
    sortable: true
  },
  {
    name: 'lotes',
    required: true,
    label: 'Lotes',
    align: 'left',
    field: (row: any) => row.lote.nro,
    sortable: true
  },
  {
    name: 'cantidad',
    required: true,
    label: 'Cantidad Total',
    align: 'left',
    field: (row: any) => row.cantidad,
    sortable: true
  },
  {
    name: 'cantidadMinima',
    required: true,
    label: 'Cantidad Minima',
    align: 'left',
    field: (row: any) => row.cantidadMinima,
    sortable: true
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right'
  }
];
