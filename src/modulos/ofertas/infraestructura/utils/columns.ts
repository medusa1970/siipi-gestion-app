export const columnaOfertas = [
  // {
  //   name: 'creado',
  //   label: 'Creado',
  //   align: 'left',
  //   field: (row: any) => row._creado,
  // },
  {
    name: 'imagen',
    label: 'Imagen',
    align: 'left',
    field: (row: any) => row.imagen,
  },
  {
    name: 'modificado',
    label: 'Modificado',
    align: 'left',
    field: (row: any) => row._modificado,
    sortable: true,
  },
  {
    name: 'nombre',
    label: 'Nombre',
    align: 'left',
    field: (row: any) => row.nombre,
    sortable: true,
  },
  {
    name: 'ingredientes',
    required: true,
    label: 'Ingredientes',
    align: 'left',
    field: (row: any) => row.ingredientes,
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
