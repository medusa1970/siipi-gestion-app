<template>
  <q-file
    v-model="localModel"
    ref="localRef"
    @update:model-value="handleChange"
    @rejected="handleReject"
    @blur="activarValidacion"
    :label="label + (requerido ? '*' : '')"
    :hint="hint.replace('{maxSizeKb}', maxSizeKb)"
    :accept="accept"
    :max-total-size="Number(maxSizeKb) * 1024"
    outlined
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

    <template #file>
      <q-img v-if="preview" :src="preview"></q-img>
    </template>
  </q-file>
</template>

<script setup>
const props = defineProps({
  label: { type: String, default: null }, // el label que aparece adentro
  hint: { type: String, default: null }, // texto de ayuda debajo del input
  info: { type: String, default: null }, // el texto del boton de informacion
  rules: { type: Array, default: [] }, // las reglas de validacion
  icono: { type: String, default: null }, // el icono en prepend
  errorMessage: { type: String, default: null }, // msj de error desde el componiente padre
  clearable: { type: Boolean, default: false }, // una cruz para vaciar el campo
  dense: { type: Boolean, default: false }, // mas compacto
  clase: { type: Boolean, default: false }, // clase css / tailwind a aplicar al input
  accept: { type: String, default: '.jpg, .png, .jpeg' }, // extenciones de archivo validas
  maxSizeKb: { type: String, default: '500' }, // tamaño maximo en Kb
  // validate: Boolean, // para activar la validacion desde el componiente padre
});

// refs
const localModel = ref(props.default); // contenido del input
const localRef = ref(null); // referencia del input
const error = ref(false); // si se tiene que mostrar o no el error
const errorMsg = ref(props.errorMessage); // el mensaje de error
const preview = ref(''); // el archivo para el preview en base64

// computed
const requerido = props.rules // para saber si el input es requerido
  .map((rule) => rule.name)
  .includes('requerido');

// declaracion de los eventos
const emits = defineEmits(['update', 'error']);

// activar o desactivar el modo de error para el input
function setError(mensaje) {
  errorMsg.value = mensaje; // setear el mensaje de error, o resetear todo si es null
  error.value = mensaje !== null; // activar el error
  emits('error', error.value); // emitir el error al componiente padre
}

// funcion de validacion
function activarValidacion(reset = true) {
  for (const regla of props.rules) {
    // para cada regla:
    const resultado = regla(localModel.value); // aplicar la regla al valor actual
    if (resultado !== true) {
      setError(resultado); // mandar el error
      return; // solo el primer error se manda
    }
  }
  if (reset) {
    // si no se especifico que no, reinicialisa el error
    setError(null);
  }
}

// llamado cuando cambia el valor del input
const handleChange = (newValue, oldValue) => {
  setError(null); // primero reinicialisemos los errores
  if (newValue instanceof Blob) {
    const lector = new FileReader();
    lector.addEventListener('load', () => {
      const imageBase64 = lector.result;
      preview.value = imageBase64; // mandamos el archivo al preview
      emits('update', imageBase64); // y al componiente padre directamente en base64
    });
    lector.addEventListener('error', () => {
      setError('Hubo un problema al cargar la imagen');
      preview.value = null;
    });
    lector.readAsDataURL(localModel.value); // lo ponemos tambien como valor del input
  } else {
    emits('update', null); // si no se subió ningun archivo, avisamo al padre
  }
  activarValidacion(false); // activamos la validacion (para el requerido mas que todo)
};

// hubo un error de tamaño o de extensión de la imagen
const handleReject = ([event]) => {
  error.value = true;
  if (event.failedPropValidation == 'max-total-size') {
    errorMsg.value =
      'La imagen debe pesar menos de ' + Number(props.maxSizeKb) + 'KB';
  } else if (event.failedPropValidation == 'accept') {
    errorMsg.value = 'Este archivo no es una imagen';
  } else {
    errorMsg.value = 'Algo fue mal, intente de nuevo';
  }
  emits('reject', event); // avisamos al padre
};

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
