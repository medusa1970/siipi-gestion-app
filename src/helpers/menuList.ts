export const menuListCathering = [
  {
    icon: 'bi-box',
    label: 'Logistica',
    subMenu: [
      {
        label: 'Productos',
        to: '/cathering/sede/productos',
      },
      {
        label: 'Categorias de productos ',
        to: '/cathering/sede/productos/categorias',
      },
      {
        label: 'Proveedores',
        to: '/cathering',
      },
    ],
  },
  {
    icon: 'warehouse',
    label: 'Almacen',
    subMenu: [
      {
        label: 'Stock ',
        to: '/cathering/stock',
      },
      {
        label: 'Adquisicion',
        to: '/cathering/pedidos/recibirProductos/85a4475e446a5885b05739c4',
      },
      {
        label: 'Inventario',
        to: '/cathering/inventario',
      },
      // {
      //   label: 'Despacho',
      //   to: '/cathering/pedidos/despacharProductos',
      // },
    ],
  },
  {
    icon: 'sell',
    label: 'Venta',
    subMenu: [
      {
        label: 'Ofertas',
        to: '/cathering/sede/ofertas',
      },
      {
        label: 'Catalogos de oferta',
        to: '/cathering/sede/catalogos/75a4475e446a5885b05739c4',
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
  {
    icon: 'sell',
    label: 'Areas',
    subMenu: [
      {
        label: 'Panaderia',
        to: '/cathering',
      },
      {
        label: 'Reposteria',
        to: '/cathering',
      },
    ],
  },

  {
    icon: 'people',
    label: 'Administracion',
    subMenu: [
      {
        label: 'Datos de la empresa',
        to: '/cathering',
      },
      {
        label: 'Empleados',
        to: '/cathering/empleados',
      },
    ],
  },
  {
    icon: 'inventory_2',
    label: 'Gestion',
    subMenu: [
      {
        label: 'Problemas de inventario',
        to: '/cathering/inventario/listaProblemas',
      },
    ],
  },

  // {
  //   icon: 'fact_check',
  //   label: 'Menu',
  //   to: '/cathering/menu',
  //   subMenu: [],
  // },

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

/*
export const menuListSede = [
  {
    icon: 'people',
    label: 'Empleados',
    to: '/cathering/sede/empleados',
    subMenu: [],
  },
  {
    icon: 'bi-box',
    label: 'Productos',
    subMenu: [
      {
        label: 'Gestion de categorias',
        to: '/cathering/sede/productos/categorias',
      },
      {
        label: 'Productos',
        to: '/cathering/sede/productos',
      },
    ],
  },
  {
    icon: 'sell',
    label: 'Ofertas',
    subMenu: [
      {
        label: 'Gestion de catalogos',
        to: '/cathering/sede/catalogos',
      },
      {
        label: 'Ofertas',
        to: '/cathering/sede/ofertas',
      },
    ],
  },
];
*/
