<template>
  <q-form @submit="composable.formSubmit">
    <div v-for="(permiso, index) in composable.estado.dataForm">
      <div class="flex justify-between">
        <q-toggle
          v-model="composable.estado.dataForm[index].estado"
          color="green"
        >
          {{ permiso.permiso }}
          <span
            v-if="
              composable.estado.dataForm[index].vencimiento &&
              new Date(composable.estado.dataForm[index].vencimiento) <
                new Date()
            "
            class="text-red-500"
            >- VENCIDO</span
          >
        </q-toggle>
        <input-text
          v-if="composable.estado.dataForm[index].estado"
          label="Vencimiento"
          labelAdentro
          noSlot
          :porDefecto="composable.estado.dataForm[index].vencimiento"
          @update="(v) => (composable.estado.dataForm[index].vencimiento = v)"
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
const composable = useEmpleadoPermisos();
</script>
