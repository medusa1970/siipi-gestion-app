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
          type="password"
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
          v-for="negocio in user.negocios"
          :key="negocio.nombre"
          @click="elegirNegocio(negocio)"
          :class="[
            'w-52 hover:opacity-90 border-4 rounded-none',
            negocio.tipo === 'SEDE' && 'border-blue-500',
            negocio.tipo === 'MARCA' && 'border-orange-500',
            negocio.tipo === 'PUNTO' && 'border-green-500',
            negocio.tipo === 'CATHERING' && 'border-green-500',
            negocio.tipo === 'CLIENTE' && 'border-white',
          ]"
        >
          <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
            <div class="absolute-bottom text-center font-bold bg-red-500">
              <h1 class="">
                {{ negocio.nombre }}
              </h1>
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
  middleware: ['auth'],
});
import { password } from '@/helpers/validate.form';
import { useAuth } from '@/composables/auth/useAuth';
const { authPersona, login, elegirNegocio, user } = useAuth();
</script>
