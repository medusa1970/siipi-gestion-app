<template>
  <div class="w-full">
    <div class="w-full text-center mt-2">
      <q-avatar color="green" round>
        <q-icon name="key" color="white" size="lg" />
      </q-avatar>
      <div class="mt-2 mb-2">Recupera tu contraseña (2/3)</div>
    </div>

    <q-form @submit="submit">
      <input-text
        label="Código recibido por mail"
        @update="(v) => (codigo = v)"
        :rules="[useRules.req()]"
        icono="key"
        dense
        class="mt-2"
        clearable
        :errorMessage="codigoErr"
      />
      <div class="mt-1 w-full text-center">
        <q-btn no-caps label="siguiente" color="primary" type="submit"></q-btn>
      </div>
    </q-form>

    <div class="mt-1 w-full text-center">
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

const codigo = ref('');
const codigoErr = ref(null);
const submit = async () => {
  let codigoOk = null;
  try {
    codigoOk = await useAuth.actuarRDC(codigo.value);
  } catch (e) {
    NotifyError(`Error no tratado: ${e}`);
    return false;
  }
  if (codigoOk) {
    authStore.cookie.rdcToken = codigo.value;
    emits('go', 'rdc3');
  } else {
    codigoErr.value = 'token inválido';
  }
};
</script>
