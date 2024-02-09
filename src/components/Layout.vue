<template>
  <q-layout view="lHh lpR lFf">
    <q-header elevated class="text-white" style="background-color: #010f1a">
      <q-toolbar class="h-[6vh]">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="navBar">
          <h1 class="font-bold uppercase">
            {{
              useAuth.negocioElegido ? useAuth.negocioElegido.nombre : 'Cliente'
            }}
          </h1>
          <!-- NAV END -->
          <nav class="flex flex-grow justify-end basis-0 items-center gap-2">
            <q-btn
              class="lg:mr-1"
              dense
              flat
              round
              style="width: 45px; height: 45px"
              ><img
                style="border-radius: 100%; object-fit: cover"
                src="https://avatars.githubusercontent.com/u/739984?v=4"
                alt=""
              />
              <q-menu
                transition-show="rotate"
                transition-hide="rotate"
                anchor="bottom end"
                self="top end"
              >
                <q-list style="min-width: 100px">
                  <q-item clickable>
                    <q-item-section avatar>
                      <q-avatar>
                        <img
                          src="https://avatars.githubusercontent.com/u/739984?v=4"
                        />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label>Perfil</q-item-label>
                      <q-item-label caption lines="1"
                        >{{ useAuth.user.nombre }}@gmail.com</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                  <q-separator />
                  <q-expansion-item
                    group="somegroup"
                    label="Negocios"
                    icon="storefront"
                  >
                    <template v-slot:header>
                      <q-item-section avatar>
                        <q-icon
                          name="storefront"
                          color="blue"
                          class="px-[10px]"
                        />
                      </q-item-section>

                      <q-item-section> Negocios</q-item-section>
                    </template>
                    <q-list class="px-2">
                      <q-item
                        clickable
                        @click="sede"
                        v-for="negocio in useAuth.user.negocios"
                        :key="negocio.nombre"
                      >
                        <q-item-section @click="prueba(negocio)">{{
                          negocio.nombre
                        }}</q-item-section>
                      </q-item>
                      <!-- <q-item clickable @click="marca">
                    <q-item-section> Negocio 2 </q-item-section>
                  </q-item> -->
                    </q-list>
                  </q-expansion-item>
                  <q-item clickable @click="logout">
                    <q-item-section avatar class="px-[10px]">
                      <q-icon name="logout" color="red" />
                    </q-item-section>
                    <q-item-section> Cerrar sesión </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </nav>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      behavior="desktop"
      style="background-color: #010f1a"
    >
      <!-- drawer content -->
      <q-list>
        <!-- PERFIL -->
        <q-item style="height: 250px">
          <q-img
            id="portada"
            class="absolute-top"
            src="https://i.pinimg.com/564x/72/ff/9e/72ff9e50e61a70d814862dbac5944858.jpg"
            style="height: 250px"
          >
            <div id="perfil" class="absolute-bottom text-center">
              <q-avatar size="70px" class="q-mb-sm">
                <img
                  style="object-fit: cover"
                  src="https://i.pinimg.com/564x/cf/c2/5b/cfc25b552003ba8881db6e678bda0b1b.jpg"
                />
              </q-avatar>
              <div class="text-weight-bold">
                <!-- {{ user2.name + ' ' + user2.lastname }} -->
                will chambi
              </div>
              <div>willch@gmail.com</div>
            </div>
          </q-img>
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
              <q-list
                class="q-pl-lg"
                style="background-color: $dark"
                v-if="item.subMenu.length > 0"
              >
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

    <!-- SLOT -->
    <!-- <slot name="slot"/> -->

    <q-page-container>
      <div style="padding: 0.5rem">
        <slot name="slot" />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
// PROPS
defineProps({
  menuList: Array,
});

// IMPORTS
import { ref } from 'vue';
import { LocalStorage } from 'quasar';
import { useRouter } from 'vue-router';
import { authStore } from '@/stores/auth.store';
import { useQuasar } from 'quasar';
import RickRoll from '@/assets/mp3/rickroll.mp3';

const useAuth = authStore();
const router = useRouter();
const $q = useQuasar();
const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
const logout = () => {
  LocalStorage.remove('token');
  useAuth.user.nombre = '';
  useAuth.user.negocios = [];
  useAuth.token = '';
  router.push('/');
  useAuth.negocioElegido = '';
};

// Crear un nuevo objeto Audio y asignarle la URL del archivo de sonido
// const sonido = new Audio('ruta/del/archivo/sonido.mp3');
const sonido = new Audio(RickRoll);

// Función para reproducir el sonido
const playSound = () => {
  sonido.play();
  setTimeout(() => {
    sonido.pause();
  }, 10000);
};

const prueba = (negocio) => {
  playSound();
  $q.dialog({
    title: `<strong>Entrar a ${negocio.nombre}</strong>`,
    message: '¿Está seguro de cambiar de negocio?',
    cancel: true,
    persistent: true,
    html: true,
  }).onOk(async () => {
    router.push(`/${negocio.tipo.toLowerCase()}`);
    useAuth.negocioElegido = negocio; //solucion
    $q.notify({
      type: 'positive',
      position: 'center',
      message: `Bienvenido a ${negocio.nombre}`,
      progress: true,
      timeout: 1000,
    });
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
</style>
