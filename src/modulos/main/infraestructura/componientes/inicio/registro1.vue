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
        @update="(v) => (nombre.valor = v)"
        :rules="[useRules.requerido()]"
        class="mt-2"
        clearable
        dense
      />
      <input-text
        label="Apellido"
        @update="(v) => (apellido.valor = v)"
        :rules="[useRules.requerido()]"
        class="mt-2"
        clearable
        dense
      />
      <input-text
        label="Usuario"
        @update="(v) => (usuario.valor = v)"
        :errorMessage="usuario.error"
        :rules="[useRules.requerido()]"
        class="mt-2"
        clearable
        dense
      />
      <input-text
        label="Correo"
        @update="(v) => (correo.valor = v)"
        :errorMessage="correo.error"
        :rules="[useRules.requerido(), useRules.correo()]"
        class="mt-2"
        clearable
        dense
      />
      <input-text
        label="Telefono"
        @update="(v) => (telefono.valor = v)"
        :errorMessage="telefono.valor"
        :rules="[useRules.requerido(), useRules.telefono()]"
        class="mt-2"
        clearable
        dense
      />
      <input-text
        type="password"
        label="Contraseña"
        @update="(v) => (password.valor = v)"
        :rules="[useRules.requerido(), useRules.password]"
        icono="key"
        dense
        class="mt-2"
        clearable
      />
      <input-text
        type="password"
        label="Repetir"
        @update="(v) => (password2.valor = v)"
        :rules="[password2Rule]"
        icono="key"
        dense
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

const nombre = reactiveInput();
const apellido = reactiveInput();
const usuario = reactiveInput();
const correo = reactiveInput();
const telefono = reactiveInput();
const password = reactiveInput();
const password2 = reactiveInput();
const password2Rule = (p) =>
  p !== password.value ? 'Las contraseñas no coinciden' : true;

/**
 * Submit del formulario
 */
const submit = async () => {
  try {
    const persona = await useAuth.registrar({
      nombre: nombre.valor,
      apellido: apellido.valor,
      usuario: usuario.valor,
      correo: correo.valor,
      telefono: telefono.valor,
      contrasena: password.valor,
    });
    authStore.cookie.registrado = persona;
  } catch (e) {
    if (e.substring(0, 4) === 'B204') {
      const dupkeys = e.substring(5).split(',');
      if (dupkeys.includes('correo')) {
        correo.error = 'Este email ya está registrado';
      }
      if (dupkeys.includes('telefono')) {
        telefono.error = 'Este telefono ya está registrado';
      }
      if (dupkeys.includes('usuario')) {
        usuario.error = 'Este usuario ya está registrado';
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
