<template>
  <div class="w-full">
    <div class="w-full text-center mt-2">
      <q-avatar color="green" round>
        <q-icon name="key" color="white" size="lg" />
      </q-avatar>
      <div class="mt-2 mb-2">Recupera tu contraseña (3/3)</div>
    </div>

    <q-form @submit="submit">
      <input-text
        tipo="password"
        label="Contraseña"
        labelAdentro
        @update="v => (password.value = v)"
        requerido
        :rules="[useRules.password]"
        icono="key" />
      <input-text
        tipo="password"
        label="Repetir"
        @update="v => (password2.value = v)"
        :rules="[password2Rule]"
        icono="key" />
      <div class="mt-1 w-full text-center">
        <q-btn label="Confirmar" type="submit" color="primary" no-caps />
      </div>
    </q-form>

    <div class="w-full text-center">
      <q-btn label="volver" @click="emits('go', 'login')" dense flat no-caps />
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits(['go']);
import { useAuthStore } from '~/modulos/main/useAuthStore';
const authStore = useAuthStore();

const password = reactiveInput();
const password2 = reactiveInput();
const password2Rule = p => {
  return p !== password.value ? 'Las contraseñas no coinciden' : true;
};

/**
 * Submit del formulario
 */
const formSubmit = async datos => {
  try {
    const res = await apiAuth.actuarRDC(
      authStore.cookie.rdcToken,
      password.value
    );
  } catch (err) {
    errFailback(err);
    return;
  }
  emits('go', 'rdc4');
};
</script>
