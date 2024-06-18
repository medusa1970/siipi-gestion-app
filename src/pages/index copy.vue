<template>
  <div class="flex flex-col justify-center items-center h-[100vh]">
    <div v-if="user.nombre === ''">
      <img class="w-80 max-sm:w-[300px]" :src="Logo" />
      <Formulario title-btn="Iniciar sesion" login :submit="login">
        <template #inputs>
          <q-input
            v-model="authPersona.usuario"
            type="text"
            label="Usuario"
            outlined
            dense
            clearable
          />
          <q-input
            v-model="authPersona.contrasena"
            label="Contraseña"
            outlined
            dense
            :rules="[useRules.password]"
            clearable
            :type="isPwd ? 'password' : password"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </template>
      </Formulario>
    </div>
    <div v-if="$q.platform.is.mobile">
      <div v-if="user.nombre !== '' && user.negocios.length !== 0" class="">
        <div class="flex gap-2 justify-center">
          <h1 class="font-bold text-xl text-center">
            Selecciona a que negocio ingresar
          </h1>
          <q-btn
            dense
            no-caps
            padding="0 10px"
            color="primary"
            label="Atras"
            @click="hacerAtras"
          />
        </div>
        <div
          class="flex gap-3 mt-2 cursor-pointer justify-center max-h-[65vh] min-h-max overflow-x-auto"
        >
          <q-card
            v-for="negocio in user.negocios"
            :key="negocio.nombre"
            @click="elegirNegocio(negocio)"
            :class="[
              'w-44 hover:opacity-90 border-4 rounded-none',
              negocio.tipo === 'SEDE' && 'border-blue-500',
              negocio.tipo === 'MARCA' && 'border-orange-500',
              negocio.tipo === 'PUNTO' && 'border-green-500',
              negocio.tipo === 'CATHERING' && 'border-green-500',
              negocio.tipo === 'CLIENTE' && 'border-white',
            ]"
          >
            <q-img
              src="https://cdn.quasar.dev/img/parallax2.jpg"
              class="w-full h-full"
            >
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
    <div v-else>
      <div v-if="user.nombre !== '' && user.negocios.length !== 0" class="">
        <div class="flex gap-2 justify-center">
          <h1 class="font-bold text-xl text-center">
            Selecciona a que negocio ingresar
          </h1>
          <q-btn
            dense
            no-caps
            padding="0 10px"
            color="primary"
            label="Atras"
            @click="hacerAtras"
          />
        </div>
        <div
          class="flex gap-3 mt-2 cursor-pointer justify-center max-h-[65vh] min-h-max overflow-x-auto"
        >
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
  </div>
</template>
<script setup>
import Logo from '@/assets/img/logo.png';
definePageMeta({
  layout: false,
  middleware: ['auth'],
});
import { LocalStorage } from 'quasar';

const hacerAtras = () => {
  authStore.user.nombre = '';
  authStore.user.negocios = [];
  authStore.token = '';
  authStore.negocioElegido = null;
  localStorage.clear();
  router.push('/');

  console.log('first');
};
</script>
