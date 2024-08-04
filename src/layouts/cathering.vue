<template>
  <layout-common :menuList="menu" :portada-img="PortadaCathering" cathering>
    <template #slot>
      <slot />
    </template>
  </layout-common>
</template>

<script setup lang="ts">
import PortadaCathering from "@/assets/img/cookies.png";
import layoutCommon from "@/layouts/shared/layoutCommon.vue";
import { permisosBloques } from "~/modulos/almacen/paginas/bloques/bloques.composable";
import { permisosCategoria } from "~/modulos/almacen/paginas/categorias/categorias.composable";
import { permisosMarcas } from "~/modulos/almacen/paginas/marcas/marcas.composable";
import { permisosMedidas } from "~/modulos/almacen/paginas/medidas/medidas.composable";
import { permisosProductos } from "~/modulos/almacen/paginas/productos/productos.composable";
import { permisosProveedores } from "~/modulos/almacen/paginas/proveedores/proveedores.composable";
import { permisosStock } from "~/modulos/almacen/paginas/stock/stock.composable";
import { permisosEmpleados } from "~/modulos/empresa/paginas/empleados/empleados.composable";
import { permisosTesoreria } from "~/modulos/empresa/paginas/tesoreria/tesoreria.composable";
import { useAuthStore } from "~/modulos/main/useAuthStore";
const authStore = useAuthStore();
const router = useRouter();
if (authStore.getNegocio?.tipo !== "CATHERING") {
  goTo(router, "inicio");
}
const menu = [
  {
<<<<<<< HEAD
    icon: "bi-box",
    label: "Productos",
    to: "productos",
=======
    icon: "warehouse",
    label: "Almacen",
    key: "almacen",
>>>>>>> 4eb450e... finalizacion empleados + bugs + prettier double quote + menu
    permisos: permisosProductos,
    subMenu: [
      {
        icon: "bi-box",
        label: "Productos",
        to: "productos",
        permisos: permisosCategoria,
      },
      {
        icon: "category",
        label: "Categorias",
        to: "categorias",
        permisos: permisosCategoria,
      },
      {
        icon: "warehouse",
        label: "Stock",
        to: "stock",
        permisos: permisosStock,
      },
      {
        icon: "shelves",
        label: "Bloques",
        to: "bloques",
        permisos: permisosBloques,
      },
      {
        icon: "storefront",
        label: "Marcas",
        to: "marcas",
        permisos: permisosMarcas,
      },
      {
        icon: "balance",
        label: "Medidas",
        to: "medidas",
        permisos: permisosMedidas,
      },
      {
        icon: "hail",
        label: "Proveedores",
        to: "proveedores",
        permisos: permisosProveedores,
      },
    ],
  },
  {
<<<<<<< HEAD
    icon: "category",
    label: "Categorias",
    to: "categorias",
    permisos: permisosCategoria,
  },
  {
    icon: "warehouse",
    label: "Stock",
    to: "stock",
    permisos: permisosStock,
  },
  {
    icon: "shelves",
    label: "Bloques",
    to: "bloques",
    permisos: permisosBloques,
  },
  {
    icon: "menu_book",
    label: "Ofertas",
    to: "ofertas",
  },
  {
    icon: "sell",
    label: "Catalogos",
    to: "catalogos",
  },
  {
    icon: "shopping_cart",
    label: "ListaPedidos",
    to: "listaPedidos",
    soloDev: true,
  },
  {
    icon: "shopping_cart",
    label: "pedidosGlobal",
    to: "pedidosGlobal",
  },

  {
    icon: "storefront",
    label: "Marcas",
    to: "marcas",
    permisos: permisosMarcas,
  },
  {
    icon: "balance",
    label: "Medidas",
    to: "medidas",
    permisos: permisosMedidas,
  },
  {
    icon: "hail",
    label: "Proveedores",
    to: "proveedores",
    permisos: permisosProveedores,
  },
  {
    icon: "group",
    label: "Empleados",
    to: "empleados",
    permisos: permisosEmpleados,
  },
  {
    icon: "money",
    label: "Tesoreria",
    to: "tesoreria",
    permisos: permisosTesoreria,
=======
    icon: "menu_book",
    label: "Ofertas",
    key: "ofertas",
    permisos: permisosProductos,
    subMenu: [
      {
        icon: "menu_book",
        label: "Ofertas",
        to: "ofertas",
      },
      {
        icon: "category",
        label: "Catalogos",
        to: "catalogos",
      },
    ],
  },
  {
    icon: "shopping_cart",
    label: "Pedidos",
    key: "pedidos",
    permisos: permisosProductos,
    subMenu: [
      {
        icon: "shopping_cart",
        label: "ListaPedidos",
        to: "listaPedidos",
        soloDev: true,
      },
      {
        icon: "shopping_cart",
        label: "Pedidos global",
        to: "pedidosGlobal",
      },
    ],
  },
  {
    icon: "storefront",
    label: "Empresa",
    key: "empresa",
    permisos: permisosProductos,
    subMenu: [
      {
        icon: "group",
        label: "Empleados",
        to: "empleados",
        permisos: permisosEmpleados,
      },
      {
        icon: "money",
        label: "Tesoreria",
        to: "tesoreria",
        permisos: permisosTesoreria,
      },
    ],
>>>>>>> 4eb450e... finalizacion empleados + bugs + prettier double quote + menu
  },
];
</script>
