<template>
  <Transition name="in-out">
    <div v-if="!authStore.getUsuario">
      <formularioLogin
        style="width: 300px"
        title-btn="Iniciar sesion"
        login
        :submit="login"
      >
        <template #inputs>
          <q-input
            v-model="usuarioInput"
            type="text"
            label="Usuario"
            outlined
            dense
            clearable
          />
          <q-input
            v-model="contrasenaInput"
            label="Contraseña"
            outlined
            dense
            clearable
            type:password
          >
          </q-input>
        </template>
      </formularioLogin>
    </div>
  </Transition>

  <!-- eslint-disable-next-line -->
  <Transition name="in-out">
    <div class="w-full" v-if="authStore.getUsuario">
      <div class="w-full">
        <p class="font-bold text-xl text-center">
          Bienvenido, {{ authStore.getUsuarioNombreCompleto }}.
        </p>
        <p class="text-xl text-center">Selecciona a que negocio ingresar.</p>
      </div>
      <div
        v-for="(negocio, index) in authStore.getUsuario.negocios"
        :key="negocio.nombre"
        @click="elegirNegocio(index)"
        class="text-center"
      >
        <q-btn
          :color="getColor(negocio)"
          :src="Logo"
          class="w-full"
          style="margin-top: 10px"
        >
          {{ negocio.nombre }}
        </q-btn>
      </div>
      <div class="w-full text-center">
        <q-btn
          dense
          no-caps
          style="margin: 20px; padding: 5px 15px"
          color="primary"
          label="logout"
          @click="logout"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup>
import Logo from '@/assets/img/logo.png';
import formularioLogin from '@/modulos/main/infraestructura/componientes/formularioLogin.vue';
import { useAuth } from '~/modulos/main/API/useAuth';
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';

definePageMeta({
  layout: 'inicio',
  // middleware: ['auth'],
});

const router = useRouter();
const authStore = useAuthStore();

const usuarioInput = ref('');
const contrasenaInput = ref('');

const login = async () => {
  authStore.login('lionel', 'Siipi123');
  // authStore.login(usuarioInput.value, contrasenaInput.value);
};

const elegirNegocio = (index) => {
  const negocio = authStore.elegirNegocio(index);
  const path = authStore.getNegocio.tipo.toLowerCase();
  router.push(path);
};

const logout = () => {
  authStore.logout();
  router.push(inicio);
};

// mandamos un mensaje de confirmacio o de error cuando el
// reactive del state cambia.
authStore.$subscribe((mutation, state) => {
  if (state.usuario && state.negocio) {
    NotifySucess(`Negocio elegido: ${state.negocio.nombre}`);
  }
  if (state.usuario && !state.negocio) {
    NotifySucess(`Bienvenido al sistema ${state.usuario.nombre}`);
  }
  if (!state.usuario && mutation.payload.token !== null) {
    NotifyError(`Datos incorrectos, intente de nuevo`);
  }
  if (!state.usuario && mutation.payload.token === null) {
    NotifySucess(`Hasta pronto!`);
  }
});

const getColor = (negocio) => {
  switch (negocio.tipo) {
    case 'CATHERING':
      return 'green';
    case 'PUNTO':
      return 'orange';
    case 'CLIENTE':
      return 'black';
  }
};
</script>

<style scoped>
/* .fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
  transition-delay: 1s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade2-enter-active,
.fade2-leave-active {
  transition: opacity 1s ease;
}

.fade2-enter-from,
.fade2-leave-to {
  opacity: 0;
  transition-delay: 1s;
} */
</style>
