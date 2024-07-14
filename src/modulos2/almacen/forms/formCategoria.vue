<template>
  <q-form @submit="formSubmit">
    <!-- nombre -->
    <input-text
      label="Nombre"
      :porDefecto="estado.dataForm.nombre"
      @update="(v) => (estado.dataForm.nombre = v)"
      :rules="[useRules.requerido()]"
      :error="estado.errorNombre"
    />

    <!-- Categoria -->
    <input-select
      label="Categoria pariente"
      :opciones="estado.parienteOpciones"
      info="La categoría existe solamente a fines de ubicar facilmente el producto en administracion. Para crear una nueva categoria, vaya al menu Logistica > Categorías."
      :porDefecto="estado.dataForm.pariente"
      @update="(v) => (estado.dataForm.pariente = v)"
      :rules="[useRules.requerido()]"
    />

    <q-btn :label="edicion != null ? 'Guardar' : 'Crear'" type="submit" />
  </q-form>
</template>

<script setup lang="ts">
import type { Categoria } from '#gql';
import { useAlmacen } from '~/modulos2/almacen/almacen.composable';
import type { CategoriaSelectOpcion } from '../almacen.interface';
import type { selectOpcionCallback } from '~/components/input/select.interface';
const { categoriaSelectOptions } = useAlmacen();

// definicion de los emits
const emits = defineEmits<{
  (event: 'crear:categoria', categoria: Categoria): void;
  (event: 'modificar:categoria', categoria: Categoria): void;
  (
    event: 'crear:opcion',
    valor: string,
    objeto: any,
    callback: selectOpcionCallback,
  ): void;
}>();

// definicion de los props
const props = withDefaults(
  defineProps<{
    edicion: Categoria | null; // edicion si null, sino creacion
  }>(),
  {
    edicion: null,
  },
);

// datos por defecto del formulario
const initForm = {
  nombre: props.edicion?.nombre ?? '',
  pariente: props.edicion?.pariente?._id ?? '',
};

// definicion del estado
const estado = reactive({
  // valor de los inputs
  dataForm: clone(initForm),
  //mensajes de error del formulario
  errorNombre: '',
  // opciones para el select de categoria pariente
  parienteOpciones: [] as CategoriaSelectOpcion[],
});

// Inicializaciones
onMounted(async () => {
  estado.parienteOpciones = await categoriaSelectOptions(false);
});

// submision del formulario
const formSubmit = async () => {
  try {
    // Modo edicion
    if (props.edicion) {
      // lanzamos la consulta
      const categoria = await api.modificarCategoria(
        props.edicion._id,
        estado.dataForm,
      );
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);
      // mandamos el resultado al componiente pariente
      emits('modificar:categoria', categoria);
    }
    // Modo creacion
    else {
      // lanzamos la consulta
      const categoria = await api.crearCategoria(estado.dataForm);
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);
      // mandamos el resultado al componiente pariente
      emits('crear:categoria', categoria);
      // ... y especialmente para el input select para insertar la nueva opcion
      emits(
        'crear:opcion',
        categoria._id,
        categoria,
        (listaOpciones: CategoriaSelectOpcion[]) => {
          const opcion: CategoriaSelectOpcion = {
            label: categoria.nombre,
            value: categoria._id,
            class: 'opcion',
          };

          // tenemos que insertar la nueva opcion debajo del pariente correcto, no al final
          const categoriasNivel1 = listaOpciones.filter(
            (opcion) => opcion.class === 'titulo',
          );
          const indexPariente = categoriasNivel1.findIndex(
            (c) => c.value === categoria.pariente._id,
          );
          const parienteSiguiente = categoriasNivel1[indexPariente + 1]?.value;
          console.log(categoriasNivel1);
          const index = parienteSiguiente
            ? listaOpciones.findIndex((o) => o.value === parienteSiguiente)
            : listaOpciones.length;
          listaOpciones.splice(index, 0, opcion);
          return listaOpciones;
        },
      );
    }
  } catch (err) {
    if (isApiBadRequest(err, 'duplicado')) {
      estado.errorNombre = 'Ya existe una categoria con este nombre';
      return;
    }
    errFallBack(err);
    return;
  }
};
</script>
