<template>
  <q-select
    v-model="localModel"
    @update:model-value="handleChange"
    @filter="filterFn"
    @blur="activarValidacion"
    @clear="activarValidacion"
    :label="label + (requerido ? '*' : '')"
    :rules="rules"
    use-input
    fill-input
    hide-selected
    input-debounce="0"
    :clearable="clearable"
    :dense="dense"
    :disable="disable"
    :filled="filled"
    :outlined="outlined"
    :class="clase"
    bottom-slots
    :error="errorFlag"
    :errorMessage="errorMensaje"
    options-cover
    options-dense
    :options="listaOpciones"
    emit-value
    map-options
    :dialog="dialog"
  >
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey"> No hay resultados </q-item-section>
      </q-item>
    </template>
    <template #prepend v-if="icono">
      <q-icon :name="icono" @click.stop.prevent />
    </template>
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps" :class="scope.opt.class">
        <q-item-section>{{ scope.opt.label }}</q-item-section>
      </q-item>
    </template>
    <template #after>
      <q-btn
        v-if="dialog"
        size="12px"
        icon="add"
        color="primary"
        round
        style="height: 16px"
        @click="() => (showDialog = true)"
      ></q-btn>
      <input-botonAyuda v-if="info && info.length > 0" :mensaje="info" />
    </template>
  </q-select>

  <q-dialog v-model="showDialog">
    <q-card>
      <q-card-section class="flex justify-between">
        <div class="mt-2">Agregar un nuevo item</div>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <contenido-dialog
          :opciones="listaOpciones"
          @update:opciones="updateOpciones"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { SelectOpcion } from './select.interface';

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
    porDefecto?: string; // valor seleccionado al iniciar
    rules?: any; // reglas de validacion
    icono?: string; // icono a mostrar adentro a la isquierda antes del label
    clase?: string; // clases css o tailwind
    dialog?: object; // el componiente adentro del dialogo de agregar nuevo elemento
    activarValidacion?: boolean; // cambiar en el comp. pariente para forzar validacion
    error?: string; // cambiar en el comp. oariente para mostrar un error personalizado
    dense?: boolean;
    disable?: boolean;
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
    rules: [] as Function[],
    disable: false,
  },
);

/**
 * refs, reactives y computed
 */

const localModel = ref<string>(props.porDefecto); // contenido del input
const listaOpciones = ref<SelectOpcion[]>(props.opciones); // lista de opciones, copia de props.opciones para trabajar
const errorFlag = ref<boolean>(false); // si se tiene que mostrar o no el error
const errorMensaje = ref<string>(props.error); // el mensaje de error
const contenidoDialog = ref<object>(props.dialog); // componiente para agregar un nuevo objeto
const showDialog = ref<boolean>(false); // mostrar o esconder el dialogo de agregar objeto
const requerido = props.rules.map((rule) => rule.name).includes('requerido');

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
    const needle = valor.toLowerCase();
    const opciones = props.opciones;
    listaOpciones.value =
      valor === ''
        ? opciones
        : opciones?.filter(
            (v) => !v.disable && v.label.toLowerCase().indexOf(needle) > -1,
          );
  });
}

// agregar nuevo objeto : el resultado a agregar a las opciones del select
function updateOpciones(opciones: SelectOpcion[], posicion: number) {
  listaOpciones.value = opciones;
  localModel.value = opciones[posicion].value;
  handleChange(opciones[posicion].value);
  activarValidacion();
  showDialog.value = false;
}

/**
 * watch
 */

// update listaOpciones cuando props.opciones cambia
watch(
  () => props.opciones,
  async () => (listaOpciones.value = props.opciones),
  { immediate: false },
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
</script>
