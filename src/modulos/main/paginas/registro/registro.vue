<template>
  <div
    class="flex flex-col justify-center items-center h-[100vh] max-sm:h-[92vh]"
  >
    <img
      class="w-80 max-sm:w-[300px] border-2"
      style="width: 320px"
      :src="Logo"
      alt="prueba"
    />
    <formularioLogin title-btn="Registrarse" register :submit="register">
      <template #inputs>
        <q-input
          v-model="persona.nombre"
          type="text"
          label="Nombre"
          outlined
          dense
          :rules="[useRules.requerido]"
        />
        <q-input
          v-model="persona.apellido"
          type="text"
          label="apellido"
          outlined
          dense
        />
        <q-input
          v-model="persona.telefono"
          type="text"
          label="Telefono"
          outlined
          dense
          :rules="[useRules.phone]"
        />
        <q-input
          v-model="persona.correo"
          type="email"
          label="Corre electronico"
          outlined
          dense
        />
        <q-input
          v-model="persona.contrasena"
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
import Logo from "@/assets/img/logo.png";
import formularioLogin from "@/modulos/main/componientes/formularioLogin.vue";
import second from "first";

definePageMeta({
  layout: false,
});

const router = useRouter();

const persona = reactive({
  nombre: "",
  apellido: "",
  telefono: 0,
  correo: "",
  contrasena: "",
});

async function register() {
  const nuevaPersona = await authService.registrar(persona);
  if (nuevaPersona) {
    NotifySucess(`${nuevaPersona.nombre} se ha registrado correctamente`);
    router.push("/");
  }
}
</script>

<style lang="scss" scoped></style>
