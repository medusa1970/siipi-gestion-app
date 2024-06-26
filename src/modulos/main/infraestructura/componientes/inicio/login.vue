<template>
  <div class="w-full">
    <div class="w-full text-center mt-2">
      <q-avatar color="green" round>
        <q-icon name="login" color="white" size="md" />
      </q-avatar>
      <div class="mt-2 mb-2">Login SIIPIGES</div>
    </div>

    <q-form @submit="submit">
      <input-text
        label="Usuario"
        @update="(v) => (usuario = v)"
        :rules="[useRules.req('El usuario es obligatorio')]"
        icono="person"
        dense
        class="mt-2"
        clearable
        :errorMessage="usuarioErr"
      />
      <input-text
        type="password"
        label="Contraseña"
        @update="(v) => (password = v)"
        :rules="[useRules.req()]"
        icono="key"
        dense
        class="mt-2"
        clearable
        :errorMessage="passwordErr"
      />
      <div class="mt-1 w-full text-center">
        <q-btn label="Iniciar sesión" type="submit" color="primary" no-caps />
      </div>
    </q-form>

    <div class="mt-2 w-full text-center">
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
</template>

<script setup>
const emits = defineEmits(['go']);
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';
const authStore = useAuthStore();

const usuario = ref('');
const usuarioErr = ref(null);
const password = ref('');
const passwordErr = ref(null);
const submit = async () => {
  try {
    await authStore.login(usuario.value, password.value);
  } catch (e) {
    if (e === 'B102') {
      usuarioErr.value = 'Usuario inexistente';
    } else if (e === 'B104') {
      passwordErr.value = 'Contraseña incorrecta';
    } else {
      NotifyError(`Error no tratado: ${e}`);
    }
    return false;
  }
};
</script>
