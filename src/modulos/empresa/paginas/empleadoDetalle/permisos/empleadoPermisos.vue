<template>
  <q-form @submit="formSubmit">
    <div v-for="(permiso, index) in estado.dataForm">
      <div class="flex justify-between">
        <q-toggle v-model="estado.dataForm[index].estado" color="green">
          {{ permiso.permiso }}
          <span
            v-if="
              estado.dataForm[index].vencimiento &&
              new Date(estado.dataForm[index].vencimiento) < new Date()
            "
            class="text-red-500"
            >- VENCIDO</span
          >
        </q-toggle>
        <input-text
          v-if="estado.dataForm[index].estado"
          label="Vencimiento"
          labelAdentro
          noSlot
          :porDefecto="estado.dataForm[index].vencimiento"
          @update="(v) => (estado.dataForm[index].vencimiento = v)"
        />
      </div>
    </div>

    <!-- Submit -->
    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { useEmpleadoPermisos } from "./empleadoPermisos.composable";
const { estado, authStore, store, router, formSubmit } = useEmpleadoPermisos();
</script>
