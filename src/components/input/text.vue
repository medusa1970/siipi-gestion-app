<template>
  <div>
    <h3 class="inputTitle" v-if="!labelAdentro">
      {{ label + (requerido ? ' *' : '') }}
      <q-icon
        name="help"
        color="blue"
        size="20px"
        @click="tooltip = !tooltip"
      />
    </h3>
    <q-input
      ref="inputRef"
      :type="tipo"
      :label="labelAdentro ? label + (requerido ? ' *' : '') : undefined"
      :hint="hint"
      :requerido="requerido"
      :rules="reglasValidacion"
      :clearable="clearable"
      v-model="localModel"
      @update:model-value="handleChange"
      @blur="handleBlur"
      @clear="handleClear"
      lazy-rules="ondemand"
      debounce="300"
      :error="noSlot ? undefined : errorFlag"
      :errorMessage="errorMensaje"
      :autogrow="tipo === 'password' ? false : autogrow"
      :dense="dense"
      :filled="filled"
      :outlined="outlined"
      :bottom-slots="!noSlot"
      :color="inputConfig.color"
      :bg-color="
        localModel && localModel !== ''
          ? inputConfig.bgColorLleno
          : inputConfig.bgColorVacio
      "
    >
      <q-tooltip
        v-model="tooltip"
        class="no-pointer-events text-white text-sm bg-blue-9"
        anchor="bottom middle"
        self="top middle"
        :offset="[0, -15]"
        max-width="300px"
        no-parent-event
        @show="hideTooltip()"
      >
        {{ info }}
      </q-tooltip>

      <template #prepend v-if="icono">
        <q-icon :name="icono" @click.stop.prevent />
      </template>
      <template #append v-if="tipo === 'password'">
        <q-icon
          :name="esconderLetras ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="esconderLetras = !esconderLetras"
        ></q-icon>
      </template>
      <template #after>
        <q-icon
          v-if="labelAdentro && info && info.length > 0"
          name="help"
          @click="tooltip = !tooltip"
        />
      </template>
    </q-input>
  </div>
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
const hideTooltip = (seconds = 3) =>
  setTimeout(() => (tooltip.value = false), seconds * 1000);

/**
 * Definicion y tipado de los eventos que puede emitir este componiente
 */

const emits = defineEmits<{
  (
    event: 'update', // si cambió el valor del input
    valor: string | number | null, // el valor
  ): void;
  (
    event: 'error', // si estado de error de validación cambió
    errorFlag: boolean, // true si hay un error activa
    errorMessage: string | null, // el mensaje de error
    valor: any, // el valor que ha provocado el error
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

    // el tipo del input
    tipo?:
      | 'text' // texto simple (por defecto)
      | 'textarea' // textarea
      | 'password' // contraseña con letras escondidas
      | 'number' // numero intero
      | 'decimal'; // numero con dos decimales

    // un texto de ayuda a mostrar debajo del input
    hint?: string;

    // un texto de ayuda a mostrar en una popup al lado del input
    info?: string;

    // el valor por defecto al cargar el input
    porDefecto?: string | number;

    // Una referencia que cuando cambia su valor, se actualiza el input con el mismo
    // forceWatch permite activar el watch mismo si el valor de watch no ha cambiado
    watch?: string | number;
    forceWatch?: boolean;

    // reglas de validacion de la forma (val: any): String | true
    rules?: any;

    // una referencia que cuando cambia su valor, activa la validacion del input
    activarValidacion?: boolean;

    // un mensaje de error personalizado; al cambiar su valor automaticamente el
    // input entra en estado de error y se emite un evento 'error'
    error?: string;

    // mostrar la crucecita para borrar el valor del input
    clearable?: boolean;

    // si el tamaño del input en altura es dinamico
    autogrow?: boolean;

    // visual
    icono?: string; // icono en prepend
    dense?: boolean;
    outlined?: boolean;
    filled?: boolean;
    noSlot?: boolean; // ya no se mostraron mensajes de error pero queda mas compacto
  }>(),
  {
    tipo: 'text',
    requerido: false,
    autogrow: false,
    noSlot: false,
    clearable: true,
    rules: [] as Function[],
    filled: inputConfig.filled,
    dense: inputConfig.dense,
    outlined: inputConfig.outlined,
    clase: inputConfig.clase,
    labelAdentro: inputConfig.labelAdentro,
    forceWatch: null,
  },
);

/**
 * si el tipo es number o decimal, convierte el valor en locale en-US
 * con el buen numero de decimales y las comas entre los millares
 */

const numeroConComas = (valor) => {
  let res = null;
  if (valor != null) {
    switch (props.tipo) {
      case 'number':
        res = parseFloat(String(valor)).toLocaleString('en-US', {
          minimumFractionDigits: 0,
        });
        break;
      case 'decimal':
        res = parseFloat(String(valor)).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        break;
      default:
        res = String(valor);
    }
  }
  return res;
};

/**
 * Definicion de las refs
 */

// ref del input para acceder a sus metodos de validacion
const inputRef = ref(null);

// la ref que contiene el valor del input
const localModel = ref<string>(numeroConComas(props.porDefecto));

// un boolean que controla si setiene que mostrar o no el mensaje error, y
// el dicho mensaje
const errorFlag = ref<boolean>(false);
const errorMensaje = ref<string>(props.error);

// si el input es de tipo password, controla si las letras son visibles o no
const esconderLetras = ref<boolean>(true);

// agregamos las reglas de vlaidacion especificas segun el tipo del input
let reglasValidacion = props.rules ?? [];
if (props.tipo === 'decimal') {
  reglasValidacion = [validacion.decimal(), ...reglasValidacion];
}
if (props.tipo === 'number') {
  reglasValidacion = [validacion.numero(), ...reglasValidacion];
}
if (props.requerido) {
  reglasValidacion = [
    validacion.requerido(
      typeof props.requerido === 'string' ? props.requerido : undefined,
    ),
    ...reglasValidacion,
  ];
}

// calculo del tipo extacto a pasar a q-input
const tipo = computed(() =>
  props.tipo === 'password'
    ? esconderLetras.value
      ? 'password'
      : 'text'
    : props.tipo === 'textarea'
    ? 'textarea'
    : 'text',
);

/**
 * Este metodo se ejecuta cada vez que cambia el valor del input
 * Si el cambio no produce error de validacion, se emite el nuevo valor
 * Nota : el valor del input es un string pero el valor emitido en el evento puede ser number
 */

const handleChange = (valor: string | null) => {
  inputRef.value.resetValidation();
  if (activarValidacion()) {
    if (props.tipo === 'number' || props.tipo === 'decimal') {
      emits('update', valor == null ? null : Number(valor.replace(',', '')));
    } else {
      emits('update', valor);
    }
  }
};

/**
 * Este metodo se ejecuta cada vez que se presiona el boton de borrar (x)
 * en caso de que clearable esta a true
 */

const handleClear = () => {
  // activarValidacion();
  localModel.value = null;
  emits('update', null);
};

/**
 * Este metodo se ejecuta cada vez que el input pierde el focus
 */

const handleBlur = (e) => {
  setError(null);
  // activarValidacion();
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
 * y si corresponde, muestra un mensaje de error
 */

function activarValidacion() {
  for (const regla of reglasValidacion as Function[]) {
    const resultado = regla(localModel.value);
    if (resultado !== true) {
      setError('//'); // para que se detecte un cambio
      setError(resultado);
      return false; // solo el primer error se manda
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
  () => setError(props.error),
);

/**
 * También se puede forzar la activacion de la validacion desde el componiente padre
 * cambiando el valor de la prop 'activarValidacion'
 */

watch(
  () => props.activarValidacion,
  () => activarValidacion(),
  { immediate: false },
);

/**
 * El input puede también recibir un valor directamente del componiente padre pasandolo
 * por la prop 'watch'. La primera vez, lo hace sin validacion.
 *  La prop 'forceWatch' sirve para forzar este cambio en caso de que
 * el valor de la prop tiene que ser la misma dos veces seguida (la funcion watch solo
 * detecta los cambios reales).
 */

watch(
  () => [props.watch, props.forceWatch],
  () => {
    localModel.value = numeroConComas(props.watch);
    activarValidacion();
    handleChange(localModel.value);
  },
  { immediate: false },
);
watch(
  () => props.watch,
  () => {
    emits('update', localModel.value);
  },
  { once: true, immediate: true },
);
</script>
