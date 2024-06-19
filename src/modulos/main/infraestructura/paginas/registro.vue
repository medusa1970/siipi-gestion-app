<template>
  <div
    class="flex flex-col justify-center items-center h-[100vh] max-sm:h-[92vh]"
  >
    <img class="w-80 max-sm:w-[300px]" :src="Logo" alt="prueba" />
    <formularioLogin title-btn="Registrarse" register :submit="register">
      <template #inputs>
        <q-input
          v-model="authPersona.nombre"
          type="text"
          label="Nombre"
          outlined
          dense
          :rules="[useRules.requerido]"
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
          :rules="[useRules.phone]"
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
          :rules="[useRules.password]"
        />
      </template>
    </formularioLogin>
  </div>
</template>

<script setup>
import Logo from '@/assets/img/logo.png';
import formularioLogin from '@/modulos/main/infraestructura/componientes/formularioLogin.vue';

definePageMeta({
  layout: false,
});

const register = async (datos) => {
  // const nuevaPersona = await registrar(datos);
  // NotifySucess(`${nuevaPersona.nombre} se ha registrado correctamente`);
};
</script>

<style lang="scss" scoped></style>
