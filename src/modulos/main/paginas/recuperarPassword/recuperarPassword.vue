<template>
  <div
    class="flex flex-col justify-center items-center h-[100vh] max-sm:h-[92vh]"
  >
    <h1 class="font-bold text-lg">¿OLVIDASTE TU CONTRASEÑA😮?</h1>
    <q-form
      class="w-80 max-sm:w-[300px] flex flex-col gap-3 my-4"
      @submit="sendOTP"
    >
      <q-input
        v-model="correo"
        type="email"
        label="Correo electronico"
        outlined
        dense
      />
      <q-btn label="Enviar codigo" type="submit" color="primary" no-caps />
    </q-form>
    <img class="w-80" :src="Logo" />
  </div>
  <!-- DIALOG -->
  <Dialog
    v-model="isOtp"
    title="Ingrese el codigo OTP"
    :handle-submit="actualizarContraseña"
  >
    <template #inputsDialog>
      <div class="flex flex-col gap-3">
        <q-input
          v-model="otp"
          type="text"
          label="Ingrese el codigo OTP"
          outlined
          dense
          required
        />
        <q-input
          v-model="contrasena"
          label="Nueva contraseña"
          outlined
          dense
          required
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
definePageMeta({
  layout: false,
});
import Logo from "@/assets/img/logo.png";
import { useAuth } from "~/modulos/main/API/useAuth";
import { useAuthStore } from "~/modulos/main/useAuthStore";

const router = useRouter();
const correo = ref("");
const otp = ref("");
const contrasena = ref("");
const isOtp = ref(false);

const sendOTP = async () => {
  try {
    showLoading();
    const res = await useAuth.pedirRDC(correo.value);
    if (res) isOtp.value = true;
    NotifySucess("Se ha enviado un codigo a tu correo");
    hideLoading();
  } catch (error) {
    ApiError(error);
  }
};
const actualizarContraseña = async () => {
  try {
    showLoading();
    const res = await useAuth.actuarRDC(otp.value, contrasena.value);
    if (res) {
      NotifySucess("Se ha actualizado tu contraseña");
      isOtp.value = false;
    }
    hideLoading();
    router.push("/");
  } catch (error) {
    ApiError(error);
  }
};
</script>
