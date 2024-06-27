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
        @update="(v) => (correo.valor = v)"
        :errorMessage="correo.error"
        :rules="[useRules.requerido(), useRules.correo()]"
        icono="email"
        dense
        clearable
      />
      <div class="mt-1 w-full text-center">
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
import { useAuth } from '~/modulos/main/API/useAuth';

const correo = reactiveInput();

/**
 * Submit del formulario
 */
const formSubmit = async (datos) => {
  try {
    const res = await useAuth.pedirRDC(correo.valor);
  } catch (e) {
    if (e === 'B106') {
      correo.error = 'Email desconocido';
    } else {
      NotifyError(`Error no tratado: ${e}`);
    }
    return false;
  }
  emits('go', 'rdc2');
};
</script>
