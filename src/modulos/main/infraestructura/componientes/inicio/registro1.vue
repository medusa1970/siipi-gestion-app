<template>
  <div class="w-full">
    <div class="w-full text-center mt-2">
      <q-avatar color="green" round>
        <q-icon name="person" color="white" size="lg" />
      </q-avatar>
      <div class="mt-2 mb-2">Registro de nuevo usuario</div>
    </div>

    <q-form @submit="submit">
      <input-text
        label="Nombre"
        @update="(v) => (nombre = v)"
        :rules="[useRules.req()]"
        class="mt-2"
        clearable
        dense
        :default="nombre"
      />
      <input-text
        label="Apellido"
        @update="(v) => (apellido = v)"
        :rules="[useRules.req()]"
        class="mt-2"
        clearable
        :default="apellido"
        dense
      />
      <input-text
        label="Usuario"
        @update="(v) => (usuario = v)"
        :rules="[useRules.req()]"
        class="mt-2"
        clearable
        :default="usuario"
        :errorMessage="usuarioErr"
        dense
      />
      <input-text
        label="Correo"
        @update="(v) => (correo = v)"
        :rules="[useRules.req(), useRules.email]"
        class="mt-2"
        clearable
        :default="correo"
        :errorMessage="correoErr"
        dense
      />
      <input-text
        label="Telefono"
        @update="(v) => (telefono = v)"
        :rules="[useRules.req(), useRules.phone]"
        class="mt-2"
        :default="telefono"
        clearable
        :errorMessage="telefonoErr"
        dense
      />
      <input-text
        type="password"
        label="Contraseña"
        @update="(v) => (password = v)"
        :rules="[useRules.req(), useRules.password]"
        icono="key"
        dense
        :default="password"
        class="mt-2"
        clearable
      />
      <input-text
        type="password"
        label="Repetir"
        @update="(v) => (password2 = v)"
        :rules="[password2Rule]"
        icono="key"
        dense
        :default="password2"
        class="mt-2"
        clearable
      />
      <div class="mt-1 w-full text-center">
        <q-btn no-caps label="Confirmar" type="submit" color="primary" />
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

const nombre = ref('');
const apellido = ref('');
const usuario = ref('');
const usuarioErr = ref(null);
const correo = ref('');
const correoErr = ref(null);
const telefono = ref('');
const telefonoErr = ref(null);
const password = ref('');
const password2 = ref('');
const password2Rule = (p) => {
  return p !== password.value ? 'Las contraseñas no coinciden' : true;
};
const submit = async () => {
  try {
    const persona = await useAuth.registrar({
      nombre: nombre.value,
      apellido: apellido.value,
      usuario: usuario.value,
      correo: correo.value,
      telefono: telefono.value,
      contrasena: password.value,
    });
    console.log(persona);
    authStore.cookie.registrado = persona;
  } catch (e) {
    if (e.substring(0, 4) === 'B204') {
      const dupkeys = e.substring(5).split(',');
      if (dupkeys.includes('correo')) {
        correoErr.value = 'Este email ya está registrado';
      }
      if (dupkeys.includes('telefono')) {
        telefonoErr.value = 'Este telefono ya está registrado';
      }
      if (dupkeys.includes('usuario')) {
        usuarioErr.value = 'Este usuario ya está registrado';
      }
    } else {
      NotifyError(`Error no tratado: ${e}`);
    }
    return false;
  }

  // cambiar a la seccion siguiente
  emits('go', 'registro2');
};
</script>
