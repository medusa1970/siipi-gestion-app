<template>
  <div class="w-full">
    <div class="w-full text-center mt-2">
      <q-avatar color="green" round>
        <q-icon name="key" color="white" size="lg" />
      </q-avatar>
      <div class="mt-2 mb-2">Recupera tu contraseña (1/3)</div>
    </div>

    <q-input
      v-model="correoInput"
      type="email"
      label="Tu correo electronico"
      ref="correoInputRef"
      :rules="[useRules.req(), useRules.email()]"
      :error="correoInputErr !== null"
      outlined
    >
      <template #error>
        <div>{{ correoInputErr }}</div>
      </template>
    </q-input>

    <div class="w-full text-center">
      <q-btn
        label="Enviar codigo"
        @click="submitRdc1"
        color="primary"
        no-caps
      />
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

const correoInput = ref('');
const correoInputRef = ref(null);
const correoInputErr = ref(null);

const submitRdc1 = async () => {
  // gestion de errores del formulario
  resetErrores(correoInputErr);
  if (!validarInputs(correoInputRef)) return false;

  // llamada a la api
  try {
    const res = await useAuth.pedirRDC(correoInput.value);
  } catch (e) {
    if (e === 'B106') {
      correoInputErr.value = 'Email desconocido';
    } else {
      NotifyError(`Error no tratado: ${e}`);
    }
    return false;
  }

  // cambiar a la seccion siguiente
  emits('go', 'rdc2');
};
</script>
