<template>
  <div class="w-full">
    <div class="w-full text-center mt-2">
      <q-avatar color="green" round>
        <q-icon name="key" color="white" size="lg" />
      </q-avatar>
      <div class="mt-2 mb-2">Recupera tu contraseña (1/3)</div>
    </div>

    <q-form @submit="formSubmit">
      <input-text
        label="Correo electronico"
        labelAdentro
        @update="v => (correo.value = v)"
        :error="correo.error"
        requerido
        :rules="[useRules.correo()]"
        icono="email" />
      <div class="w-full text-center">
        <q-btn label="Enviar codigo" type="submit" color="primary" no-caps />
      </div>
    </q-form>

    <div class="w-full text-center">
      <q-btn label="volver" @click="emits('go', 'login')" dense flat no-caps />
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits(['go']);
import { apiAuth } from '~/modulos/main/API/auth.api';

const correo = reactiveInput();

/**
 * Submit del formulario
 */
const formSubmit = async datos => {
  try {
    const res = await apiAuth.pedirRDC(correo.value);
  } catch (err) {
    if (isApiNotFound(err, 'correo')) {
      correo.error = 'Email desconocido';
    } else {
      errFailback(err);
    }
    return;
  }
  emits('go', 'rdc2');
};
</script>
