export const menuListSede = [
  {
    icon: 'people',
    label: 'Empleados',
    to: '/sede/empleados',
    subMenu: [],
  },
  {
    icon: 'fact_check',
    label: 'Productos',
    to: '/sede/productos',
    subMenu: [],
  },
];

export const menuListPunto = [
  {
    icon: 'people',
    label: 'Empleados',
    to: '/punto/empleados',
    subMenu: [],
  },
  {
    icon: 'fact_check',
    label: 'Menu',
    to: '/punto/menu',
    subMenu: [],
  },
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
  {
    icon: 'point_of_sale',
    label: 'Caja',
    to: '/punto/caja',
    subMenu: [],
  },
  {
    icon: 'settings',
    label: 'Configuración',
    to: '/punto/configuracion',
    subMenu: [],
  },
];

export const menuListMarca = [
  {
    icon: 'people',
    label: 'Ofertas',
    to: '/marca/ofertas',
    subMenu: [],
  },
  {
    icon: 'fact_check',
    label: 'Gestion de catalogos',
    to: '/marca/catalogos',
    subMenu: [],
  },
];

export const menuListCathering = [
  {
    icon: 'people',
    label: 'Empleados',
    to: '/cathering/empleados',
    subMenu: [],
  },
  {
    icon: 'fact_check',
    label: 'Menu',
    to: '/cathering/menu',
    subMenu: [],
  },
  {
    icon: 'warehouse',
    label: 'Stock',
    to: '/cathering/stock',
    subMenu: [],
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
        label: 'Recibir pedido',
        to: '/cathering/pedidos/recibirPedido',
      },
      {
        label: 'ver pedidos',
        to: '/cathering/pedidos/listaPedidos',
      },
    ],
  },
  {
    icon: 'point_of_sale',
    label: 'Caja',
    to: '/cathering/caja',
    subMenu: [],
  },
  {
    icon: 'settings',
    label: 'Configuración',
    to: '/cathering/configuracion',
    subMenu: [],
  },
];
