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
        label="Usuario"
        labelAdentro
        @update="v => (usuario.value = v)"
        :error="usuario.error"
        requerido="El usuario es obligatorio"
        default="lionel"
        icono="person" />
      <input-text
        tipo="password"
        label="Contraseña"
        labelAdentro
        @update="v => (password.value = v)"
        :error="password.error"
        requerido
        default="Siipi123"
        icono="key" />
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
        flat />
      |
      <q-btn
        label="Registrarse"
        @click="emits('go', 'registro1')"
        no-caps
        dense
        flat />
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits(['go']);
import { useAuthStore } from '~/modulos/main/useAuthStore';
const authStore = useAuthStore();
const usuario = reactiveInput();
const password = reactiveInput();

// funcion llamada al hacer submit
const formSubmit = async datos => {
  try {
    await authStore.login(usuario.value, password.value);
  } catch (err) {
    if (isApiNotFound(err, 'usuario')) {
      usuario.error = 'Usuario inexistente';
    } else if (isApiBadRequest(err, 'password')) {
      password.error = 'Contraseña incorrecta';
    } else {
      errFailback(err);
      return;
    }
  }
};
</script>
