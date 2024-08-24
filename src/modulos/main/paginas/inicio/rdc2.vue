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
        labelAdentro
        @update="v => (codigo.value = v)"
        :error="codigo.error"
        requerido
        icono="key" />
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
import { useAuthStore } from '~/modulos/main/useAuthStore';
const authStore = useAuthStore();
const router = useRouter();

const codigo = reactiveInput();

/**
 * Submit del formulario
 */
const formSubmit = async datos => {
  let codigoOk = null;
  try {
    await buscarVarios(GqlAuthActuarRDC, { token: codigo.value });
  } catch (err) {
    errFailback(err);
    return;
  }

  if (codigoOk) {
    authStore.cookie.rdcToken = codigo.value;
    emits('go', 'rdc3');
  } else {
    codigo.error = 'token inválido';
  }
};
</script>
