<template>
  <div class="w-full">
    <div class="w-full text-center mt-2">
      <q-avatar color="green" round>
        <q-icon name="person" color="white" size="lg" />
      </q-avatar>
      <div class="mt-2 mb-2">Registro de nuevo usuario</div>
    </div>

    <q-form @submit="submit">
      <input-text
        label="Nombre"
        labelAdentro
        @update="v => (nombre.value = v)"
        requerido />
      <input-text
        label="Apellido"
        labelAdentro
        @update="v => (apellido.value = v)"
        requerido />
      <input-text
        label="Usuario"
        labelAdentro
        @update="v => (usuario.value = v)"
        :error="usuario.error"
        requerido />
      <input-text
        label="Correo"
        labelAdentro
        @update="v => (correo.value = v)"
        :error="correo.error"
        requerido
        :rules="[useRules.correo()]" />
      <input-text
        label="Telefono"
        labelAdentro
        @update="v => (telefono.value = v)"
        :error="telefono.error"
        requerido
        :rules="[useRules.telefono()]" />
      <input-text
        type="password"
        label="Contraseña"
        labelAdentro
        @update="v => (password.value = v)"
        requerido
        :rules="[useRules.password]"
        icono="key" />
      <input-text
        type="password"
        label="Repetir"
        labelAdentro
        @update="v => (password2.value = v)"
        :rules="[password2Rule]"
        icono="key" />
      <div class="mt-1 w-full text-center">
        <q-btn no-caps label="Confirmar" type="submit" color="primary" />
      </div>
    </q-form>

    <div class="mt-1 w-full text-center">
      <q-btn label="volver" @click="emits('go', 'login')" dense flat no-caps />
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits(['go']);
import { useAuthStore } from '~/modulos/main/useAuthStore';
import { apiAuth } from '~/modulos/main/API/auth.api';
const authStore = useAuthStore();

const nombre = reactiveInput();
const apellido = reactiveInput();
const usuario = reactiveInput();
const correo = reactiveInput();
const telefono = reactiveInput();
const password = reactiveInput();
const password2 = reactiveInput();
const password2Rule = p =>
  p !== password.value ? 'Las contraseñas no coinciden' : true;

/**
 * Submit del formulario
 */
const submit = async () => {
  try {
    const persona = await apiAuth.registrar({
      nombre: nombre.value,
      apellido: apellido.value,
      usuario: usuario.value,
      correo: correo.value,
      telefono: telefono.value,
      contrasena: password.value
    });
    authStore.cookie.registrado = persona;
  } catch (err) {
    if (isApiBadRequest(err, 'duplicado', 'usuario')) {
      usuario.error = 'Este usuario ya está registrado';
      return;
    } else if (isApiBadRequest(err, 'duplicado', 'correo')) {
      correo.error = 'Este email ya está registrado';
      return;
    } else if (isApiBadRequest(err, 'duplicado', 'telefono')) {
      telefono.error = 'Este telefono ya está registrado';
      return;
    } else {
      errFailback(err);
      return;
    }
  }

  // cambiar a la seccion siguiente
  emits('go', 'registro2');
};
</script>
