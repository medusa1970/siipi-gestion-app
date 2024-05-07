export const menuListSede = [
  {
    icon: 'people',
    label: 'Empleados',
    to: '/sede/empleados',
    subMenu: [],
  },
  {
    icon: 'bi-box',
    label: 'Productos',
    subMenu: [
      {
        label: 'Gestion de categorias',
        to: '/sede/productos/categorias',
      },
      {
        label: 'Productos',
        to: '/sede/productos',
      },
    ],
  },
  {
    icon: 'sell',
    label: 'Ofertas',
    subMenu: [
      {
        label: 'Gestion de catalogos',
        to: '/sede/catalogos',
      },
      {
        label: 'Ofertas',
        to: '/sede/ofertas',
      },
    ],
  },
];

export const menuListPunto = [
  {
    icon: 'people',
    label: 'Empleados',
    to: '/punto/empleados',
    subMenu: [],
  },
  // {
  //   icon: 'fact_check',
  //   label: 'Menu',
  //   to: '/punto/menu',
  //   subMenu: [],
  // },
  {
    icon: 'warehouse',
    label: 'Stock',
    to: '/punto/stock',
    subMenu: [],
  },
  {
    icon: 'inventory_2',
    label: 'Inventario',
    subMenu: [
      {
        label: 'Lista Inventario',
        to: '/punto/inventario',
      },
      {
        label: 'Problemas Inventario',
        to: '/punto/inventario/listaProblemas',
      },
    ],
  },
  {
    icon: 'description',
    label: 'Pedidos',
    subMenu: [
      {
        label: 'Realizar pedido',
        to: '/punto/pedidos/realizarPedido',
      },
      {
        label: 'ver pedidos',
        to: '/punto/pedidos/listaPedidos',
      },
    ],
  },
  // {
  //   icon: 'point_of_sale',
  //   label: 'Caja',
  //   to: '/punto/caja',
  //   subMenu: [],
  // },
  // {
  //   icon: 'settings',
  //   label: 'Configuración',
  //   // to: '/punto/configuracion',
  //   subMenu: [],
  // },
];

export const menuListCathering = [
  {
    icon: 'people',
    label: 'Empleados',
    to: '/cathering/empleados',
    subMenu: [],
  },
  // {
  //   icon: 'fact_check',
  //   label: 'Menu',
  //   to: '/cathering/menu',
  //   subMenu: [],
  // },
  {
    icon: 'warehouse',
    label: 'Stock',
    subMenu: [
      {
        label: 'Recibir productos',
        to: '/cathering/pedidos/recibirProductos',
      },
      {
        label: 'Despachar productos',
        to: '/cathering/pedidos/despacharProductos',
      },
      {
        label: 'ver stock',
        to: '/cathering/stock',
      },
    ],
  },
  {
    icon: 'inventory_2',
    label: 'Inventario',
    subMenu: [
      {
        label: 'Lista Inventario',
        to: '/cathering/inventario',
      },
      {
        label: 'Problemas Inventario',
        to: '/cathering/inventario/listaProblemas',
      },
    ],
  },
  {
    icon: 'description',
    label: 'Pedidos',
    subMenu: [
      {
        label: 'ver pedidos',
        to: '/cathering/pedidos/listaPedidos',
      },
    ],
  },
  // {
  //   icon: 'point_of_sale',
  //   label: 'Caja',
  //   subMenu: [
  //     {
  //       label: 'Sucursal cobrar',
  //       to: '/cathering/caja',
  //     },
  //     {
  //       label: 'Confirmar pagos',
  //       to: '/cathering/caja/confirmarPagos',
  //     },
  //   ],
  // },
  // {
  //   icon: 'settings',
  //   label: 'Configuración',
  //   // to: '/cathering/configuracion',
  //   subMenu: [],
  // },
];
