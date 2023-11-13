<template>
  <div class="cont-center">
    <NuxtImg v-if="!test" class="w-80" src="/img/logo.png" />
    <Formulario v-if="!test" title-btn="Iniciar sesion" login :submit="login">
      <template #inputs>
        <q-input
          v-model="loginPersona.usuario"
          type="text"
          label="Corre electronico"
          outlined=""
          dense />
        <q-input
          v-model="loginPersona.contrasena"
          type="text"
          label="Contraseña"
          outlined=""
          dense />
      </template>
    </Formulario>
    <h1 v-if="test" class="font-bold text-xl text-center">
      Seleccionar negocios
    </h1>
    <div v-if="test" class="flex gap-3 mt-2">
      <q-card class="w-52">
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
          <div class="absolute-bottom text-center font-bold">Negocio 1</div>
        </q-img>
      </q-card>
      <q-card class="w-52">
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
          <div class="absolute-bottom text-center font-bold">Negocio 2</div>
        </q-img>
      </q-card>
    </div>
  </div>
</template>
<script setup>
definePageMeta({
  layout: false
});

import { GqlConectar } from '#gql';
import { LocalStorage } from 'quasar';
import { ref } from 'vue';

const test = ref(false);
const loginPersona = ref({
  usuario: '',
  contrasena: ''
});

const login = async () => {
  try {
    const { conectar } = await GqlConectar({ data: loginPersona.value });
    LocalStorage.set('token', conectar.token);
    console.log(conectar);
  } catch (err) {
    console.log(err);
  }
};
</script>
