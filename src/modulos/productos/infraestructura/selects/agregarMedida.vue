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
/**
 * Imports
 */

import type { Medida } from '#gql';
import type { CrearMedidaDto } from '#gql';
import type { SelectOpcion } from '~/components/input/select.interface';
import { useProductoDetalle } from '~/modulos/productos/negocio/productoDetalle.composable';
const useProducto = useProductoDetalle();

/**
 * Eventos
 */

const emits = defineEmits<{
  (
    event: 'update:opciones',
    objeto: Medida, // el objeto que se creó
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
onMounted(async () => {});

/**
 * Submit
 */

const formSubmit = async (datos: any) => {
  if (!props.opcionesPariente) {
    throw 'prop opcionesPariente obligatoria';
  }

  // agregamos la categoria
  let nuevaMedida;
  try {
    nuevaMedida = await useProducto.crearMedida({
      nombre: nombre.value,
    } as CrearMedidaDto);
  } catch (e: any) {
    NotifyError(`Error no tratado: ${e}`);
    return false;
  }
  NotifySucess(`Medida creada con éxito`);

  // la nueva opcion que insertaremos en la lista
  const nuevaOpcion = {
    label: nuevaMedida.nombre,
    value: nuevaMedida._id,
    disable: false,
  };

  // buscamos el index donde la insertaremos (antes de la categoria de nivel superior que sigue el pariente)
  const opt = clone(props.opcionesPariente);
  opt.push(nuevaOpcion);
  emits('update:opciones', nuevaMedida, opt, nuevaMedida._id);
};
</script>
