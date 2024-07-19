<template>
  <q-layout view="lHr lpR lFr ">
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
      <q-toolbar class="h-[6vh]">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title class="navBar">
          <div>
            <h1 class="font-bold uppercase">
              {{ authStore.getNegocio?.nombre }}
            </h1>
            <!-- <p class="text-sm capitalize">
              {{
                `${authStore.getUsuarioNombreCompleto} (${authStore.getNegocio?.cargos[0]?.nombre})`
              }}
            </p> -->
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
    </q-header>

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
      <q-list>
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
        <div id="vistas-objetos">
          <q-list
            v-for="item in menuList"
            :key="item"
            @click.prevent="goTo(router, item.to)"
          >
            <q-expansion-item
              group="somegroup"
              :icon="item.icon"
              :label="item.label"
              style="border: 0px; color: white"
              :to="item.to"
            >
              <q-list class="q-pl-lg" v-if="item.subMenu?.length > 0">
                <q-item clickable v-for="i in item.subMenu" :key="i" :to="i.to">
                  <q-item-section>{{ i.label }}</q-item-section>
                  <q-item-section avatar>
                    <q-icon color="secondary" name="keyboard_arrow_right" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
            <!-- <q-separator /> -->
          </q-list>
          <!-- <DrawerMenuAdm :menu-list="menuList" /> -->
        </div>
      </q-list>
    </q-drawer>

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

    <q-page-container>
      <div class="layoutContainer">
        <slot name="slot" />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
// PROPS
defineProps({
  menuList: Array,
  punto: Boolean,
  sede: Boolean,
  portadaImg: String,
  cathering: Boolean,
});

// IMPORTS
import { ref, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import RickRoll from '@/assets/mp3/rickroll.mp3';
import Portada from '@/assets/img/marco.png';
import PortadaPunto from '@/assets/img/backPunto.png';
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';
import usuarioMenu from '~/modulos/main/infraestructura/componientes/usuarioMenu.vue';
import { storePedido } from '@/modulos/pedidos/negocio/pedido.store';

const router = useRouter();
const authStore = useAuthStore();
const pedidoStore = storePedido();

if (!authStore.getUsuario) {
  goTo(router, 'inicio');
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
  // #231f20 011627
  background-color: #011627;
}

// .q-drawer.q-drawer--right {
//   width: 340px !important;
// }
</style>
~/modulos/main/API/authService
