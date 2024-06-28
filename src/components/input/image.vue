<template>
  <q-file
    v-model="localModel"
    @update:model-value="handleChange"
    @rejected="handleReject"
    @blur="activarValidacion"
    @clear="handleClear"
    :label="label + (requerido ? '*' : '')"
    :hint="hint?.replace('{maxSizeKb}', maxSizeKb)"
    :accept="accept"
    :max-total-size="Number(maxSizeKb) * 1024"
    :dense="dense"
    :filled="filled"
    :outlined="outlined"
    :class="clase"
    bottom-slots
    :error="errorFlag"
    :errorMessage="error"
  >
    <template #prepend v-if="icono">
      <q-icon :name="icono" @click.stop.prevent />
    </template>

    <template #append>
      <q-btn
        @click="handleClear"
        icon="clear"
        size="xs"
        color="grey-6"
        unelevated
        dense
        round
      />
      <q-btn
        v-if="valorInicial || valorPreview"
        @click="handleRefresh"
        icon="refresh"
        size="xs"
        color="grey-6"
        unelevated
        dense
        round
      />
    </template>

    <template #before v-if="preview">
      <q-img :src="preview" style="width: 50px" />
    </template>

    <template #after v-if="info && info.length > 0">
      <input-botonAyuda :mensaje="info" />
    </template>
  </q-file>
</template>

<script setup lang="ts">
/**
 * emits
 */

const emits = defineEmits<{
  (
    // cambió el valor del input
    event: 'update',
    valor: string | null,
  ): void;
  (
    // el input está en estado de error de validación
    event: 'error',
    errorFlag: boolean,
    errorMessage: string | null,
  ): void;
}>();

/**
 * props
 */

const props = withDefaults(
  defineProps<{
    accept?: string; // extenciones de archivo validas
    maxSizeKb?: string; // tamaño maximo en Kb
    valorInicial?: string; // valor seleccionado al iniciar
    valorPreview?: string; // valor mostrado al iniciar, sin seleccionar
    label?: string; // label adentro del input
    hint?: string; // texto de ayuda debajo del input
    info: string; // texto de ayuda en el boton de ayuda
    rules?: Function[]; // reglas de validacion
    icono?: string; // icono a mostrar adentro a la isquierda antes del label
    clase?: string; // clases css o tailwind
    activarValidacion?: boolean; // cambiar en el comp. pariente para forzar validacion
    error?: string; // cambiar en el comp. oariente para mostrar un error personalizado
    dense?: boolean;
    outlined?: boolean;
    filled?: boolean;
    clearable?: boolean;
  }>(),
  {
    outlined: true,
    // filled: true,
    dense: true,
    clearable: true,
    clase: 'mt-5 mb-2',
  },
);

/**
 * refs, reactives y computed
 */

const preview = ref<string>(null); // contenido del input
const localModel = ref<string | null>(null); // contenido del input
const errorFlag = ref<boolean>(false); // si se tiene que mostrar o no el error
const errorMensaje = ref<string>(props.error); // el mensaje de error
const requerido = (props.rules as Function[])
  .map((rule) => rule.name)
  .includes('requerido');

/**
 * Logica especifica para refresh y clear
 */

// al cambiar el local model, avisar el componiente padre
watch(localModel, () => {
  emits('update', localModel.value);
});

// borrar el contenido del input
const handleClear = () => {
  localModel.value = null;
  preview.value = null;
};

// reiniciar el valor inicial del input
const handleRefresh = () => {
  if (props.valorInicial) {
    localModel.value = props.valorInicial;
    preview.value = props.valorInicial;
  } else if (props.valorPreview) {
    localModel.value = null;
    preview.value = props.valorPreview;
  } else handleClear();
};

// refresh con los valores iniciales
handleRefresh();

/**
 * Metodos
 */

// activar o deactivar el error para el input (desactiva si param null)
function setError(mensaje: string | null) {
  //@ts-ignore
  errorMensaje.value = mensaje;
  errorFlag.value = mensaje !== null;
  emits('error', errorFlag.value, errorMensaje.value);
}

// activar la validacíon del valor actual del input
function activarValidacion(reset = true) {
  for (const regla of props.rules as Function[]) {
    const resultado = regla(localModel.value);
    if (resultado !== true) {
      setError(resultado);
      return; // solo el primer error se manda
    }
  }
  if (reset) setError(null);
}

// llamado cuando cambia el valor del input
const handleChange = (valor: Blob | null) => {
  setError(null);
  if (valor instanceof Blob) {
    const lector = new FileReader();
    lector.addEventListener('load', () => {
      // @ts-ignore
      localModel.value = lector.result;
    });
    lector.addEventListener('error', () => {
      setError('Hubo un problema al cargar la imagen');
    });
    lector.readAsDataURL(valor);
  }
  activarValidacion(false);
};

// hubo un error de tamaño o de extensión de la imagen
const handleReject = ([event]: [any]) => {
  errorFlag.value = true;
  if (event.failedPropValidation == 'max-total-size') {
    errorMensaje.value =
      'La imagen debe pesar menos de ' + Number(props.maxSizeKb) + 'KB';
  } else if (event.failedPropValidation == 'accept') {
    errorMensaje.value = 'Este archivo no es una imagen';
  } else {
    errorMensaje.value = 'Algo fue mal, intente de nuevo';
  }
  emits('error', errorFlag.value, errorMensaje.value);
};

/**
 * watch y subscripciones
 */

// activar el error si llega un mensaje de error desde el componiente padre
watch(
  () => props.error,
  () => setError(props.error),
);

// activar la validacion desde el componiente padre
watch(
  () => props.activarValidacion, // si cambia la ref validate en el componiente padre,
  () => activarValidacion(), // se activa la validacion
  { immediate: false },
);
</script>
