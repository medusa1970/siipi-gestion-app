<template>
  <q-form class="w-80 flex flex-col gap-2" @submit="submit">
    <h1 class="font-bold text-2xl">{{ title }}</h1>
    <slot name="inputs"></slot>
    <span v-if="login">
      <a
        class="border-b-[1px] border-gray-500 text-gray-500"
        href="/recuperarPassword"
        >Recuperar mi contraseña</a
      >
    </span>
    <q-btn :label="titleBtn" type="submit" color="primary" no-caps />
    <span v-if="login | register" class="[&>*]:text-gray-500 flex gap-2">
      <p v-if="login">¿No tienes cuenta aún?</p>
      <p v-if="register">¿Ya tienes una cuenta?</p>
      <a
        v-if="login"
        class="border-b-[1px] border-gray-500 font-semibold"
        href="/registro"
        >Registrate aquí</a
      >
      <a
        v-if="register"
        class="border-b-[1px] border-gray-500 font-semibold"
        href="/"
        >Iniciar sesion</a
      >
    </span>
  </q-form>
</template>
<script setup>
defineProps({
  title: String,
  titleBtn: String,
  login: Boolean,
  register: Boolean,
  submit: Function
});
</script>
<style scoped></style>
