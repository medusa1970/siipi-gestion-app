<template>
  <pre>medida empaques</pre>
</template>

<script setup lang="ts">
import { useMedidaEmpaques } from "./medidaEmpaques.composable";
import { useRouter } from "vue-router";
const { estado, authStore, store, router } = useMedidaEmpaques();
</script>
