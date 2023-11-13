<template>
  <div class="cont-center">
    <NuxtImg class="w-80" src="/img/logo.png" />
    <Formulario title-btn="Registrarse" register :submit="register">
      <template #inputs>
        <q-input
          v-model="persona.nombre"
          type="text"
          label="Nombre"
          outlined=""
          dense />
        <q-input
          v-model="persona.telefono"
          type="text"
          label="Telefono"
          outlined=""
          dense />
        <q-input
          v-model="persona.correo"
          type="text"
          label="Corre electronico"
          outlined=""
          dense />
        <q-input
          v-model="persona.contrasena"
          type="text"
          label="Contraseña"
          outlined=""
          dense />
      </template>
    </Formulario>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
});
import { ref } from 'vue';

const persona = ref({
  nombre: '',
  telefono: '',
  correo: '',
  contrasena: ''
});

const register = async () => {
  try {
    const res = await GqlCrearUna({ data: persona.value });
  } catch (err) {
    console.log(err);
  }
};
</script>

<style lang="scss" scoped></style>
