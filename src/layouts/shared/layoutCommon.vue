<template>
  <q-layout view="lHr lpR lFr ">
    <q-header
      elevated
      :class="[
        'text-white ',
        punto && 'bg-orange-600',
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
            <p class="text-sm capitalize">
              {{
                `${authStore.getUsuarioNombreCompleto} (${authStore.getNegocio?.cargos[0]?.nombre})`
              }}
            </p>
          </div>
        </q-toolbar-title>
        <usuarioMenu />
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
        punto && 'bg-orange-600',
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
          <q-list v-for="item in menuList" :key="item" clickable :to="item.to">
            <q-expansion-item
              group="somegroup"
              :icon="item.icon"
              :label="item.label"
              style="border: 0px; color: white"
              :to="item.to"
            >
              <q-list class="q-pl-lg" v-if="item.subMenu.length > 0">
                <q-item
                  clickable
                  v-for="i in item.subMenu"
                  :key="i"
                  :to="i.to"
                  :active="active"
                >
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
import { useAuth } from '~/modulos/main/API/useAuth';
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';
import usuarioMenu from '~/modulos/main/infraestructura/componientes/usuarioMenu.vue';

const router = useRouter();
const authStore = useAuthStore();
if (!authStore.getUsuario) {
  router.push('/');
}
console.log(authStore.getUsuario);

const $q = useQuasar();
const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

// Crear un nuevo objeto Audio y asignarle la URL del archivo de sonido
// Función para reproducir el sonido
// const playSound = () => {
//   const sonido = new Audio(RickRoll);
//   sonido.play();
//   setTimeout(() => {
//     sonido.pause();
//   }, 10000);
// };

const elegirNegocio = (index, nombre) => {
  // playSound();
  $q.dialog({
    title: `<strong>Entrar a ${nombre}</strong>`,
    message: '¿Está seguro de cambiar de negocio?',
    cancel: true,
    persistent: true,
    html: true,
    prompt: {
      model: contrasena,
      type: 'password',
      clearable: true,
      // native attributes:
      min: 0,
      max: 10,
      step: 2,
      label: 'Ingrese tu contrasena',
      outlined: true,
      dense: true,
    },
  }).onOk(async () => {
    const loginResponse = await useAuth.login(
      authStore.getUsuario?.usuario,
      contrasena.value,
    );
    if (!loginResponse) {
      NotifyError(`contraseña incorrecta`);
    }

    // el login response ya tiene el nuevo token
    // authStore.setToken()

    // TODO averiguar suscripcion, etc
    // TODO BUGs de irala a iralita + cliente
    authStore.elegirNegocio(index);
    NotifySucess(`Negocio elegido: ${authStore.getNegocio.nombre}`);
    router.push(`/${authStore.getNegocio.tipo.toLowerCase()}`);
    contrasena.value = '';
  });
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
.layoutContainer {
  // #002b3c #032541
  padding: 0.5rem;
  // background-color: #071c2f;
}

// .q-drawer.q-drawer--right {
//   width: 340px !important;
// }
</style>
