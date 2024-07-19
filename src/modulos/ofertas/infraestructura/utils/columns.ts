export const columnaOfertas = [
  {
    name: 'imagen',
    label: 'Imagen',
    imagen: true,
    align: 'left',
    field: (row: any) => row.imagen?.cloudinaryUrl,
  },
  {
    name: 'modificado',
    label: 'Modificado',
    align: 'left',
    field: (row: any) => row._modificado,
    format: (val, row) => `${fechaMes(row._modificado ?? row._creado)}`,
    sortable: true,
  },
  {
    name: 'nombre',
    label: 'Nombre',
    align: 'left',
    field: (row: any) => row.nombre,
    sortable: true,
    slot: true,
  },
  // {
  //   name: 'ingredientes',
  //   required: true,
  //   label: 'Ingredientes',
  //   align: 'left',
  //   slot: true,
  //   field: (row: any) => row.ingredientes,
  // },
  // {
  //   name: 'preparados',
  //   required: true,
  //   label: 'Preparados',
  //   align: 'left',
  //   field: (row: any) => row.preparados.map((p: any) => p),
  //   sortable: true,
  // },
  {
    name: 'estado',
    label: 'Modif.',
    align: 'right',
    field: (row: any) => row._modificado,
    slot: true,
    sortable: true,
  },
  {
    name: 'acciones',
    label: 'Accion',
    align: 'center',
    slot: true,
  },
];
