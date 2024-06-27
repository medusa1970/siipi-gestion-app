<template>
  <div class="w-full">
    <div class="w-full text-center mt-2">
      <q-avatar color="green" round>
        <q-icon name="key" color="white" size="lg" />
      </q-avatar>
      <div class="mt-2 mb-2">Recupera tu contraseña (2/3)</div>
    </div>

    <q-form @submit="formSubmit">
      <input-text
        label="Código recibido por mail"
        @update="(v) => (codigo.valor = v)"
        :errorMessage="codigo.error"
        :rules="[useRules.requerido()]"
        icono="key"
        dense
        clearable
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

const codigo = reactiveInput();

/**
 * Submit del formulario
 */
const formSubmit = async (datos) => {
  let codigoOk = null;
  try {
    codigoOk = await useAuth.actuarRDC(codigo.valor);
  } catch (e) {
    NotifyError(`Error no tratado: ${e}`);
    return false;
  }
  if (codigoOk) {
    authStore.cookie.rdcToken = codigo.valor;
    emits('go', 'rdc3');
  } else {
    codigo.error = 'token inválido';
  }
};
</script>
