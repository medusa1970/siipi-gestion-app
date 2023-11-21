<template>
  <div class="cont-center">
    <NuxtImg class="w-80" src="/img/logo.png" />
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
definePageMeta({
  layout: false
});
import { password, phone, string } from '@/helpers/validate.form';
import { useAuth } from '@/composables/auth/useAuth';

const { authPersona, register } = useAuth();
</script>

<style lang="scss" scoped></style>
