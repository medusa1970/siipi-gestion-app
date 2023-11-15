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
          dense
          :rules="[string]"
        />
        <q-input
          v-model="persona.telefono"
          type="text"
          label="Telefono"
          outlined=""
          dense
          :rules="[phone]"
        />
        <q-input
          v-model="persona.correo"
          type="email"
          label="Corre electronico"
          outlined=""
          dense
        />
        <q-input
          v-model="persona.contrasena"
          type="text"
          label="Contraseña"
          outlined=""
          dense
          :rules="[password]"
        />
      </template>
    </Formulario>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
});
import { ref } from 'vue';
import { password, phone, string } from '@/helpers/validate.form';

const persona = ref({
  nombre: '',
  telefono: '',
  correo: '',
  contrasena: ''
});

const register = async () => {
  try {
    const res = await GqlCrearUna({ data: persona.value });
    console.log(res.crearUnaPersona);
  } catch (err) {
    console.log(err);
  }
};
</script>

<style lang="scss" scoped></style>
