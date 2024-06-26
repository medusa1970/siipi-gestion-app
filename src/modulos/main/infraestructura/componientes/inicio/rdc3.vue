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
        type="password"
        label="Contraseña"
        @update="(v) => (password = v)"
        :rules="[useRules.req(), useRules.password]"
        icono="key"
        dense
        class="mt-2"
        clearable
      />
      <input-text
        type="password"
        label="Repetir"
        @update="(v) => (password2 = v)"
        :rules="[password2Rule]"
        icono="key"
        dense
        class="mt-2"
        clearable
      />
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
import { useAuth } from '~/modulos/main/API/useAuth';
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';
const authStore = useAuthStore();

const password = ref('');
const password2 = ref('');
const password2Rule = (p) => {
  return p !== password.value ? 'Las contraseñas no coinciden' : true;
};
const submit = async () => {
  try {
    await useAuth.actuarRDC(authStore.cookie.rdcToken, password.value);
  } catch (e) {
    NotifyError(`Error no tratado: ${e}`);
    return false;
  }
  emits('go', 'rdc4');
};
</script>
