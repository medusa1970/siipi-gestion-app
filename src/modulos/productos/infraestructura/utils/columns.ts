export const columnaEmpaques = [
  {
    name: 'nombre',
    required: true,
    label: 'Nombre',
    align: 'center',
    field: (row: any) => row.nombre,
    sortable: true,
  },
  {
    name: 'abreviacion',
    required: true,
    label: 'Abreviacion',
    align: 'center',
    field: (row: any) => row.abreviacion,
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
    name: 'marca',
    required: true,
    label: 'Marca',
    align: 'left',
    field: (row: any) => row.marca?.nombre,
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right',
  },
];

export const columnaProveedores = [
  {
    name: 'proveedor',
    required: true,
    label: 'Proveedor',
    align: 'left',
    field: (row: any) => row.nombre,
    sortable: true,
  },
  {
    name: 'marca',
    required: true,
    label: 'Marca',
    align: 'center',
    field: (row: any) => row.servicios[0].marca.nombre,
    sortable: true,
  },
  {
    name: 'identificativo',
    required: true,
    label: 'Identificativo',
    align: 'center',
    field: (row: any) => row.servicios[0].identificativo,
    sortable: true,
  },
  {
    name: 'precioConFactura',
    required: true,
    label: 'Precio C/F',
    align: 'center',
    field: (row: any) => row.servicios[0].precioConFactura + ' Bs',
    sortable: true,
  },
  {
    name: 'precioSinFactura',
    required: true,
    label: 'Precio S/F',
    align: 'center',
    field: (row: any) => row.servicios[0].precioSinFactura + ' Bs',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right',
  },
];

export const columnaMarca = [
  {
    name: 'imagen',
    label: 'Imagen',
    align: 'left',
    field: (row: any) => row.imagen?.cloudinaryUrl,
  },
  {
    name: 'marca',
    required: true,
    label: 'Marca',
    align: 'left',
    field: (row: any) => row.marca?.nombre,
    sortable: true,
  },
  {
    name: 'min',
    required: true,
    label: 'Min',
    align: 'center',
    field: (row: any) => row.cantidadMin,
    sortable: true,
  },
  {
    name: 'max',
    required: true,
    label: 'Max',
    align: 'center',
    field: (row: any) => row.cantidadMax,
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right',
  },
];
