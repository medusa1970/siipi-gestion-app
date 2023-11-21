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
    name: 'marca',
    required: true,
    label: 'marca',
    align: 'left',
    field: (row: any) => row.marca,
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
    name: 'inventario',
    required: true,
    label: 'inventario',
    align: 'left',
    field: (row: any) => row.inventario,
    sortable: true
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right'
  }
];
