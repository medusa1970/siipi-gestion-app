<template>
  <div class="flex">
    <!-- Bienvenido -->
    <Transition name="fade">
      <div class="w-full" v-if="page === 'bienvenido'">
        <p>Bienvenido</p>
        <p>Mensaje de bienvenida</p>
        <q-btn dense no-caps label="Entrar" @click="page = 'login'" />
      </div>
    </Transition>

    <!-- Login -->
    <Transition name="fade">
      <div class="w-full" v-if="page === 'login' && !authStore.getUsuario">
        <p>Formulario de login</p>
        <q-form @submit="submitLogin">
          <div>
            <q-input
              v-model="usuarioInput"
              ref="usuarioInputRef"
              type="text"
              label="Usuario"
              outlined
              dense
              required
              :rules="[useRules.req('El usuario es obligatorio')]"
              clearable
              :error="usuarioInputErr !== null"
            >
              <template #error>
                <div>{{ usuarioInputErr }}</div>
              </template>
            </q-input>
            <q-input
              v-model="pwdInput"
              label="Contraseña"
              ref="pwdInputRef"
              :rules="[useRules.requerido]"
              outlined
              dense
              clearable
              required
              type:password
              :error="pwdInputErr !== null"
            >
              <template #error>
                <div>{{ pwdInputErr }}</div>
              </template>
            </q-input>
            <q-btn
              label="Iniciar sesión"
              @click="submitLogin"
              color="primary"
              no-caps
            />
          </div>
          <div>
            <q-btn
              dense
              label="Recuperar contraseña"
              no-caps
              @click="page = 'pedirRdc'"
            />
            <q-btn
              dense
              label="Registrarse"
              no-caps
              @click="page = 'registro'"
            />
          </div>
        </q-form>
      </div>
    </Transition>

    <!-- Negocios -->
    <Transition name="fade">
      <div class="w-full" v-if="page === 'login' && authStore.getUsuario">
        <p class="font-bold text-xl text-center">
          Bienvenido, {{ authStore.getUsuarioNombreCompleto }}.
        </p>
        <p class="text-xl text-center">Selecciona a que negocio ingresar.</p>
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
          <q-btn dense no-caps color="primary" label="logout" @click="logout" />
        </div>
      </div>
    </Transition>

    <!-- Registro -->
    <Transition name="fade">
      <div class="w-full" v-if="page === 'registro'">
        <p>Registrarse</p>
        <q-form @submit="submitRegistro">
          <div>
            <q-input
              v-model="nombreInput"
              type="text"
              label="Nombre"
              outlined
              dense
              clearable
            />
            <q-input
              v-model="apellidoInput"
              type="text"
              label="Apellido"
              outlined
              dense
              clearable
            />
            <q-input
              v-model="pwdInput1"
              label="Contraseña"
              outlined
              dense
              clearable
              type:password
            />
            <q-input
              v-model="pwdInput2"
              label="Repetir contraseña"
              outlined
              dense
              clearable
              type:password
            />
            <q-btn label="Proceder" type="submit" color="primary" no-caps />
          </div>
        </q-form>
        <q-btn dense no-caps label="volver" @click="page = 'login'" />
      </div>
    </Transition>

    <!-- Registrado -->
    <Transition name="fade">
      <div class="w-full" v-if="page === 'registrado'">
        <p>Registro OK</p>
        <q-btn dense no-caps label="volver" @click="page = 'login'" />
      </div>
    </Transition>

    <!-- PedirRdc -->
    <Transition name="fade">
      <div class="w-full" v-if="page === 'pedirRdc'">
        <p>Recuperar su contraseña</p>
        <q-form @submit="submitPedirRdc">
          <q-input
            v-model="correoInput"
            type="email"
            label="Correo electronico"
            outlined
            dense
            :error="correoInputErr !== null"
          >
            <template #error>
              <div>{{ correoInputErr }}</div>
            </template>
          </q-input>
          <q-btn
            :disable="correoInput"
            label="Enviar codigo"
            type="submit"
            color="primary"
            no-caps
          />
        </q-form>
        <q-btn dense no-caps label="volver" @click="page = 'login'" />
      </div>
    </Transition>

    <!-- ActuarRdc -->
    <Transition name="fade">
      <div class="w-full" v-if="page === 'actuarRdc'">
        <p>Entre el codigo OTP</p>

        <q-form @submit="submitActuarRdc">
          <q-input
            v-model="otp"
            type="text"
            label="Ingrese el codigo OTP"
            outlined
            dense
          />
          <q-input v-model="pwdInput" label="Nueva contraseña" outlined dense />

          <div class="flex justify-center">
            <q-btn no-caps label="OK" type="submit"></q-btn>
          </div>
        </q-form>
        <q-btn dense no-caps label="volver" @click="page = 'login'" />
      </div>
    </Transition>

    <!-- okRdc -->
    <Transition name="fade">
      <div class="w-full" v-if="page === 'okRdc'">
        <p>Rdc ok</p>
        <q-btn dense no-caps label="volver" @click="page = 'login'" />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import Logo from '@/assets/img/logo.png';
import { useAuth } from '~/modulos/main/API/useAuth';
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';

definePageMeta({
  layout: 'inicio',
  // middleware: ['auth'],
});

const router = useRouter();
const authStore = useAuthStore();
const page = ref('login');

// page 'login' formulario
const usuarioInput = ref('');
const usuarioInputRef = ref(null);
const usuarioInputErr = ref(null);
const pwdInput = ref('');
const pwdInputRef = ref(null);
const pwdInputErr = ref(null);
const submitLogin = async () => {
  resetErrores(usuarioInputErr, pwdInputErr);
  if (validarInputs(usuarioInputRef, pwdInputRef)) {
    try {
      await authStore.login(usuarioInput.value, pwdInput.value);
    } catch (e) {
      switch (e) {
        case 'B102':
          usuarioInputErr.value = 'Usuario inexistente';
          break;
        case 'B104':
          pwdInputErr.value = 'Contraseña incorrecta';
          break;
        default:
          NotifyError(`Error no tratado: ${e}`);
      }
    }
  }
};

// page 'login' negocios
const elegirNegocio = async (index) => {
  try {
    await authStore.elegirNegocio(index);
    switch (authStore.getNegocio.tipo) {
      case 'PUNTO':
        goTo(router, 'punto');
        break;
      case 'CATHERING':
        goTo(router, 'cathering');
        break;
    }
  } catch (e) {
    switch (e) {
      default:
        NotifyError(`Error no tratado: ${e}`);
    }
  }
};

const logout = () => {
  authStore.logout();
  goTo(router, 'inicio');
};
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

// page 'pedirRdc'
const correoInput = ref('leoprod2023@gmail.com');
const correoInputErr = ref(null);
const submitPedirRdc = async () => {
  try {
    const res = await useAuth.pedirRDC(correoInput.value);
    NotifySucess('Se ha enviado un codigo a tu correo');
    page.value = 'actuarRdc';
  } catch (e) {
    switch (e) {
      default:
        NotifyError(`Error no tratado: ${e}`);
    }
  }
};

// page 'actuarRdc'
const submitActuarRdc = async () => {
  page.value = 'okRdc';
  try {
    const res = await useAuth.actuarRDC(otp.value, pwdInput.value);
    if (res) {
      NotifySucess('Se ha actualizado tu contraseña');
      showOtpDialog.value = false;
    } else {
      NotifyError('Un error ocurrió, intente de nuevo');
    }
  } catch (e) {
    switch (e) {
      default:
        NotifyError(`Error no tratado: ${e}`);
    }
  }
};

// page 'registro'
const nombreInput = ref('');
const apellidoInput = ref('');
const pwdInput1 = ref('');
const pwdInput2 = ref('');
const submitRegistro = async (datos) => {
  // const nuevaPersona = await registrar(datos);
  // NotifySucess(`${nuevaPersona.nombre} se ha registrado correctamente`);
  page.value = 'registrado';
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
