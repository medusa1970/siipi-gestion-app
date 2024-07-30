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
    <q-select
      ref="inputRef"
      :label="labelAdentro ? label + (requerido ? ' *' : '') : undefined"
      v-model="localModel"
      @update:model-value="handleChange"
      @filter="filterFn"
      @blur="handleBlur"
      @clear="handleClear"
      lazy-rules="ondemand"
      input-debounce="0"
      :clearable="clearable"
      :dense="dense"
      :disable="disable"
      :filled="filled"
      :rules="reglasValidacion"
      :outlined="outlined"
      :bottom-slots="!noSlot"
      :error="false"
      :errorMessage="errorMensaje"
      options-dense
      :options="listaOpciones"
      emit-value
      input-select
      no-options-label="Opción no encontrada"
      map-options
      :dialog="dialog"
      use-input
      fill-input
      hide-selected
      :color="color ?? inputConfig.color"
      :bg-color="
        color ??
        (localModel && localModel !== ''
          ? inputConfig.bgColorLleno
          : inputConfig.bgColorVacio)
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

      <template #no-option>
        <q-item>
          <q-item-section class="text-grey"> No hay resultados </q-item-section>
        </q-item>
      </template>
      <template #prepend v-if="icono">
        <q-icon :name="icono" @click.stop.prevent />
      </template>
      <template #after v-if="info && info.length > 0">
        <q-btn
          v-if="dialog && !disable"
          size="12px"
          icon="add"
          color="green"
          style="height: 16px; width: 16px"
          @click="() => (showDialog = true)"
        ></q-btn>
        <q-icon
          v-if="labelAdentro && info && info.length > 0"
          name="help"
          @click="tooltip = !tooltip"
        />
      </template>
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps" :class="scope.opt.class">
          <q-item-section>{{ scope.opt.label }}</q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>

  <Popup v-model="showDialog" titulo="Agregar un nuevo item">
    <template #body>
      <props.dialog :config="dialogConfig" @crearObjeto="handleCrear" />
    </template>
  </Popup>
</template>

<script setup lang="ts">
import { inputConfig } from './input.service';
import type { SelectOpcion } from './select.interface';
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
    event: 'update', // cambió el valor del input
    valor: string | null, // el valor
  ): void;

  (
    event: 'error', // el input está en estado de error de validación
    errorFlag: boolean, // true si hay un error activa
    errorMensaje: string | null, // el mensaje de error
    valor: any, // el valor que ha provocado el error
  ): void;

  (
    event: 'crearObjeto', // se ha creado un objeto via el boton [+]
    objeto: any, // el objeto creado
    pariente?: any, // si el objeto es un subdoc de un documento, el mismo documento
  ): void;
}>();

/**
 * Definicion de todos los parametros
 */

const props = withDefaults(
  defineProps<{
    // Solo declaramos onUpdate para que el @update sea obligatorio
    onUpdate: Function;

    // la lista de las opciones del select
    opciones: SelectOpcion[];

    // El titulo del input;
    // si labelAdentro esta a true, se muestra adentro, sino arriba
    label: string; // label adentro del input
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
    porDefecto?: string;

    // Una referencia que cuando cambia su valor, se actualiza el input con el mismo
    // forceWatch permite activar el watch mismo si el valor de watch no ha cambiado
    watch?: string;
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

    // formulario a incluir en el popup al hacer clic en el boton [+]
    // se puede pasar parametros para ello via dialogConfig
    dialog?: object;
    dialogConfig?: any;

    // visual
    icono?: string; // icono a mostrar adentro a la isquierda antes del label
    dense?: boolean;
    outlined?: boolean;
    filled?: boolean;
    noSlot?: boolean;

    // color para reemplazar el color por defecto
    color?: string;
  }>(),
  {
    clearable: true,
    noSlot: false,
    disable: false,
    rules: [] as Function[],
    color: null,
    filled: inputConfig.filled,
    dense: inputConfig.dense,
    outlined: inputConfig.outlined,
    clase: inputConfig.clase,
    labelAdentro: inputConfig.labelAdentro,
    forceWatch: null,
  },
);

/**
 * Definicion de las refs
 */

// ref del input para acceder a sus metodos de validacion
const inputRef = ref(null);

// la ref que contiene el valor del input
const localModel = ref<string>(props.porDefecto);

// un boolean que controla si setiene que mostrar o no el mensaje error, y
// el dicho mensaje
const errorFlag = ref<boolean>(false);
const errorMensaje = ref<string>(props.error);

// agregamos las reglas de validacion especificas
let reglasValidacion = props.rules ?? [];
if (props.requerido) {
  reglasValidacion = [
    validacion.requerido(
      typeof props.requerido === 'string' ? props.requerido : undefined,
    ),
    ...reglasValidacion,
  ];
}

// para mostrar o esconder el modal [+]
const showDialog = ref<boolean>(false);

// necesitamos pasar al select una copia de props.opciones porque la queremos poder
// filtrar segun lo que se esta buscando en el input
const listaOpciones = ref<SelectOpcion[]>(null);

// tambien necesitamos guardar una copia de las opciones originales para poder reiniciar
// el filtro ; tenemos que guardar una copia de props.opciones porque ademas
// le queremos poder agregar nuevos elementos via el boton [+]
const opcionesSrc = ref<SelectOpcion[]>(null);

/**
 * Inicializacion de las opciones
 */

onBeforeMount(async () => {
  opcionesSrc.value = props.opciones;
  listaOpciones.value = opcionesSrc.value;
});

/**
 * Activa el error con el mensaje pasado por parametro,
 * o bien lo desactiva si es null
 */

function setError(mensaje: string | null) {
  errorMensaje.value = mensaje;
  errorFlag.value = mensaje != null;
  emits('error', errorFlag.value, errorMensaje.value, localModel.value);
}

/**
 * Activa la validacíon del valor actual del input
 * y si corresponde, muestra un mensaje de error
 */

function activarValidacion() {
  for (const regla of reglasValidacion) {
    const resultado = regla(localModel.value);
    if (resultado !== true) {
      setError(resultado);
      return; // solo el primer error se manda
    }
  }
  setError(null);
}

/**
 * Este metodo se ejecuta cada vez que cambia el valor del input
 * Si el cambio no produce error de validacion, se emite el nuevo valor
 * Nota : el valor del input es un string pero el valor emitido en el evento puede ser number
 */

const handleChange = (valor: string | null) => {
  inputRef.value.resetValidation();
  activarValidacion();
  emits('update', valor);
};

/**
 * funcion de filtrar las opciones del select al buscar en el input
 */

function filterFn(valor: string, update: Function) {
  update(() => {
    const needle = valor.toLowerCase();
    const opciones = opcionesSrc.value;
    listaOpciones.value =
      valor === ''
        ? opciones
        : opciones?.filter(
            (v) => !v.disable && v.label.toLowerCase().indexOf(needle) > -1,
          );
  });
}

/**
 * metodo llamado cuando se ha creado una nueva opcion via el boton [+]
 */

const handleCrear = (objeto) => {
  listaOpciones.value = opcionesSrc.value;
  localModel.value = objeto._id;
  handleChange(objeto._id);
  showDialog.value = false;
  emits('crearObjeto', objeto);
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

const handleBlur = () => {
  // activarValidacion();
};

/**
 * Se pueden cambiar las opciones dinamicamente desde el componiente padre
 */

watch(
  () => props.opciones,
  () => {
    listaOpciones.value = props.opciones;
    opcionesSrc.value = props.opciones;
    // localModel.value = null;
    // handleClear();
  },
  { immediate: true },
);

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
  () => props.activarValidacion, // si cambia la ref validate en el componiente padre,
  () => activarValidacion(), // se activa la validacion
  { immediate: false },
);

/**
 * El input puede también recibir un valor directamente del componiente padre pasandolo
 * por la prop 'watch'. La primera vez, lo hace sin validacion.
 * La prop 'forceWatch' sirve para forzar este cambio en caso de que
 * el valor de la prop tiene que ser la misma dos veces seguida (la funcion watch solo
 * detecta los cambios reales).
 */

watch(
  () => [props.watch, props.forceWatch],
  () => {
    localModel.value = props.watch;
    activarValidacion();
    emits('update', localModel.value);
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
