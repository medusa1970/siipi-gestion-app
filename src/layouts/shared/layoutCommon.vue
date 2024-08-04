<template>
  <q-layout view="lHr lpR lFr ">
    <!-- header -->
    <q-header
      elevated
      :class="[
        'text-white ',
        punto && 'bg-[#ff9215]',
        cathering && 'bg-green-700',
        sede && 'colorBackground',
      ]"
      style=""
    >
      <q-toolbar class="">
        <q-toolbar-title
          class="flex items-center justify-start"
          style="margin: 0 !important"
        >
          <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
          <div class="text-base">
            {{ authStore.getNegocio?.nombre }}
          </div>
        </q-toolbar-title>
        <usuarioMenu />
        <q-btn
          flat
          round
          color="white"
          icon="shopping_cart"
          @click="toggleRightDrawer"
        >
          <q-badge
            v-if="pedidoStore.listaPedido.length > 0"
            class="rounded-full"
            rounded
            color="orange"
            floating
            >{{ pedidoStore.listaPedido.length }}</q-badge
          >
        </q-btn>
      </q-toolbar>
      <q-breadcrumbs class="flex bg-orange pl-4">
        <q-breadcrumbs-el
          class="text-white"
          icon="home"
          :to="getRoute(router, 'cathering')"
        />
        <q-breadcrumbs-el
          v-for="nivel in infoPagina?.camino"
          :label="nivel.label"
          :icon="nivel.icon ?? undefined"
          :to="getRoute(router, nivel.to, nivel.params)"
        />
      </q-breadcrumbs>
    </q-header>

    <!-- drawer a la izquierda -->
    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      behavior="desktop"
      style=""
      :class="[
        'text-white ',
        punto && 'bg-[#ff9215]',
        cathering && 'bg-green-700',
        sede && 'colorBackground',
      ]"
    >
      <!-- drawer content -->
      <!-- PERFIL -->
      <q-item style="height: 150px; width: 300px">
        <q-img
          id="portada"
          class="absolute-top"
          :src="portadaImg"
          style="width: 300px; height: 150px"
          fit="cover"
          position="top right"
        >
          <div
            id="perfil"
            class="absolute-bottom text-center"
            style="height: 40px; padding: 9px; z-index: 100"
          >
            {{
              `${authStore.getUsuarioNombreCompleto} (${authStore.getCargo})`
            }}
          </div>
        </q-img>
        <div class="w-full h-full flex justify-center items-center">
          <q-avatar size="100px">
            <img
              v-if="authStore.getUsuario?.cloudinaryUrl"
              style="object-fit: cover"
              :src="authStore.getUsuario?.cloudinaryUrl"
            />
            <img
              v-else
              style="object-fit: cover"
              src="https://i.pinimg.com/564x/20/c0/0f/20c00f0f135c950096a54b7b465e45cc.jpg"
            />
          </q-avatar>
        </div>
      </q-item>

      <!-- menu section -->
      <q-list>
        <q-list-item v-for="item in menuList">
          <q-expansion-item
            v-if="!item.soloDev || $config.public.DeployStatus !== 'PROD'"
            v-model="menuState[item.key]"
            :icon="item.icon"
            :class="'w-full' + (item.to === routeName ? ' bg-orange' : '')"
            :label="item.label"
            @click="
              if (item.to) {
                router.push(getRoute(router, item.to));
              } else {
                // for (const i of menuList) {
                //   menuState[i.key] = item?.key === i?.key;
                // }
              }
            "
          >
            <div v-for="subItem in item.subMenu ?? []">
              <q-btn
                :to="getRoute(router, subItem.to)"
                v-if="
                  (!subItem.soloDev ||
                    $config.public.DeployStatus !== 'PROD') &&
                  authStore.autorizar(subItem.permisos)
                "
                :class="
                  'w-full' + (subItem.to === routeName ? ' bg-orange' : '')
                "
                background="orange"
                align="left"
                flat
                no-caps
                ><template #default>
                  <q-icon
                    :name="subItem.icon"
                    style="
                      font-size: 20px;
                      padding-left: 22px;
                      margin-right: 10px;
                    "
                  />
                  {{ subItem.label }}
                </template>
              </q-btn>
            </div>
          </q-expansion-item>
        </q-list-item>
      </q-list>
    </q-drawer>

    <!-- drawer a la derecha -->
    <q-drawer
      v-model="rightDrawerOpen"
      side="right"
      class="colorBackground"
      style=""
    >
      <!-- drawer content -->
      <q-list>
        <!-- SIDEBAR -->
        <div class="text-white py-4 flex flex-col gap-4">
          <h1 class="text-center font-extrabold">PEDIDOS</h1>

          <q-list>
            <q-expansion-item
              switch-toggle-side
              expand-separator
              default-opened
              class="[&>div>div>div>i]:bg-orange-400 [&>div>div>div>i]:rounded-full [&>div>div>div>i]:text-white"
            >
              <template v-slot:header>
                <div class="flex items-center">
                  <!-- uppercase font-bold line-clamp-1 -->
                  <p class="font-semibold">
                    Pedido productos ({{ pedidoStore.listaPedido.length }})
                  </p>
                </div>
              </template>
              <div class="p-2">
                <h1 v-if="pedidoStore.listaPedido.length == 0">
                  No hay productos...
                </h1>
                <div
                  class="grid grid-cols-[70px_1fr_30px] gap-2 mb-2"
                  v-for="producto in pedidoStore.listaPedido"
                  :key="producto.id"
                >
                  <div>
                    <input
                      type="number"
                      class="w-full test border-[1px] border-gray-400 px-2 py-1 outline-none bg-transparent"
                      v-model.number="producto.cantidad"
                      min="0"
                      @input="
                        producto.cantidad = Math.max(0, producto.cantidad)
                      "
                    />
                  </div>
                  <!-- <h1 class="w-[30px] borde2">{{ producto.cantidad }}</h1> -->
                  <h1>{{ producto.nombre }}</h1>
                  <q-btn
                    color="red"
                    icon="delete"
                    flat
                    dense
                    rounded
                    size="sm"
                    @click="borrarProductoCarrito(producto.id)"
                  />
                </div>

                <div
                  v-if="pedidoStore.listaPedido.length > 0"
                  class="flex gap-2 justify-center"
                >
                  <slot name="actionPedido" />
                </div>
              </div>
            </q-expansion-item>
          </q-list>
        </div>
      </q-list>
    </q-drawer>

    <!-- pagina -->
    <q-page-container>
      <div class="text-center">
        <q-btn rounded color="black" style="margin-top: 15px">
          {{ infoPagina?.titulo }}
        </q-btn>
      </div>
      <div id="layoutContainer">
        <slot name="slot" />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
// breadcrumb
const infoPagina = inject("infoPagina");

// PROPS
const props = defineProps({
  menuList: Array,
  punto: Boolean,
  sede: Boolean,
  portadaImg: String,
  cathering: Boolean,
  nav: Array,
  tituloPagina: String,
});

const { name: routeName } = useRoute();
const menuState = reactive(
  Object.fromEntries(
    props.menuList.map((item) => [
      item.key,
      false ||
        (item.to && item.to === routeName) ||
        (item.subMenu &&
          item.subMenu.find((subItem) => subItem.to === routeName)) !=
          undefined,
    ]),
  ),
);

// IMPORTS
import { ref, watch, reactive } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useAuthStore } from "~/modulos/main/useAuthStore";
import usuarioMenu from "~/modulos/main/componientes/usuarioMenu.vue";
import { storePedido } from "@/modulos/pedidos/pedidos.store";

const router = useRouter();
const authStore = useAuthStore();
const pedidoStore = storePedido();

if (!authStore.getUsuario) {
  goTo(router, "inicio");
}

const $q = useQuasar();
const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}

const borrarProductoCarrito = (id) => {
  pedidoStore.listaPedido = pedidoStore.listaPedido.filter(
    (producto) => producto.id !== id,
  );
};
</script>
<style lang="scss">
.navBar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h6 {
    color: $white;
  }
}
.colorBackground {
  // #231f20 011327
  background-color: #011327;
}
.q-breadcrumbs a {
  color: white;
}

// .q-drawer.q-drawer--right {
//   width: 340px !important;
// }
</style>
