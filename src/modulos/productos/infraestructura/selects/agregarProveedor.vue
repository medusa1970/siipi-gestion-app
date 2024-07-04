<template>
  <q-form @submit="formSubmit">
    <input-text
      label="Nombre"
      @update="(v) => (nombre.value = v)"
      :error="nombre.error"
      :rules="[useRules.requerido()]"
    />

    <input-text
      label="Descripcion"
      @update="(v) => (descripcion.value = v)"
      :error="descripcion.error"
      :rules="[useRules.requerido()]"
    />

    <q-btn label="Crear" type="submit" />
  </q-form>
</template>

<script setup lang="ts">
/**
 * Imports
 */

import { productoService } from '~/modulos/productos/API/productoService';
import type { CrearEntidadDto } from '#gql';
import type { Entidad } from '#gql';
import type { SelectOpcion } from '~/components/input/select.interface';
import { useProducto } from '~/modulos/productos/negocio/producto.composable';

/**
 * Eventos
 */

const emits = defineEmits<{
  (
    event: 'update:opciones',
    objeto: Entidad, // el objeto que se creó
    opciones: SelectOpcion[], // la lista de opciones puesta al día con ello
    value: String, // el valor del elemento a seleccionar (generalmente id del objeto)
  ): void;
}>();

/**
 * Props
 */

const props = withDefaults(
  defineProps<{
    opcionesPariente: SelectOpcion[];
  }>(),
  {},
);

/**
 * Inicializaciones
 */

const nombre = reactiveInput('');
const descripcion = reactiveInput('');
onMounted(async () => {});

/**
 * Submit
 */

const formSubmit = async (datos: any) => {
  if (!props.opcionesPariente) {
    throw 'prop opcionesPariente obligatoria';
  }

  // agregamos la categoria
  let nuevaEntidad;
  try {
    nuevaEntidad = await productoService.crearEntidadProveedor({
      nombre: nombre.value,
      descripcion: descripcion.value,
      tipo: 'PROVEEDOR',
    } as CrearEntidadDto);
  } catch (e: any) {
    NotifyError(`Error no tratado: ${e}`);
    return false;
  }
  NotifySucess(`Proveedor creado con éxito`);

  // la nueva opcion que insertaremos en la lista
  const nuevaOpcion = {
    label: nuevaEntidad.nombre,
    value: nuevaEntidad._id,
    disable: false,
    class: 'option',
  };

  // insertamos en las opciones
  const opt = clone(props.opcionesPariente);
  opt.push(nuevaOpcion);
  console.log(nuevaEntidad, opt, nuevaEntidad._id);
  emits('update:opciones', nuevaEntidad, opt, nuevaEntidad._id);
};
</script>
