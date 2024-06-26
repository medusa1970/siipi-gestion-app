<template>
  <q-file
    v-model="localModel"
    ref="localRef"
    @update:model-value="handleChange"
    @rejected="handleReject"
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
  // el label del input
  label: { type: String, default: null },

  // texto de ayuda debajo del input
  hint: { type: String, default: 'Tamaño máximo {maxSizeKb}Kb' },

  // el texto del boton de informacion
  info: { type: String, default: null },

  // las reglas de validacion
  rules: { type: Array, default: [] },

  // el icono en prepend
  icono: { type: String, default: null },

  // mensaje de error personalizado desde el componiente padre
  errorMessage: { type: String, default: null },

  // extensiones de archivos autorizadas
  accept: { type: String, default: '.jpg, .png, .jpeg' },

  // tamaño maximo en Kb
  maxSizeKb: { type: String, default: '500' },
});

// refs
const localModel = ref('');
const localRef = ref(null);
const preview = ref('');
const error = ref(false);
const errorMsg = ref(props.errorMessage);
const dense = ref(null);
const clase = ref(null);
const clearable = ref(null);
const requerido = props.rules.map((rule) => rule.name).includes('requerido');

// pasando el nuevo valor al componiente padre
const emits = defineEmits(['update, reject, clear']);
const handleChange = (newValue, oldValue) => {
  // error.value = false;

  // hemos recibido una imagen ?
  if (newValue instanceof Blob) {
    const lector = new FileReader();
    lector.addEventListener('load', () => {
      const imageBase64 = lector.result;
      preview.value = imageBase64;
      emits('update', imageBase64);
    });
    lector.addEventListener('error', () => {
      errorMsg.value = 'Hubo un problema al cargar la imagen';
      preview.value = null;
    });
    lector.readAsDataURL(localModel.value);
  }

  // sino
  else {
    // if (props.requerido) {
    //   props.errorMessage = requerido(null);
    // }
    emits('update', null);
  }
};

// hubo un error de tamaño o de extensión de la imagen
const handleReject = ([event]) => {
  if (event.failedPropValidation == 'max-total-size') {
    errorMsg.value =
      'La imagen debe pesar menos de ' + Number(props.maxSizeKb) + 'KB';
  } else if (event.failedPropValidation == 'accept') {
    errorMsg.value = 'Este archivo no es una imagen';
  }
  emits('reject', event);
};

// se borró el campo
const handleClear = (event) => {
  emits('clear', event);
};

// se borró el campo
const handleBlur = (event) => {
  if (!preview.value) {
    // errorMsg.value = useRules.requerido(null);
  }
};

// recibiendo un ordén de validación desde el componiente padre
// sirve para actualizacion cuando se llama por @click en vez de @submit
watch(
  () => props.validate,
  () => {
    // localRef.value.resetValidation();
    localRef.value?.validate();
  },
  { immediate: false },
);

// recibiendo un mensaje de error desde el componiente padre
watch(
  () => props.errorMessage,
  () => {
    errorMsg.value = props.errorMessage;
  },
);

// ... o desde aqui mismo
watch(errorMsg, () => {
  error.value = errorMsg.value != null;
});
</script>
