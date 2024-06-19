<template>
  <div class="flex flex-col justify-center items-center h-[100vh]">
    <Transition name="fade">
      <div style="position: Absolute" v-if="!authStore.getUser">
        <img class="w-80 max-sm:w-[300px]" :src="Logo" />
        <Formulario title-btn="Iniciar sesion" login :submit="login">
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
        </Formulario>
      </div>
    </Transition>

    <!-- eslint-disable-next-line -->
    <Transition name="fade">
      <div style="position: Absolute" v-if="authStore.getUser">
        <div class="flex gap-2 justify-center">
          <h1 class="font-bold text-xl text-center">
            Selecciona a que negocio ingresar
          </h1>
          <q-btn
            dense
            no-caps
            padding="0 10px"
            color="primary"
            label="logout"
            @click="logout"
          />
        </div>
        <div
          class="flex gap-3 mt-2 cursor-pointer justify-center max-h-[65vh] min-h-max overflow-x-auto"
        >
          <q-card
            v-for="(negocio, index) in authStore.getUser.negocios"
            :key="negocio.nombre"
            @click="elegirNegocio(index)"
            :class="[
              'w-44 hover:opacity-90 border-4 rounded-none',
              negocio.tipo === 'SEDE' && 'border-blue-500',
              negocio.tipo === 'MARCA' && 'border-orange-500',
              negocio.tipo === 'PUNTO' && 'border-green-500',
              negocio.tipo === 'CATHERING' && 'border-green-500',
              negocio.tipo === 'CLIENTE' && 'border-white',
            ]"
          >
            <q-img
              src="https://cdn.quasar.dev/img/parallax2.jpg"
              class="w-full h-full"
            >
              <div class="absolute-bottom text-center font-bold bg-red-500">
                <h1 class="">
                  {{ negocio.nombre }}
                </h1>
              </div>
            </q-img>
          </q-card>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import Logo from '@/assets/img/logo.png';
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';

definePageMeta({
  layout: false,
  middleware: ['auth'],
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
  router.push('/');
};

// mandamos un mensaje de confirmacio o de error cuando el
// reactive del state cambia.
authStore.$subscribe((mutation, state) => {
  if (state.user && state.negocio) {
    NotifySucess(`Negocio elegido: ${state.negocio.nombre}`);
  }
  if (state.user && !state.negocio) {
    NotifySucess(`Bienvenido al sistema ${state.user.nombre}`);
  }
  if (!state.user && mutation.payload.token !== null) {
    NotifyError(`Datos incorrectos, intente de nuevo`);
  }
  if (!state.user && mutation.payload.token === null) {
    NotifySucess(`Hasta pronto!`);
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
