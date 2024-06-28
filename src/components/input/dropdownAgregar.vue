<template>
  <q-form @submit="formSubmit">
    <input-text label="Nombre" @update="(v) => (nombre.value = v)" />
    <q-btn label="Crear" type="submit" />
  </q-form>
</template>

<script setup lang="ts">
import type { DropdownOpcion } from './dropdown.interface';

/**
 * emits
 */

const emits = defineEmits<{
  (
    // se hizo el update de la lista de opciones
    event: 'update:opciones',
    opciones: Array<DropdownOpcion>,
    posicion: Number,
  ): void;
}>();

/**
 * props
 */

const props = defineProps({
  opciones: Array, // debe pasarlo el dropdown que llamó al componiente
});

/**
 * refs, reactives y computed
 */

const nombre = reactiveInput(''); // input nombre

/**
 * metodos
 */

// metodo submit del formulario
const formSubmit = async (datos: any) => {
  if (!props.opciones) {
    throw 'prop opciones obligatoria';
  }

  // nueva opcion para la lista
  const nuevaOpcion = {
    label: nombre.value,
    value: nombre.value,
    disable: false,
  } as DropdownOpcion;

  // logica para insertar la nueva opcion en la lista
  const opciones = props.opciones as DropdownOpcion[];
  const posicion = opciones.length;
  opciones.splice(posicion, 0, nuevaOpcion);
  emits('update:opciones', opciones, posicion);
};
</script>
