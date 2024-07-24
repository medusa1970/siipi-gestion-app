<template>
  <div class="flex">
    <!-- Formulario de login -->
    <Transition name="fade">
      <login
        v-if="page === 'login' && !authStore.getUsuario"
        @go="(p) => (page = p)"
      />
    </Transition>

    <!-- Elegir un negocio -->
    <Transition name="fade">
      <negocios
        v-if="page === 'login' && authStore.getUsuario"
        @go="(p) => (page = p)"
      />
    </Transition>

    <!-- Registro nuevo usuario -->
    <Transition name="fade">
      <registro1 v-if="page === 'registro1'" @go="(p) => (page = p)" />
    </Transition>
    <Transition name="fade">
      <div>
        <div class="w-full" v-if="page === 'registro2'">
          <p>Registro OK {{ authStore.getCookie.registrado?.nombre }}</p>
          <q-btn dense no-caps label="volver" @click="page = 'login'" />
        </div>
      </div>
    </Transition>

    <!-- Rinicializacion de contraseña -->
    <Transition name="fade">
      <rdc1 v-if="page === 'rdc1'" @go="(p) => (page = p)" />
    </Transition>
    <Transition name="fade">
      <rdc2 v-if="page === 'rdc2'" @go="(p) => (page = p)" />
    </Transition>
    <Transition name="fade">
      <rdc3 v-if="page === 'rdc3'" @go="(p) => (page = p)" />
    </Transition>
    <Transition name="fade">
      <div class="w-full" v-if="page === 'rdc4'">
        <div class="w-full text-center mt-2">
          <q-avatar color="green" round>
            <q-icon name="check" color="white" size="lg" />
          </q-avatar>
          <div class="mt-2 mb-2">Contraseña cambiada</div>
        </div>
        <div class="w-full text-center">
          <q-btn label="volver" @click="page = 'login'" dense flat no-caps />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'inicio',
  // middleware: ['auth'],
});
import { useAuthStore } from '~/modulos/main/useAuthStore';
import login from './login.vue';
import negocios from './negocios.vue';
import rdc1 from './rdc1.vue';
import rdc2 from './rdc2.vue';
import rdc3 from './rdc3.vue';
import registro1 from './registro1.vue';
const authStore = useAuthStore();

/**
 * refs
 */

const page = ref('login');
if (authStore.getRecienDesconectado()) {
  page.value = 'login'; // o 'byebye'
}

/**
 * watch y subscripciones
 */

// mandamos un mensaje de confirmacion o de error cuando el reactive del state cambia.
authStore.$subscribe((mutation, state) => {
  if (state.usuario && state.negocio) {
    NotifySucess(`Negocio elegido: ${state.negocio.nombre}`);
  }
});

// onMounted(() => {
//   iniciarLocalForage();
// });
</script>

<style scoped>
.fade-leave-from {
  opacity: 100%;
}
.fade-leave-active {
  transition-duration: 0.2s;
  order: 1;
}
.fade-leave-to {
  opacity: 0%;
}

.fade-enter-from {
  opacity: 0%;
}
.fade-enter-active {
  transition-delay: 0.2s;
  transition-duration: 0.2;
  order: 100;
}
.fade-enter-to {
  opacity: 100%;
}
</style>
