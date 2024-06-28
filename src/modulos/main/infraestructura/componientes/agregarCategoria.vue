<template>
  <q-form @submit="formSubmit">
    <input-text
      label="Nombre"
      @update="(v) => (nombre.value = v)"
      :errorMessage="nombre.error"
      :rules="[useRules.requerido()]"
      dense
      clearable
    />

    <input-dropdown
      label="Categoria"
      :opciones="categoriasNivelUno"
      @update="(v) => (pariente.value = v)"
      :rules="[useRules.requerido()]"
      dense
      clearable
    />

    <q-btn label="Crear" type="submit" />
  </q-form>
</template>

<script setup lang="ts">
// definicion de los eventos emitibles
const emits = defineEmits(['update:opciones']);

// props
const props = defineProps({
  opciones: Array, // debe pasarlo el dropdown que llamó al componiente
});

// imports & composables
import type { CrearCategoriaDto } from '#gql';
import { useProducto } from '~/modulos/productos/negocio/producto.composable';
const productoService = useProducto();

// recuperacion de todas las opciones de nivel uno
// @ts-ignore
const categoriasNivelUno = await productoService.categoriaSelectOptions1nivel();

// reactives
const nombre = reactiveInput(''); // input nombre
const pariente = reactiveInput(''); // input pariente
const parienteOpciones = ref(categoriasNivelUno); // opciones para el input pariente

// metodo submit del formulario
const formSubmit = async (datos: any) => {
  if (!props.opciones) {
    throw 'prop opciones obligatoria';
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
  };

  // buscamos el index donde la insertaremos (antes de la categoria de nivel superior que sigue el pariente)
  const opciones = props.opciones;
  const indexPariente = categoriasNivelUno.findIndex(
    (c) => c.value === pariente.value,
  );
  const idSiguiente = categoriasNivelUno[indexPariente + 1]?.value;
  const index = idSiguiente
    ? // @ts-ignore
      opciones.findIndex((o) => o.value === idSiguiente)
    : opciones.length;

  // insertamos la opcion y devolvemos todo via evento
  opciones.splice(index, 0, nuevaOpcion);
  emits('update:opciones', opciones, index, nuevaCategoria);
};
</script>
