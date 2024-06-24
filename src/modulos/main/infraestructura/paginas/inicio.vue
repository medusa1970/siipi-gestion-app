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
        <div>
          <q-input
            v-model="usuarioInput"
            type="text"
            label="Usuario"
            ref="usuarioInputRef"
            :rules="[useRules.req('El usuario es obligatorio')]"
            :error="usuarioInputErr !== null"
            outlined
            dense
            clearable
          >
            <template #error>
              <div>{{ usuarioInputErr }}</div>
            </template>
          </q-input>
          <q-input
            v-model="pwdInput"
            type="password"
            label="Contraseña"
            ref="pwdInputRef"
            :rules="[useRules.requerido]"
            :error="pwdInputErr !== null"
            outlined
            dense
            clearable
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
          <q-btn dense label="Registrarse" no-caps @click="page = 'registro'" />
        </div>
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
        <div>
          <q-input
            v-model="correoInput"
            type="email"
            label="Correo electronico"
            ref="correoInputRef"
            :rules="[useRules.req(), useRules.email()]"
            :error="correoInputErr !== null"
            outlined
            dense
          >
            <template #error>
              <div>{{ correoInputErr }}</div>
            </template>
          </q-input>
          <q-btn
            label="Enviar codigo"
            @click="submitPedirRdc"
            color="primary"
            no-caps
          />
        </div>
        <q-btn dense no-caps label="volver" @click="page = 'login'" />
      </div>
    </Transition>

    <!-- ActuarRdc1 -->
    <Transition name="fade">
      <div class="w-full" v-if="page === 'actuarRdc1'">
        <p>
          Entre el código que habrá recibido en su correo (<b>{{
            correoInput
          }}</b
          >)
        </p>

        <div>
          <q-input
            v-model="rdcTokenInput"
            type="text"
            label="Código"
            ref="rdcTokenInputRef"
            :rules="[useRules.req()]"
            :error="rdcTokenInputErr !== null"
            outlined
            dense
          >
            <template #error>
              <div>{{ rdcTokenInputErr }}</div>
            </template>
          </q-input>
          <div class="flex justify-center">
            <q-btn
              no-caps
              label="OK"
              @click="submitActuarRdc1"
              type="siguiente"
            ></q-btn>
          </div>
        </div>
        <q-btn dense no-caps label="volver" @click="page = 'login'" />
      </div>
    </Transition>

    <!-- ActuarRdc2 -->
    <Transition name="fade">
      <div class="w-full" v-if="page === 'actuarRdc2'">
        <p>Elija su nueva contraseña</p>
        <q-input
          v-model="pwd1Input"
          type="password"
          label="Nueva contraseña"
          ref="pwd1InputRef"
          :rules="[useRules.req(), useRules.password]"
          :error="pwd1InputErr !== null"
          outlined
          dense
        >
          <template #error>
            <div>{{ pwd1InputErr }}</div>
          </template>
        </q-input>
        <q-input
          v-model="pwd2Input"
          type="password"
          label="Repetir"
          ref="pwd2InputRef"
          :error="pwd2InputErr !== null"
          outlined
          dense
        >
          <template #error>
            <div>{{ pwd2InputErr }}</div>
          </template>
        </q-input>
        <div class="flex justify-center">
          <q-btn no-caps label="Confirmar" @click="submitActuarRdc2" />
        </div>
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

    <!-- byebye -->
    <Transition name="fade">
      <div class="w-full" v-if="page === 'byebye'">
        <p>Hasta luego !</p>
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
if (authStore.getRecienDesconectado()) {
  page.value = 'byebye';
}

/**
 * Formulario de login
 */
const usuarioInput = ref('');
const usuarioInputRef = ref(null);
const usuarioInputErr = ref(null);
const pwdInput = ref('');
const pwdInputRef = ref(null);
const pwdInputErr = ref(null);
const submitLogin = async () => {
  resetErrores(usuarioInputErr, pwdInputErr);
  if (!validarInputs(usuarioInputRef, pwdInputRef)) return false;
  try {
    await authStore.login(usuarioInput.value, pwdInput.value);
  } catch (e) {
    if (e === 'B102') {
      usuarioInputErr.value = 'Usuario inexistente';
    } else if (e === 'B104') {
      pwdInputErr.value = 'Contraseña incorrecta';
    } else {
      NotifyError(`Error no tratado: ${e}`);
    }
    return false;
  }
};

/**
 * Elegir negocio
 */
const elegirNegocio = async (index) => {
  try {
    await authStore.elegirNegocio(index);
  } catch (e) {
    NotifyError(`Error no tratado: ${e}`);
  }
  switch (authStore.getNegocio.tipo) {
    case 'PUNTO':
      goTo(router, 'punto');
      break;
    case 'CATHERING':
      goTo(router, 'cathering');
      break;
    case 'CLIENTELA':
      goTo(router, 'cliente');
      break;
  }
};
const logout = () => {
  authStore.logout();
  goTo(router, 'inicio');
};
const getColor = (negocio) => {
  console.log(negocio.tipo);
  switch (negocio.tipo) {
    case 'CATHERING':
      return 'green';
    case 'PUNTO':
      return 'orange';
    case 'CLIENTELA':
      return 'black';
  }
};

/**
 * Pedir RDC
 */
const correoInput = ref('leoprod2023@gmail.com');
const correoInputRef = ref(null);
const correoInputErr = ref(null);
const submitPedirRdc = async () => {
  resetErrores(correoInputErr);
  if (!validarInputs(correoInputRef)) return false;
  try {
    const res = await useAuth.pedirRDC(correoInput.value);
  } catch (e) {
    if (e === 'B106') {
      correoInputErr.value = 'Email desconocido';
    } else {
      NotifyError(`Error no tratado: ${e}`);
    }
    return false;
  }
  page.value = 'actuarRdc1';
};

// page 'actuarRdc1'
const rdcTokenInput = ref('');
const rdcTokenInputRef = ref(null);
const rdcTokenInputErr = ref(null);
const submitActuarRdc1 = async () => {
  resetErrores(rdcTokenInputErr);
  if (!validarInputs(rdcTokenInputRef)) return false;
  let codigoOk;
  try {
    codigoOk = await useAuth.actuarRDC(rdcTokenInput.value);
  } catch (e) {
    NotifyError(`Error no tratado: ${e}`);
    return false;
  }
  if (codigoOk) {
    authStore.cookie.rdcToken = rdcTokenInput.value;
    page.value = 'actuarRdc2';
  } else {
    rdcTokenInputErr.value = 'token inválido';
  }
};

// page 'actuarRdc2'
const pwd1Input = ref('');
const pwd1InputRef = ref(null);
const pwd1InputErr = ref(null);
const pwd2Input = ref('');
const pwd2InputRef = ref(null);
const pwd2InputErr = ref(null);
const submitActuarRdc2 = async () => {
  resetErrores(pwd1InputErr, pwd2InputErr);
  if (!validarInputs(pwd1InputRef, pwd2InputRef)) return false;
  if (pwd1Input.value !== pwd2Input.value) {
    pwd2InputErr.value = 'Ambas contraseñas deben coindicir';
    return false;
  }
  try {
    await useAuth.actuarRDC(authStore.cookie.rdcToken, pwd1Input.value);
  } catch (e) {
    NotifyError(`Error no tratado: ${e}`);
    return false;
  }
  page.value = 'okRdc';
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

// mandamos un mensaje de confirmacion o de error cuando el
// reactive del state cambia.
authStore.$subscribe((mutation, state) => {
  if (state.usuario && state.negocio) {
    NotifySucess(`Negocio elegido: ${state.negocio.nombre}`);
  }
  // if (state.usuario && !state.negocio) {
  //   NotifySucess(`Bienvenido al sistema ${state.usuario.nombre}`);
  // }
  // if (!state.usuario && mutation.payload?.token === null) {
  //   NotifySucess(`Hasta pronto!`);
  // }
  // if (!state.usuario && mutation.payload?.token !== null) {
  //   NotifyError(`Datos incorrectos, intente de nuevo`);
  // }
  // if (!state.usuario && mutation.payload?.token === null) {
  //   NotifySucess(`Hasta pronto!`);
  // }
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
