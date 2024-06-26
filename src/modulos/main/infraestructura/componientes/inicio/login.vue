<template>
  <div class="w-full">
    <div class="w-full text-center mt-2">
      <q-avatar color="green" round>
        <q-icon name="login" color="white" size="md" />
      </q-avatar>
      <div class="mt-2 mb-2">Login SIIPIGES</div>
    </div>
    <q-input
      v-model="usuarioInput"
      type="text"
      label="Usuario"
      ref="usuarioInputRef"
      :rules="[useRules.req('El usuario es obligatorio')]"
      :error="usuarioInputErr !== null"
      outlined
      class="mt-2"
      clearable
    >
      <template #prepend>
        <q-icon name="person" />
      </template>
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
      clearable
      class="mt-2"
    >
      <template #prepend>
        <q-icon name="key" />
      </template>
      <template #error>
        <div>{{ pwdInputErr }}</div>
      </template>
    </q-input>

    <div class="mt-1 w-full text-center">
      <q-btn
        label="Iniciar sesión"
        @click="submitLogin"
        color="primary"
        no-caps
      />
    </div>

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

const usuarioInput = ref('');
const usuarioInputRef = ref(null);
const usuarioInputErr = ref(null);

const pwdInput = ref('');
const pwdInputRef = ref(null);
const pwdInputErr = ref(null);

const submitLogin = async () => {
  // gestion de errores del formulario
  resetErrores(usuarioInputErr, pwdInputErr);
  if (!validarInputs(usuarioInputRef, pwdInputRef)) return false;

  // llamada a la api
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
</script>
