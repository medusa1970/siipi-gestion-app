<template>
  <q-form @submit="formSubmit">
    <input-text
      label="Nombre"
      @update="(v) => (nombre.value = v)"
      :error="nombre.error"
      :rules="[useRules.requerido()]"
    />

    <input-select
      label="Categoria"
      :opciones="categoriasNivelUno"
      @update="(v) => (pariente.value = v)"
      :rules="[useRules.requerido()]"
    />

    <q-btn label="Crear" type="submit" />
  </q-form>
</template>

<script setup lang="ts">
/**
 * Imports
 */

import type { Categoria } from '#gql';
import type { CrearCategoriaDto } from '#gql';
import type { SelectOpcion } from '~/components/input/select.interface';
import { useProducto } from '~/modulos/productos/negocio/producto.composable';
const productoService = useProducto();

/**
 * Eventos
 */

const emits = defineEmits<{
  (
    event: 'update:opciones',
    objeto: Categoria, // el objeto que se creó
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
const pariente = reactiveInput('');
const categoriasNivelUno = ref([]);
onMounted(async () => {
  categoriasNivelUno.value = await productoService.categoriaSelectOptions(
    false,
  );
});

/**
 * Submit
 */

const formSubmit = async (datos: any) => {
  if (!props.opcionesPariente) {
    throw 'prop opcionesPariente obligatoria';
  }

  // agregamos la categoria
  let nuevaCategoria;
  try {
    nuevaCategoria = await productoService.crearCategoria({
      nombre: nombre.value,
      pariente: pariente.value,
    } as CrearCategoriaDto);
  } catch (e: any) {
    NotifyError(`Error no tratado: ${e}`);
    return false;
  }
  NotifySucess(`Categoria creada con éxito`);

  // la nueva opcion que insertaremos en la lista
  const nuevaOpcion = {
    label: nuevaCategoria.nombre,
    value: nuevaCategoria._id,
    disable: false,
    class: 'option',
  };

  // buscamos el index donde la insertaremos (antes de la categoria de nivel superior que sigue el pariente)
  const opt = clone(props.opcionesPariente);
  const indexPariente = categoriasNivelUno.value.findIndex(
    (c) => c.value === pariente.value,
  );
  const idSiguiente = categoriasNivelUno.value[indexPariente + 1]?.value;
  const index = idSiguiente
    ? opt.findIndex((o) => o.value === idSiguiente)
    : opt.length;

  // insertamos la opcion y devolvemos todo via evento
  opt.splice(index, 0, nuevaOpcion);
  emits('update:opciones', nuevaCategoria, opt, nuevaCategoria._id);
};
</script>
