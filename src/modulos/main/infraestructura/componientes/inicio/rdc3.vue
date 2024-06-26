<template>
  <div class="w-full">
    <div class="w-full text-center mt-2">
      <q-avatar color="green" round>
        <q-icon name="key" color="white" size="lg" />
      </q-avatar>
      <div class="mt-2 mb-2">Recupera tu contraseña (3/3)</div>
    </div>

    <q-input
      v-model="pwd1Input"
      type="password"
      label="Tu nueva contraseña"
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
      <q-btn label="Confirmar" color="primary" @click="submitRdc3" no-caps />
    </div>

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
const router = useRouter();

const pwd1Input = ref('');
const pwd1InputRef = ref(null);
const pwd1InputErr = ref(null);

const pwd2Input = ref('');
const pwd2InputRef = ref(null);
const pwd2InputErr = ref(null);

const submitRdc3 = async () => {
  // gestion de errores del formulario
  resetErrores(pwd1InputErr, pwd2InputErr);
  if (!validarInputs(pwd1InputRef, pwd2InputRef)) return false;
  if (pwd1Input.value !== pwd2Input.value) {
    pwd2InputErr.value = 'Ambas contraseñas deben coindicir';
    return false;
  }

  // llamada a la api
  try {
    await useAuth.actuarRDC(authStore.cookie.rdcToken, pwd1Input.value);
  } catch (e) {
    NotifyError(`Error no tratado: ${e}`);
    return false;
  }

  // cambiar a la seccion siguiente
  emits('go', 'rdc4');
};
</script>
