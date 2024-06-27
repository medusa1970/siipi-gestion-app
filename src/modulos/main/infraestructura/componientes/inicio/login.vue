<template>
  <div class="w-full">
    <div class="w-full text-center mt-2">
      <q-avatar color="green" round>
        <q-icon name="login" color="white" size="md" />
      </q-avatar>
      <div class="mt-2 mb-2">Login SIIPIGES</div>
    </div>

    <q-form @submit="formSubmit">
      <input-text
        type="password"
        label="Usuario"
        @update="(v) => (usuario.valor = v)"
        :errorMessage="usuario.error"
        :rules="[useRules.requerido('El usuario es obligatorio')]"
        default="lionel"
        icono="person"
        dense
        clearable
      />
      <input-text
        type="password"
        label="Contraseña"
        @update="(v) => (password.valor = v)"
        :errorMessage="password.error"
        :rules="[useRules.requerido()]"
        default="Siipi123"
        icono="key"
        dense
        clearable
      />
      <div class="w-full text-center">
        <q-btn label="Iniciar sesión" type="submit" color="primary" no-caps />
      </div>
    </q-form>

    <div class="w-full text-center">
      <q-btn
        label="Recuperar contraseña"
        @click="emits('go', 'rdc1')"
        dense
        no-caps
        flat
      />
      |
      <q-btn
        label="Registrarse"
        @click="emits('go', 'registro1')"
        no-caps
        dense
        flat
      />
    </div>
  </div>

  {{ passwordErr }}
</template>

<script setup>
const emits = defineEmits(['go']);
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';
const authStore = useAuthStore();

const usuario = reactiveInput();
const password = reactiveInput();

// funcion llamada al hacer submit
const formSubmit = async (datos) => {
  try {
    await authStore.login(usuario.valor, password.valor);
  } catch (e) {
    if (e === 'B102') {
      usuario.error = 'Usuario inexistente';
    } else if (e === 'B104') {
      password.error = 'Contraseña incorrecta';
    } else {
      NotifyError(`Error no tratado: ${e}`); // notificacion en caso de error desconocido
    }
    return false;
  }
};
</script>
