<template>
  <div class="w-full">
    <div class="w-full text-center mt-2">
      <q-avatar color="green" round>
        <q-icon name="person" color="white" size="lg" />
      </q-avatar>
      <div class="mt-2 mb-2">Registro de nuevo usuario</div>
    </div>

    <q-input
      v-model="nombreInput"
      type="text"
      label="Nombre"
      ref="nombreInputRef"
      :rules="[useRules.req()]"
      :error="nombreInputErr !== null"
      outlined
      dense
      clearable
    >
      <template #error>
        <div>{{ nombreInputErr }}</div>
      </template>
    </q-input>

    <q-input
      v-model="apellidoInput"
      type="text"
      label="Apellido"
      ref="apellidoInputRef"
      :rules="[useRules.req()]"
      :error="apellidoInputErr !== null"
      outlined
      dense
      clearable
    >
      <template #error>
        <div>{{ apellidoInputErr }}</div>
      </template>
    </q-input>

    <q-input
      v-model="correoInput"
      type="text"
      label="Correo electrónico"
      ref="correoInputRef"
      :rules="[useRules.req()]"
      :error="correoInputErr !== null"
      outlined
      dense
      clearable
    >
      <template #error>
        <div>{{ correoInputErr }}</div>
      </template>
    </q-input>

    <q-input
      v-model="telefonoInput"
      type="text"
      label="Teléfono"
      ref="telefonoInputRef"
      :rules="[useRules.req()]"
      :error="telefonoInputErr !== null"
      outlined
      dense
      clearable
    >
      <template #error>
        <div>{{ telefonoInputErr }}</div>
      </template>
    </q-input>

    <q-input
      v-model="pwd1Input"
      type="password"
      label="Contraseña"
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
      <q-btn
        no-caps
        label="Confirmar"
        @click="submitRegistro"
        color="primary"
      />
    </div>

    <div class="w-full text-center">
      <q-btn label="volver" @click="emits('go', 'login')" dense flat no-caps />
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits(['go']);
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';
const authStore = useAuthStore();
const router = useRouter();

const nombreInput = ref('');
const nombreInputRef = ref(null);
const nombreInputErr = ref(null);

const apellidoInput = ref('');
const apellidoInputRef = ref(null);
const apellidoInputErr = ref(null);

const telefonoInput = ref('');
const telefonoInputRef = ref(null);
const telefonoInputErr = ref(null);

const correoInput = ref('');
const correoInputRef = ref(null);
const correoInputErr = ref(null);

const pwd1Input = ref('');
const pwd1InputRef = ref(null);
const pwd1InputErr = ref(null);

const pwd2Input = ref('');
const pwd2InputRef = ref(null);
const pwd2InputErr = ref(null);

const submitRegistro = async () => {
  // gestion de errores del formulario
  resetErrores(
    nombreInputErr,
    apellidoInputErr,
    telefonoInputErr,
    correoInputErr,
    pwd1InputErr,
    pwd2InputErr,
  );
  if (
    !validarInputs(
      nombreInputRef,
      apellidoInputRef,
      telefonoInputRef,
      correoInputRef,
      pwd1InputRef,
      pwd2InputRef,
    )
  ) {
    return false;
  }
  if (pwd1Input.value !== pwd2Input.value) {
    pwd2InputErr.value = 'Ambas contraseñas deben coindicir';
    return false;
  }

  // llamada a la api
  try {
    const persona = await useAuth.registrar({
      nombre: nombreInput.value,
      apellido: apellidoInput.value,
      correo: correoInput.value,
      telefono: telefonoInput.value,
      contrasena: pwd1Input.value,
    });
    authStore.cookie.registrado = persona;
  } catch (e) {
    NotifyError(`Error no tratado: ${e}`);
    return false;
  }

  // cambiar a la seccion siguiente
  emits('go', 'registro2');
};
</script>
