<template>
  <div class="cont-center">
    <NuxtImg
      v-if="useAuth.user.nombre === ''"
      class="w-80"
      src="/img/logo.png"
    />
    <Formulario
      v-if="useAuth.user.nombre === ''"
      title-btn="Iniciar sesion"
      login
      :submit="login"
    >
      <template #inputs>
        <q-input
          v-model="loginPersona.usuario"
          type="email"
          label="Corre electronico"
          outlined=""
          dense
        />
        <q-input
          v-model="loginPersona.contrasena"
          type="text"
          label="Contraseña"
          outlined=""
          dense
          :rules="[password]"
        />
      </template>
    </Formulario>
    <div v-if="useAuth.user.nombre !== ''">
      <h1 class="font-bold text-xl text-center">
        Selecciona a que negocio ingresar
      </h1>
      <div class="flex gap-3 mt-2 cursor-pointer">
        <q-card
          class="w-52 hover:opacity-90"
          v-for="negocio in useAuth.user.negocios"
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
<script setup>
definePageMeta({
  layout: false
});
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authStore } from '@/stores/auth.store';
import { password } from '@/helpers/validate.form';

const useAuth = authStore();
const router = useRouter();
const loginPersona = ref({
  usuario: '',
  contrasena: ''
});
const login = async () => {
  await useAuth.login(loginPersona.value);
};
// const { buscarUnaPersona } = await GqlBuscarUna({ busqueda: {} });

const prueba = (negocio) => {
  useAuth.negocioSelected = negocio.nombre;
  router.push(negocio.tipo.toLowerCase());
};
// console.log(LocalStorage.getItem('token'));
</script>
