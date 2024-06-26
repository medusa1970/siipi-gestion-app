<template>
  <div>
    <div class="relative">
      <!-- LOGIN -->
      <div class="absolute inset-0">
        <Transition
          enter-active-class="transition-all duration-700 ease-out"
          enter-from-class="opacity-0 -translate-x-full"
          enter-to-class="opacity-100 translate-x-0"
          leave-active-class="transition-all duration-700 ease-out"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 translate-x-full"
        >
          <div
            class="w-full h-screen flex flex-col justify-center items-center"
            v-if="!show3 && !show4 && !authStore.getUsuario"
          >
            <img style="width: 100%" :src="Logo" />
            <formularioLogin
              style="width: 100%"
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
                  type="password"
                />
              </template>
            </formularioLogin>
          </div>
        </Transition>
      </div>
      <!-- SELECCION DE NEGOCIOS -->
      <div class="absolute inset-0">
        <Transition
          enter-active-class="transition-all duration-700 ease-out"
          enter-from-class="opacity-0 -translate-x-full"
          enter-to-class="opacity-100 translate-x-0"
          leave-active-class="transition-all duration-700 ease-in-out"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 translate-x-full"
        >
          <div
            class="w-full h-screen flex flex-col justify-center items-center"
            v-if="!show3 && !show4 && authStore.getUsuario"
          >
            <img style="width: 100%" :src="Logo" />
            <div class="w-full">
              <p class="font-bold text-lg text-center">
                Bienvenido, {{ authStore.getUsuarioNombreCompleto }}.
              </p>
              <p class="text-center">Selecciona a que negocio ingresar.</p>
            </div>
            <div
              v-for="(negocio, index) in authStore.getUsuario.negocios"
              :key="negocio.nombre"
              @click="elegirNegocio(index)"
              class="text-center w-full"
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
              <q-btn
                dense
                no-caps
                style="margin: 20px; padding: 5px 15px"
                color="primary"
                label="show 3"
                @click="show(3)"
              />
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- OTROS -->
    <div class="block-wrapper">
      <div class="block3">
        <Transition name="fade">
          <div class="w-full" v-if="show3">
            <q-btn
              dense
              no-caps
              style="margin: 20px; padding: 5px 15px"
              color="primary"
              label="show 4"
              @click="show(4)"
            />
            <p>Lorem ipsum 3</p>
          </div>
        </Transition>
      </div>
    </div>
    <div class="block-wrapper">
      <div class="block4">
        <Transition name="fade">
          <div class="w-full" v-if="show4">
            <p>Lorem ipsum 4</p>
            <q-btn
              dense
              no-caps
              style="margin: 20px; padding: 5px 15px"
              color="primary"
              label="show 3"
              @click="show(3)"
            />
            <q-btn
              dense
              no-caps
              style="margin: 20px; padding: 5px 15px"
              color="primary"
              label="hide"
              @click="show()"
            />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import Logo from '@/assets/img/logo.png';
import formularioLogin from '@/modulos/main/infraestructura/componientes/formularioLogin.vue';
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';
import { iniciarLocalForage } from '@/modulos/main/negocio/localForage.config';

definePageMeta({
  layout: 'inicio',
  // middleware: ['auth'],
});

/**
 * REACTIVOS
 */
const router = useRouter();
const authStore = useAuthStore();

const usuarioInput = ref('');
const contrasenaInput = ref('');
const show3 = ref(false);
const show4 = ref(true);
const show = (num) => {
  show3.value = false;
  show4.value = false;
  console.log(num);
  if (num === 3) {
    show3.value = true;
    show4.value = false;
  }
  if (num === 4) {
    show3.value = false;
    show4.value = true;
  }
};

/**
 * METODOS Y FUNCIONES
 */

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

onMounted(() => {
  console.log('first');
  iniciarLocalForage();
});
</script>

<style scoped>
/* transition para OTROS */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
