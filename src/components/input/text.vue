<template>
  <q-input
    v-model="localModel"
    ref="localRef"
    :type="type !== 'password' ? type : isPwd ? 'password' : 'text'"
    @update:model-value="handleChange"
    @blur="activarValidacion"
    :label="label + (requerido ? '*' : '')"
    :rules="rules"
    :hint="hint"
    debounce="400"
    outlined
    :autogrow="autogrow"
    :clearable="clearable"
    :dense="dense"
    :class="clase"
    bottom-slots
    :error="error"
    :errorMessage="errorMsg"
  >
    <template #prepend v-if="icono">
      <q-icon :name="icono" @click.stop.prevent />
    </template>

    <template #after v-if="info && info.length > 0">
      <input-botonAyuda :mensaje="info" />
    </template>

    <template #append v-if="type === 'password'">
      <q-icon
        :name="isPwd ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="isPwd = !isPwd"
      ></q-icon>
    </template>
  </q-input>
</template>

<script setup>
const props = defineProps({
  type: { type: String, default: 'text' }, // type : text, textarea, autogrow, password
  default: { type: String, default: '' }, // el valor inicial del input
  label: { type: String, default: null }, // el label que aparece adentro
  hint: { type: String, default: null }, // texto de ayuda debajo del input
  info: { type: String, default: null }, // el texto del boton de informacion
  rules: { type: Array, default: [] }, // las reglas de validacion
  icono: { type: String, default: null }, // el icono en prepend
  errorMessage: { type: String, default: null }, // msj de error desde el componiente padre
  clearable: { type: Boolean, default: false }, // una cruz para vaciar el campo
  dense: { type: Boolean, default: false }, // mas compacto
  clase: { type: Boolean, default: false }, // clase css / tailwind a aplicar al input
  // validate: Boolean, // para activar la validacion desde el componiente padre
});

// type del input
if (
  ![
    'text', // un campo de texto normal
    'textarea', // un bloque cuadrado de texto fijo
    'autogrow', // las lineas aparecen segun el contenido
    'password', // las letras estan escondidas, hay un boton para verlas
    'number', // un campo de texto normal pero solo se pueden entrar numeros
  ].includes(props.type)
) {
  props.type = 'text'; // por defecto es text
}
const autogrow = ref(false); // configuracion del autogrow
if (props.type === 'autogrow') {
  props.type = 'text';
  autogrow.value = true;
}

// refs
const localModel = ref(props.default); // contenido del input
const localRef = ref(null); // referencia del input
const error = ref(false); // si se tiene que mostrar o no el error
const errorMsg = ref(props.errorMessage); // el mensaje de error
const isPwd = ref(true); // si las letras son visibles o

// computed
const requerido = props.rules // para saber si el input es requerido
  .map((rule) => rule.name)
  .includes('requerido');

// declaracion de los eventos
const emits = defineEmits(['update', 'error']);

// llamado cuando cambia el valor del input
const handleChange = (newValue, oldValue) => {
  activarValidacion(); // activar la validacion con el valor actual del input
  emits('update', newValue, oldValue); // emitir el cambio al componiente padre
};

// activar o desactivar el modo de error para el input
function setError(mensaje) {
  errorMsg.value = mensaje; // setear el mensaje de error, o resetear todo si es null
  error.value = mensaje !== null; // activar el error
  emits('error', error.value); // emitir el error al componiente padre
}

// activar la validacíon del valor actual del input
function activarValidacion() {
  for (const regla of props.rules) {
    // para cada regla:
    const resultado = regla(localModel.value); // aplicar la regla al valor actual
    if (resultado !== true) {
      setError(resultado); // mandar el error
      return; // solo el primer error se manda
    }
  }
  setError(null); // todas las reglas han pasado, reseteamos el error
}

// recibiendo un mensaje de error desde el componiente padre
watch(
  () => props.errorMessage, // si cambia el ref en el componiente padre,
  () => setError(props.errorMessage), // activamos el error
);

// // validacion desde el componiente padre
// watch(
//   () => props.validate, // si cambia la ref validate en el componiente padre,
//   () => activarValidacion(), // se activa la validacion
//   { immediate: false },
// );
</script>
