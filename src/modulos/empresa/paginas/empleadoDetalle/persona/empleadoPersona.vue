<template>
  <p>
    <b>Nombre:</b> {{ store.empleado?.persona.nombre }}
    {{ store.empleado?.persona.nombre }}
  </p>
  <p><b>Cargo:</b> {{ store.empleado?.cargos[0].nombre }}</p>
  <p><b>Usario:</b> {{ store.empleado?.persona.usuario }}</p>
  <p>
    <b>Fecha de registracion:</b>
    {{ fechaMes(store.empleado?.persona._creado) }}
  </p>
  <p><b>Telefono:</b> {{ store.empleado?.persona.telefono }}</p>
  <p><b>Email:</b> {{ store.empleado?.persona.correo }}</p>
  <p>
    <b>imagen:</b>
    <br />
    <q-img
      :src="store.empleado?.persona.imagen?.cloudinaryUrl ?? EmpleadoImage"
      width="100px"
      height="100px"
      fit="contain"
      spinner-color="black" />
  </p>
</template>

<script setup lang="ts">
import EmpleadoImage from '@/assets/img/noHayEmpleado.png';
import { useEmpleadoPersona } from './empleadoPersona';
const { estado, authStore, store, router } = useEmpleadoPersona();
</script>
