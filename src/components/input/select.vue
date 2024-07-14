<template>
  <q-select
    v-model="localModel"
    @update:model-value="handleChange"
    @filter="filterFn"
    @blur="activarValidacion"
    @clear="activarValidacion"
    :label="label + (requerido ? '*' : '')"
    :rules="rules"
    input-debounce="0"
    :clearable="clearable"
    :dense="dense"
    :disable="disable"
    :filled="filled"
    :outlined="outlined"
    :class="clase"
    :bottom-slots="!noSlot"
    :error="noSlot ? undefined : errorFlag"
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
  >
    <q-tooltip
      v-model="tooltip"
      class="text-white text-sm bg-blue-9"
      style="pointer-events: none"
      anchor="bottom middle"
      self="top middle"
      :offset="[0, 5]"
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
      <q-icon name="help" @click="tooltip = !tooltip" />
    </template>
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps" :class="scope.opt.class">
        <q-item-section>{{ scope.opt.label }}</q-item-section>
      </q-item>
    </template>
  </q-select>

  <popup v-model="showDialog" titulo="Agregar un nuevo item">
    <template #body>
      <contenido-dialog @crear:opcion="handleCrearOpcion" />
    </template>
  </popup>
</template>

<script setup lang="ts">
import type { CrearOpcionEvent } from './select.interface';
import type { SelectOpcion, selectOpcionCallback } from './select.interface';
import { ref } from 'vue';

/**
 * Tooltip
 */
const tooltip = ref(false);
const hideTooltip = (seconds = 3) =>
  setTimeout(() => (tooltip.value = false), seconds * 1000);

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
    errorMensaje: string | null,
  ): void;
  (
    // cambió el valor del input
    event: 'payload',
    payload: Array<any>,
  ): void;
}>();

/**
 * props
 */
const props = withDefaults(
  defineProps<{
    onUpdate: Function; // para que el @update sea obligatorio
    opciones: SelectOpcion[]; // lista de opciones del select
    label: string; // label adentro del input
    hint?: string; // texto de ayuda debajo del input
    info?: string; // texto de ayuda en el boton de ayuda
    porDefecto?: any; // valor seleccionado al iniciar
    watch?: string; // ref de la cual se hara un watch de los cambios para cambiar el input
    rules?: any; // reglas de validacion
    icono?: string; // icono a mostrar adentro a la isquierda antes del label
    clase?: string; // clases css o tailwind
    dialog?: object; // el componiente adentro del dialogo de agregar nuevo elemento
    dialogParam?: any; // el componiente adentro del dialogo de agregar nuevo elemento
    activarValidacion?: boolean; // cambiar en el comp. pariente para forzar validacion
    error?: string; // cambiar en el comp. oariente para mostrar un error personalizado
    dense?: boolean;
    disable?: boolean;
    outlined?: boolean;
    filled?: boolean;
    clearable?: boolean;
    noSlot: boolean;
  }>(),
  {
    outlined: true,
    // filled: true,
    dense: true,
    clearable: true,
    noSlot: false,
    clase: '',
    rules: [] as Function[],
    disable: false,
  },
);

/**
 * refs, reactives y computed
 */

const localModel = ref<string>(props.porDefecto); // contenido del input
const opcionesSrc = ref<SelectOpcion[]>(null); // lista de opciones de referencia, copiada de las props para poder ser modificable
const listaOpciones = ref<SelectOpcion[]>(null); // lista de opciones que se filtrara y se mostrara, diferente de opsionesSrc para no sobreescribir las modificaciones
const errorFlag = ref<boolean>(false); // si se tiene que mostrar o no el error
const errorMensaje = ref<string>(props.error); // el mensaje de error
const contenidoDialog = ref<object>(props.dialog); // componiente para agregar un nuevo objeto
const showDialog = ref<boolean>(false); // mostrar o esconder el dialogo de agregar objeto
const requerido = props.rules.map((rule) => rule.name).includes('requerido');

onBeforeMount(async () => {
  opcionesSrc.value = props.opciones;
  listaOpciones.value = opcionesSrc.value;
});

/**
 * metodos
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
  for (const regla of props.rules) {
    const resultado = regla(localModel.value);
    if (resultado !== true) {
      setError(resultado);
      return; // solo el primer error se manda
    }
  }
  setError(null);
}

// metodo llamado cuando el valor del input cambia
const handleChange = (valor: string | null) => {
  activarValidacion(); // activar la validacion con el valor actual del input
  emits('update', valor); // emitir el cambio al componiente padre
};

// al entrar un valor en el input, filtra las opciones (no-case)
function filterFn(valor: string, update: Function) {
  update(() => {
    // BUG incompatible con crear:opcion
    // porque despues de crear:opcion, reinicializa listaOpciones a props.opciones
    // y eso sobreescriobe el cambio
    const needle = valor.toLowerCase();
    const opciones = opcionesSrc.value;
    // opcionesSrc.value && opcionesSrc.value.length > 0
    //   ? opcionesSrc.value
    //   : props.opciones;
    console.log(opcionesSrc.value);
    listaOpciones.value =
      valor === ''
        ? opciones
        : opciones?.filter(
            (v) => !v.disable && v.label.toLowerCase().indexOf(needle) > -1,
          );
  });
}

// Se ha creado una nueva opcion via el boton [+]
const handleCrearOpcion: CrearOpcionEvent = (
  valor: string,
  objeto: any,
  mutarOpciones: selectOpcionCallback,
) => {
  // el componiente hijo se encarga de insertar la nueva opcion en la lista
  opcionesSrc.value = mutarOpciones(opcionesSrc.value);
  listaOpciones.value = opcionesSrc.value;
  // seleccionamos la nueva opcion
  localModel.value = valor;
  // actualizamos
  handleChange(valor);
  // cerramos el dialog
  showDialog.value = false;
  // mandamos el objeto creado al componiente padre por si tiene algo que hacer con el
  emits('payload', objeto);
};

/**
 * watch
 */

// update opcionesSrc cuando props.opciones cambia
watch(
  () => props.opciones,
  () => {
    listaOpciones.value = props.opciones;
    opcionesSrc.value = props.opciones;
  },
  { immediate: true },
);

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
    localModel.value = props.watch;
    activarValidacion();
  },
  { immediate: false },
);
</script>
