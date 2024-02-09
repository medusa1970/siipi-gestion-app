<template>
  <div class="flex gap-6 flex-grow items-center justify-center mt-6">
    <section class="w-[600px]">
      <h1 class="font-bold text-gray-400">PERMISOS EMPLEADOS:</h1>
      <span class="flex gap-3 items-center">
        <span>
          <p class="font-semibold">Ver Empleados</p>
          <p>Descripcion...</p>
        </span>
        <q-toggle
          v-model="rol.ver"
          color="green-500"
          checked-icon="check"
          unchecked-icon="clear"
        />
      </span>
      <span class="flex gap-3 items-center">
        <span>
          <p class="font-semibold">Agregar Empleados</p>
          <p>Descripcion...</p>
        </span>
        <q-toggle
          v-model="rol.agregar"
          color="green-500"
          checked-icon="check"
          unchecked-icon="clear"
        />
      </span>
      <span class="flex gap-3 items-center">
        <span>
          <p class="font-semibold">Editar Empleados</p>
          <p>Descripcion...</p>
        </span>
        <q-toggle
          v-model="rol.editar"
          color="green-500"
          checked-icon="check"
          unchecked-icon="clear"
        />
      </span>
      <span class="flex gap-3 items-center">
        <p class="font-semibold">Asignar Roles</p>
        <q-toggle
          v-model="rol.darRol"
          color="green-500"
          checked-icon="check"
          unchecked-icon="clear"
        />
      </span>
    </section>
    <section class="w-[600px]">
      <h1 class="font-bold text-gray-400">PERMISOS PRODUCTOS:</h1>
      <span class="flex gap-3 items-center">
        <span>
          <p class="font-semibold">Ver Productos</p>
          <p>Descripcion...</p>
        </span>
        <q-toggle
          v-model="rol.ver"
          color="green-500"
          checked-icon="check"
          unchecked-icon="clear"
        />
      </span>
      <span class="flex gap-3 items-center">
        <span>
          <p class="font-semibold">Agregar Productos</p>
          <p>Descripcion...</p>
        </span>
        <q-toggle
          v-model="rol.agregar"
          color="green-500"
          checked-icon="check"
          unchecked-icon="clear"
        />
      </span>
      <span class="flex gap-3 items-center">
        <span>
          <p class="font-semibold">Editar Productos</p>
          <p>Descripcion...</p>
        </span>
        <q-toggle
          v-model="rol.editar"
          color="green-500"
          checked-icon="check"
          unchecked-icon="clear"
        />
      </span>
      <span class="flex gap-3 items-center">
        <p class="font-semibold">Eliminar Productos</p>
        <q-toggle
          v-model="rol.darRol"
          color="green-500"
          checked-icon="check"
          unchecked-icon="clear"
        />
      </span>
    </section>
    <section class="w-[600px]">
      <h1 class="font-bold text-gray-400">PERMISOS FINANZAS:</h1>
      <span class="flex gap-3 items-center">
        <span>
          <p class="font-semibold">Ver Empleados</p>
          <p>Descripcion...</p>
        </span>
        <q-toggle
          v-model="rol.ver"
          color="green-500"
          checked-icon="check"
          unchecked-icon="clear"
        />
      </span>
      <span class="flex gap-3 items-center">
        <span>
          <p class="font-semibold">Agregar Empleados</p>
          <p>Descripcion...</p>
        </span>
        <q-toggle
          v-model="rol.agregar"
          color="green-500"
          checked-icon="check"
          unchecked-icon="clear"
        />
      </span>
      <span class="flex gap-3 items-center">
        <span>
          <p class="font-semibold">Editar Empleados</p>
          <p>Descripcion...</p>
        </span>
        <q-toggle
          v-model="rol.editar"
          color="green-500"
          checked-icon="check"
          unchecked-icon="clear"
        />
      </span>
      <span class="flex gap-3 items-center">
        <p class="font-semibold">Asignar Roles</p>
        <q-toggle
          v-model="rol.darRol"
          color="green-500"
          checked-icon="check"
          unchecked-icon="clear"
        />
      </span>
    </section>
    <section class="w-[600px]">
      <h1 class="font-bold text-gray-400">PERMISOS AVANZADOS:</h1>
      <span class="flex gap-3 items-center">
        <span>
          <p class="font-semibold">Ver Productos</p>
          <p>Descripcion...</p>
        </span>
        <q-toggle
          v-model="rol.ver"
          color="green-500"
          checked-icon="check"
          unchecked-icon="clear"
        />
      </span>
      <span class="flex gap-3 items-center">
        <span>
          <p class="font-semibold">Agregar Productos</p>
          <p>Descripcion...</p>
        </span>
        <q-toggle
          v-model="rol.agregar"
          color="green-500"
          checked-icon="check"
          unchecked-icon="clear"
        />
      </span>
      <span class="flex gap-3 items-center">
        <span>
          <p class="font-semibold">Editar Productos</p>
          <p>Descripcion...</p>
        </span>
        <q-toggle
          v-model="rol.editar"
          color="green-500"
          checked-icon="check"
          unchecked-icon="clear"
        />
      </span>
      <span class="flex gap-3 items-center">
        <p class="font-semibold">Eliminar Productos</p>
        <q-toggle
          v-model="rol.darRol"
          color="green-500"
          checked-icon="check"
          unchecked-icon="clear"
        />
      </span>
    </section>
  </div>
  <div class="text-center mt-8">
    <q-btn color="primary" label="Guardar" no-caps />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const rol = ref<any>({});
definePageMeta({
  layout: 'sede',
});
</script>

<style scoped>
section span {
  justify-content: space-between;
}
</style>
