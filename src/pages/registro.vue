<template>
  <div
    class="flex flex-col justify-center items-center h-[100vh] max-sm:h-[92vh]"
  >
    <img class="w-80 max-sm:w-[300px]" :src="Logo" alt="prueba" />
    <Formulario title-btn="Registrarse" register :submit="register">
      <template #inputs>
        <q-input
          v-model="authPersona.nombre"
          type="text"
          label="Nombre"
          outlined
          dense
          :rules="[string]"
        />
        <q-input
          v-model="authPersona.apellido"
          type="text"
          label="apellido"
          outlined
          dense
        />
        <q-input
          v-model="authPersona.telefono"
          type="text"
          label="Telefono"
          outlined
          dense
          :rules="[phone]"
        />
        <q-input
          v-model="authPersona.correo"
          type="email"
          label="Corre electronico"
          outlined
          dense
        />
        <q-input
          v-model="authPersona.contrasena"
          type="text"
          label="Contraseña"
          outlined
          dense
          :rules="[password]"
        />
      </template>
    </Formulario>
  </div>
</template>

<script setup lang="ts">
import Logo from '@/assets/img/logo.png';
definePageMeta({
  layout: false,
});
import { password, phone, string } from '@/helpers/validate.form';
import { useAuth } from '@/composables/auth/useAuth';

const { authPersona, register } = useAuth();
</script>

<style lang="scss" scoped></style>
