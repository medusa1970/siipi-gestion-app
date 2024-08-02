<template>
  <div></div>
</template>

<script setup lang="ts">
import { useAlmacen } from "~/modulos/almacen/almacen.composable";
const { store } = useAlmacen();
const { $socket } = useNuxtApp();
</script>

<style lang="scss" scoped></style>
