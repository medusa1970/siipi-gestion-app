<template>
  <q-file
    v-model="archivo"
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
    :errorMessage="errorMensaje"
    counter
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
        v-if="dataPreview || dataInicial"
        @click="handleRefresh"
        icon="refresh"
        size="xs"
        color="grey-6"
        unelevated
        dense
        round
      />
    </template>

    <template #before v-if="imagen">
      <q-img :src="imagen" style="width: 50px" />
    </template>

    <template #after v-if="info && info.length > 0">
      <input-botonAyuda :mensaje="info" />
    </template>
  </q-file>
</template>

<script setup lang="ts">
import { ref } from 'vue';

/**
 * emits
 */

const emits = defineEmits<{
  (
    // cambió el valor del input
    event: 'update',
    data: string | null,
    mimetype: string | null,
    isPreview: boolean,
  ): void;
  (
    // el input está en estado de error de validación
    event: 'error',
    errorFlag: boolean,
    errorMensaje: string | null,
  ): void;
}>();

/**
 * props
 */

const props = withDefaults(
  defineProps<{
    onUpdate: Function; // para que el @update sea obligatorio
    label: string; // label adentro del input
    accept?: string; // extenciones de archivo validas
    maxSizeKb?: string; // tamaño maximo en Kb
    hint?: string; // texto de ayuda debajo del input
    info?: string; // texto de ayuda en el boton de ayuda
    rules?: any; // reglas de validacion
    icono?: string; // icono a mostrar adentro a la isquierda antes del label
    clase?: string; // clases css o tailwind
    activarValidacion?: boolean; // cambiar en el comp. pariente para forzar validacion
    error?: string; // cambiar en el comp. oariente para mostrar un error personalizado
    watch?: File; // ref de la cual se hara un watch de los cambios para cambiar el input
    dense?: boolean;
    outlined?: boolean;
    filled?: boolean;
    clearable?: boolean;
    dataInicial?: string; // valor seleccionado al iniciar
    dataPreview?: string; // valor mostrado al iniciar, sin seleccionar
  }>(),
  {
    outlined: true,
    // filled: true,
    dense: true,
    clearable: true,
    clase: '',
    rules: [] as Function[],
    maxSizeKb: '500',
  },
);

/**
 * refs, reactives y computed
 */

const archivo = ref<File | null>(null); // contenido del input
const imagen = ref<string | null>(null); // imagen que se muestra a la pantalla
const errorFlag = ref<boolean>(false); // si se tiene que mostrar o no el error
const errorMensaje = ref<string>(props.error); // el mensaje de error
const requerido = props.rules.map((rule) => rule.name).includes('requerido');

// bug
onBeforeMount(async () => {});

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
function activarValidacion() {
  for (const regla of props.rules as Function[]) {
    const resultado = regla(archivo.value);
    if (resultado !== true) {
      setError(resultado);
      return;
    }
  }
  setError(null);
}

// llamado cuando cambia el valor del input
const handleChange = async (file: File | null) => {
  setError(null);
  if (file instanceof File) {
    archivo.value = file;
    const lector = new FileReader();
    lector.addEventListener('load', () => {
      imagen.value = lector.result as string;
      emits('update', imagen.value, file.type, false);
    });
    lector.addEventListener('error', () => {
      setError('Hubo un problema al cargar la imagen');
    });
    lector.readAsDataURL(file);
  }
  // TODO pensarlo mejor
  for (const regla of props.rules as Function[]) {
    const resultado = regla(archivo.value);
    if (resultado !== true) {
      setError(resultado);
      return;
    }
  }
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
 * Logica especifica para refresh y clear
 */

// borrar el contenido del input
const handleClear = () => {
  archivo.value = null;
  imagen.value = null;
  emits('update', null, null, false);
};

// reiniciar el valor inicial del input
const handleRefresh = () => {
  // valor por defecto
  if (props.dataInicial) {
    imagen.value = props.dataInicial;
    archivo.value = new File([props.dataInicial], 'foo.bar', {
      type: 'image/png',
    });
    emits('update', props.dataInicial, 'image/png', false);
  }

  // valor por defecto
  else if (props.dataPreview) {
    imagen.value = props.dataPreview;
    archivo.value = null;
    emits('update', null, null, true);
  }

  // nada
  else handleClear();
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

// modificar el valor desde el componiente padre
watch(
  () => props.watch,
  () => {
    archivo.value = props.watch;
    activarValidacion();
  },
  { immediate: false },
);

/**
 * Inicialisacion
 */

handleRefresh();
</script>
