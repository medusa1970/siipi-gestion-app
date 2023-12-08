<template>
  <div class="cont-center">
    <NuxtImg v-if="user.nombre === ''" class="w-80" src="/img/logo.png" />
    <Formulario
      v-if="user.nombre === ''"
      title-btn="Iniciar sesion"
      login
      :submit="login"
    >
      <template #inputs>
        <q-input
          v-model="authPersona.usuario"
          type="text"
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
    <div v-if="user.nombre !== '' && user.negocios.length !== 0">
      <h1 class="font-bold text-xl text-center">
        Selecciona a que negocio ingresar
      </h1>
      <div class="flex gap-3 mt-2 cursor-pointer">
        <q-card
          class="w-52 hover:opacity-90"
          v-for="negocio in user.negocios"
          @click="prueba(negocio)"
        >
          <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
            <div class="absolute-bottom text-center font-bold">
              {{ negocio.nombre }}
            </div>
          </q-img>
        </q-card>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: ['auth']
});
import { password } from '@/helpers/validate.form';
import { useAuth } from '@/composables/auth/useAuth';
const { authPersona, login, prueba, user } = useAuth();
</script>
