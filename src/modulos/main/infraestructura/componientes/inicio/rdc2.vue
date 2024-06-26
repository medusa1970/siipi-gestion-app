<template>
  <div class="w-full">
    <div class="w-full text-center mt-2">
      <q-avatar color="green" round>
        <q-icon name="key" color="white" size="lg" />
      </q-avatar>
      <div class="mt-2 mb-2">Recupera tu contraseña (2/3)</div>
    </div>

    <q-input
      v-model="rdcTokenInput"
      type="text"
      label="El código recibido por mail"
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

    <div class="w-full text-center">
      <q-btn
        no-caps
        label="siguiente"
        color="primary"
        @click="submitRdc2"
      ></q-btn>
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

const rdcTokenInput = ref('');
const rdcTokenInputRef = ref(null);
const rdcTokenInputErr = ref(null);

const submitRdc2 = async () => {
  // gestion de errores del formulario
  resetErrores(rdcTokenInputErr);
  if (!validarInputs(rdcTokenInputRef)) return false;

  // llamada a la api
  let codigoOk = null;
  try {
    codigoOk = await useAuth.actuarRDC(rdcTokenInput.value);
  } catch (e) {
    NotifyError(`Error no tratado: ${e}`);
    return false;
  }

  // cambiar a la seccion siguiente
  if (codigoOk) {
    authStore.cookie.rdcToken = rdcTokenInput.value;
    emits('go', 'rdc3');
  } else {
    rdcTokenInputErr.value = 'token inválido';
  }
};
</script>
