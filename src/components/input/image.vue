<template>
  <q-file
    class="w-full"
    v-model="localModel"
    :label="label + (requerido ? '*' : '')"
    :hint="hint.replace('{maxSizeKb}', maxSizeKb)"
    :accept="accept"
    :max-total-size="maxSizeKb * 1024"
    :dense="!notDense"
    filled
    clearable
    :error="errorEstado"
    bottom-slots
    @update:model-value="handleChange"
    @rejected="handleReject"
    @clear="handleClear"
    @blur="handleBlur"
  >
    <template #prepend v-if="icono">
      <q-icon :name="icono" @click.stop.prevent />
    </template>
    <template #after>
      <input-botonAyuda v-if="info.length > 0" :mensaje="info" />
    </template>
    <template #file>
      <q-img v-if="preview" :src="preview"></q-img>
    </template>
    <template #error> {{ errorMessage }} </template>
  </q-file>
</template>

<script setup>
import { obligatorio } from '@/helpers/validate.form';

/**
 * Refs
 */
const preview = ref('');
const localModel = ref('');
const errorEstado = ref(false);
const errorMessage = ref(null);

/**
 * Props
 */
const props = defineProps({
  // label del input
  label: {
    type: String,
    default: 'Seleccionar imagen',
  },
  // texto del boton de informacion
  info: {
    type: String,
    default: '',
  },
  // extensiones de archivos autorizadas
  accept: {
    type: String,
    default: '.jpg, .png, .jpeg',
  },
  // tamaño maximo en Kb
  maxSizeKb: {
    type: Number,
    default: 500,
  },
  // texto de ayuda debajo del input
  hint: {
    type: String,
    default: '',
  },
  // si el input es dense o no
  notDense: {
    type: Boolean,
    default: false,
  },
  // si el campo es requerido o no
  requerido: {
    type: Boolean,
    default: false,
  },
  // el icono en prepend
  icono: {
    type: String,
    default: '',
  },
});

/**
 * Eventos
 */
const emits = defineEmits(['update, reject, clear']);

// el valor cambió
const handleChange = (newValue, oldValue) => {
  errorEstado.value = false;

  // hemos recibido una imagen ?
  if (newValue instanceof Blob) {
    const lector = new FileReader();
    lector.addEventListener('load', () => {
      const imageBase64 = lector.result;
      preview.value = imageBase64;
      emits('update', imageBase64);
    });
    lector.addEventListener('error', () => {
      errorMessage.value = 'Hubo un problema al cargar la imagen';
      errorEstado.value = false;
      preview.value = null;
    });
    lector.readAsDataURL(localModel.value);
  }

  // sino
  else {
    if (props.requerido) {
      errorEstado.value = true;
      errorMessage.value = obligatorio(null);
    }
    emits('update', null);
  }
};

// hubo un error de tamaño o de extensión de la imagen
const handleReject = ([event]) => {
  if (event.failedPropValidation == 'max-total-size') {
    errorMessage.value =
      'La imagen debe pesar menos de ' + props.maxSizeKb + 'KB';
  } else if (event.failedPropValidation == 'accept') {
    errorMessage.value = 'Este archivo no es una imagen';
  }
  errorEstado.value = true;
  emits('reject', event);
};

// se borró el campo
const handleClear = (event) => {
  emits('clear', event);
};

// se borró el campo
const handleBlur = (event) => {
  if (!preview.value) {
    errorEstado.value = true;
    errorMessage.value = obligatorio(null);
  }
};
</script>
