<template>
  <div class="cont-center">
    <h1 class="font-bold text-lg">¿OLVIDASTE TU CONTRASEÑA😮?</h1>
    <q-form class="w-80 flex flex-col gap-3 my-4" @submit="sendOTP">
      <q-input
        v-model="correo"
        type="email"
        label="Corre electronico"
        outlined
        dense />
      <q-btn label="Enviar codigo" type="submit" color="primary" no-caps />
    </q-form>
    <NuxtImg class="w-80" src="/img/logo.png" />
  </div>
  <!-- DIALOG -->
  <Dialog
    v-model="isOtp"
    title="Ingrese el codigo OTP"
    :handle-submit="actualizarContraseña">
    <template #inputsDialog>
      <div class="flex flex-col gap-3">
        <q-input
          v-model="otp"
          type="text"
          label="Ingrese el codigo OTP"
          outlined
          dense />
        <q-input
          v-model="contrasena"
          type="email"
          label="Nueva contraseña"
          outlined
          dense />
      </div>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import {
  ApiError,
  NotifyError,
  NotifySucess,
  hideLoading,
  showLoading
} from '@/helpers/message.service';
import { useRouter } from 'vue-router';
definePageMeta({
  layout: false
});

const router = useRouter();
const correo = ref('');
const otp = ref('');
const contrasena = ref('');
const isOtp = ref(true);

const sendOTP = async () => {
  try {
    showLoading();
    const { pedirReinicioDeContrasena: res } = await GqlPedirRDC({
      correo: correo.value
    });
    if (res) isOtp.value = true;
    NotifySucess('Se ha enviado un codigo a tu correo');
    hideLoading();
  } catch (error) {
    ApiError(error);
  }
};
const actualizarContraseña = async () => {
  try {
    showLoading();
    const { actuarReinicioDeContrasena: res } = await GqlActuarRDC({
      token: otp.value,
      contrasena: contrasena.value
    });
    if (res) {
      NotifySucess('Se ha actualizado tu contraseña');
      isOtp.value = false;
    }
    hideLoading();
    router.push('/');
  } catch (error) {
    ApiError(error);
  }
};
</script>
