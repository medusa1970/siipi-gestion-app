<template>
  <q-form @submit="formSubmit">
    <input-text
      label="Nombre"
      @update="(v) => (nombre.value = v)"
      :error="nombre.error"
      :rules="[useRules.requerido()]"
    />
    <q-btn label="Crear" type="submit" />
  </q-form>
</template>

<script setup lang="ts">
import type { CrearMarcaDto } from '#gql';
import type { SelectOpcion } from '~/components/input/select.interface';
import { productoService } from '../../API/productoService';
import type { Marca } from '#gql';

/**
 * Eventos
 */

const emits = defineEmits<{
  (
    event: 'update:opciones',
    objeto: Marca, // el objeto que se creó
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

const nombre = reactiveInput(null as String);

/**
 * Submit
 */

const formSubmit = async (datos: any) => {
  if (!props.opcionesPariente) {
    throw 'prop opcionesPariente obligatoria';
  }

  // agregamos la categoria
  let nuevaMarca;
  try {
    nuevaMarca = await productoService.crearMarca({
      nombre: nombre.value,
    } as CrearMarcaDto);
  } catch (e: any) {
    NotifyError(`Error no tratado: ${e}`);
    return false;
  }
  NotifySucess(`Marca creada con éxito!`);

  // la nueva opcion que insertaremos en la lista
  const nuevaOpcion = {
    label: nuevaMarca.nombre,
    value: nuevaMarca._id,
    disable: false,
  };
  // insertamos en las opciones y emitimos las nuevas opciones
  const opt = clone(props.opcionesPariente);
  let index = 0;
  if (opt.length > 0) {
    while (
      opt[index] &&
      opt[index].label.toLowerCase() < nuevaMarca.nombre.toLowerCase()
    ) {
      index++;
    }
  }
  opt.splice(index, 0, nuevaOpcion);
  emits('update:opciones', nuevaMarca, opt, nuevaMarca._id);
};
</script>
