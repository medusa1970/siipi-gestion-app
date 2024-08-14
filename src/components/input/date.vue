<template>
  <div>
    <h3 class="inputTitle" v-if="!labelAdentro">
      {{ label + (requerido ? ' *' : '') }}
      <q-icon
        name="help"
        color="blue"
        size="20px"
        @click="tooltip = !tooltip" />
    </h3>
    <q-input
      ref="inputRef"
      type="text"
      :label="
        labelAdentro ? (label ?? '') + (requerido ? ' *' : '') : undefined
      "
      v-model="localModel"
      :hint="hint"
      :requerido="requerido"
      :rules="reglasValidacion"
      :clearable="clearable"
      :disable="disable"
      @clear="handleClear"
      @blur="handleBlur"
      lazy-rules="ondemand"
      debounce="300"
      :error="noSlot ? undefined : errorFlag"
      :errorMessage="errorMensaje"
      :bottom-slots="!noSlot"
      :dense="dense"
      :outlined="outlined"
      :filled="filled"
      :color="inputConfig.color"
      :bg-color="
        localModel && localModel !== ''
          ? inputConfig.bgColorLleno
          : inputConfig.bgColorVacio
      ">
      <q-tooltip
        v-model="tooltip"
        class="no-pointer-events text-white text-sm bg-blue-9"
        anchor="bottom middle"
        self="top middle"
        :offset="[0, -15]"
        max-width="300px"
        no-parent-event
        @show="hideTooltip()">
        {{ info }}
      </q-tooltip>
      <template #prepend v-if="icono">
        <q-icon :name="icono" @click.stop.prevent />
      </template>
      <template #after>
        <q-icon
          v-if="labelAdentro && info && info.length > 0"
          name="help"
          @click="tooltip = !tooltip" />
      </template>
      <template v-slot:append>
        <q-icon
          name="event"
          class="cursor-pointer"
          @click="showModal.datePicker = true" />
      </template>
    </q-input>
  </div>

  <Popup v-model="showModal.datePicker" titulo="Elija una fecha">
    <template #body>
      <q-date
        v-model="localModel"
        :locale="locale"
        mask="DD/MM/YYYY"
        minimal
        @update:model-value="
          {
            showModal.datePicker = false;
          }
        " />
    </template>
  </Popup>
</template>

<script setup lang="ts">
import { inputConfig } from './input.service';
import { validacion } from './input.validacion';
import { ref } from 'vue';

/**
 * El tooltip tiene el texto de ayuda ;
 * Cuando aparece se llama a esta funcion para ocultarlo despues de un tiempo
 */

const tooltip = ref(false);
const hideTooltip = (seconds = 5) =>
  setTimeout(() => (tooltip.value = false), seconds * 1000);

/**
 * Definicion y tipado de los eventos que puede emitir este componiente
 */

const emits = defineEmits<{
  (
    event: 'update', // si cambió el valor del input
    valor: Date // el valor
  ): void;
  (
    event: 'error', // si estado de error de validación cambió
    errorFlag: boolean, // true si hay un error activa
    errorMessage: string | null, // el mensaje de error
    valor: any // el valor que ha provocado el error
  ): void;
}>();

/**
 * Definicion de todos los parametros
 */

const props = withDefaults(
  defineProps<{
    // Solo declaramos onUpdate para que el @update sea obligatorio
    onUpdate: Function;

    // El titulo del input;
    // si labelAdentro esta a true, se muestra adentro, sino arriba
    label: string;
    labelAdentro?: boolean;

    // Un mensaje de error a mostrar si el input es requerido, o un simple boolean si
    // se quiere mostrar un mensaje de error por defecto
    // (no podemos usar required que trae su propria validacion)
    requerido?: boolean | string;

    // si el input esta desabilitado
    disable?: boolean;

    // un texto de ayuda a mostrar debajo del input
    hint?: string;

    // un texto de ayuda a mostrar en una popup al lado del input
    info?: string;

    // el valor por defecto al cargar el input
    porDefecto?: Date;

    // Una referencia que cuando cambia su valor, se actualiza el input con el mismo
    // forceWatch permite activar el watch mismo si el valor de watch no ha cambiado
    watch?: Date;
    forceWatch?: boolean;

    // reglas de validacion de la forma (val: any): String | true
    rules?: any;

    // range
    before?: Date;
    after?: Date;

    // una referencia que cuando cambia su valor, activa la validacion del input
    activarValidacion?: boolean;

    // un mensaje de error personalizado; al cambiar su valor automaticamente el
    // input entra en estado de error y se emite un evento 'error'
    error?: string;

    // mostrar la crucecita para borrar el valor del input
    clearable?: boolean;

    // visual
    icono?: string; // icono en prepend
    dense?: boolean;
    outlined?: boolean;
    filled?: boolean;
    noSlot?: boolean; // ya no se mostraron mensajes de error pero queda mas compacto
  }>(),
  {
    requerido: false,
    noSlot: false,
    clearable: true,
    rules: [] as Function[],
    hint: 'Fecha con el formato DD/MM/AAAA',
    before: null,
    after: null,
    filled: inputConfig.filled,
    dense: inputConfig.dense,
    outlined: inputConfig.outlined,
    clase: inputConfig.clase,
    labelAdentro: inputConfig.labelAdentro,
    forceWatch: null
  }
);

const valorParaMostrar = (valor = null) => {
  return valor != null ? new Date(valor).toLocaleString().split(' ')[0] : null;
};
const valorParaEmitir = date => {
  if (date === null) return null;
  const [day, month, year] = date.split('/');
  return new Date(`${month}/${day}/${year}`);
};

/**
 * Definicion de las refs
 */

// ref del input para acceder a sus metodos de validacion
const inputRef = ref(null);

// la ref que contiene el valor del input
const localModel = ref<string>(valorParaMostrar(props.porDefecto));

// un boolean que controla si setiene que mostrar o no el mensaje error, y
// el dicho mensaje
const errorFlag = ref<boolean>(false);
const errorMensaje = ref<string>(props.error);

// modales
const showModal = reactive({
  datePicker: false
});

/**
 * Reglas de validacion
 */

let reglasValidacion = props.rules ?? [];
reglasValidacion = [validacion.fecha(), ...reglasValidacion];
if (props.before) {
  reglasValidacion = [validacion.before(props.before), ...reglasValidacion];
}
if (props.after) {
  reglasValidacion = [validacion.after(props.after), ...reglasValidacion];
}
if (props.requerido) {
  reglasValidacion = [
    validacion.requerido(
      typeof props.requerido === 'string' ? props.requerido : undefined
    ),
    ...reglasValidacion
  ];
}

/**
 * Cambio de valor
 */

watch(
  () => localModel.value,
  () => {
    // reset de la validacion
    if (inputRef.value) inputRef.value.resetValidation();
    activarValidacion();

    // clear: ponemos el localModel a null
    if (localModel.value === null) {
      emits('update', null);
    }

    // change: si no hay error de validacion, emitemos el nuevo valor
    else {
      if (activarValidacion()) {
        emits('update', valorParaEmitir(localModel.value));
      }
    }
  }
);

/**
 * Cambio de valor desde el componiente padre via props.watch
 */

watch(
  () => props.watch,
  () => {
    emits('update', valorParaEmitir(localModel.value));
  },
  { once: true, immediate: true }
);

/**
 * Inicializacion del componente al cargar props.watch la primera vez
 * La prop 'forceWatch' sirve para forzar este cambio en caso de que
 * el valor de la prop tiene que ser la misma dos veces seguida (porque
 * la funcion watch solo detecta los cambios reales).
 */

watch(
  () => [props.watch, props.forceWatch],
  () => {
    localModel.value = valorParaMostrar(props.watch);
  },
  { immediate: false }
);

/**
 * Este metodo se ejecuta cada vez que el input pierde el focus
 */
const handleClear = () => {
  localModel.value = null;
};
const handleBlur = e => {
  setError(null);
};

/**
 * Activa el error con el mensaje pasado por parametro,
 * o bien lo desactiva si es null
 */

function setError(mensaje: string | null) {
  errorMensaje.value = mensaje;
  errorFlag.value = mensaje !== null;
  emits('error', errorFlag.value, errorMensaje.value, localModel.value);
}

/**
 * Activa la validacíon del valor actual del input
 * y si corresponde, muestra un mensaje de error.
 * Solo el primer error se manda
 */

function activarValidacion() {
  for (const regla of reglasValidacion as Function[]) {
    const resultado = regla(localModel.value);
    if (resultado !== true) {
      setError(resultado);
      return false;
    }
  }
  setError(null);
  return true;
}

/**
 * Se puede pasar un mensaje de error personalizado desde el componiente padre
 * sin tener que pasar por la validacion aquí, pasando ese mensaje por la prop 'error'
 */

watch(
  () => props.error,
  () => setError(props.error)
);

/**
 * También se puede forzar la activacion de la validacion desde el componiente padre
 * cambiando el valor de la prop 'activarValidacion'
 */

watch(
  () => props.activarValidacion,
  () => activarValidacion(),
  { immediate: false }
);
</script>
