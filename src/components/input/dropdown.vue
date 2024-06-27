<template>
  <q-select
    v-model="localModel"
    ref="localRef"
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
    outlined
    :clearable="clearable"
    :dense="dense"
    :class="clase"
    bottom-slots
    :error="error"
    :errorMessage="errorMsg"
    options-cover
    options-dense
    :options="displayOpts"
    emit-value
    map-options
    :componienteAdd="componienteAdd"
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
      <q-item
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
        :class="scope.opt.class"
      >
        <q-item-section>{{ scope.opt.label }}</q-item-section>
      </q-item>
    </template>
    <template #after>
      <q-btn
        v-if="componienteAdd"
        size="12px"
        icon="add"
        color="primary"
        round
        style="height: 16px"
        @click="showAdd"
      ></q-btn>
      <input-botonAyuda v-if="info && info.length > 0" :mensaje="info" />
    </template>
  </q-select>

  <q-dialog v-model="showAddOpt">
    <q-card>
      <q-card-section class="flex justify-between">
        <div class="mt-2">Agregar un nuevo item</div>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <formulario-agregar
          @crear:objeto="
            (o) => {
              objetoCreado = o;
              showAddOpt = false;
            }
          "
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
const props = defineProps({
  options: Array, // lista de opciones para inicializar la lista, del tipo :
  // [{
  //   label: String;
  //   value: String;
  //   disable: Boolean;
  // }]
  default: { type: String, default: '' }, // el valor inicial del input
  label: { type: String, default: null }, // el label que aparece adentro
  hint: { type: String, default: null }, // texto de ayuda debajo del input
  info: { type: String, default: null }, // el texto del boton de informacion
  rules: { type: Array, default: [] }, // las reglas de validacion
  icono: { type: String, default: null }, // el icono en prepend
  errorMessage: { type: String, default: null }, // msj de error desde el componiente padre
  clearable: { type: Boolean, default: false }, // una cruz para vaciar el campo
  dense: { type: Boolean, default: false }, // mas compacto
  clase: { type: Boolean, default: false }, // clase css / tailwind a aplicar al input
  // validate: Boolean, // para activar la validacion desde el componiente padre
});

// refs
const localModel = ref(props.default); // contenido del input
const localRef = ref(null); // referencia del input
const error = ref(false); // si se tiene que mostrar o no el error
const errorMsg = ref(props.errorMessage); // el mensaje de error

// ref para la lista de opciones que el select ocupa
const displayOpts = ref(props.options); // trabajamos con una copia del prop para poder filtrar
watch(
  () => props.options, // si cambia el prop en el componiente padre,
  async () => (displayOpts.value = props.options), // lo ponemos al dia aqui
  { immediate: false },
);
const defaultOption = props.options // seteamos la opcion por defecto
  .find((option) => option.value === props.default);

// computed
const requerido = props.rules // para saber si el input es requerido
  .map((rule) => rule.name)
  .includes('requerido');

// declaracion de los eventos
const emits = defineEmits(['update', 'error']);

// llamado cuando cambia el valor del input
const handleChange = (newValue, oldValue) => {
  activarValidacion(); // activar la validacion con el valor actual del input
  emits('update', newValue, oldValue); // emitir el cambio al componiente padre
};

// activar o desactivar el modo de error para el input
function setError(mensaje) {
  errorMsg.value = mensaje; // setear el mensaje de error, o resetear todo si es null
  error.value = mensaje !== null; // activar el error
  emits('error', error.value); // emitir el error al componiente padre
}

// activar la validacíon del valor actual del input
function activarValidacion() {
  for (const regla of props.rules) {
    // para cada regla:
    const resultado = regla(localModel.value); // aplicar la regla al valor actual
    if (resultado !== true) {
      setError(resultado); // mandar el error
      return; // solo el primer error se manda
    }
  }
  setError(null); // todas las reglas han pasado, reseteamos el error
}

// recibiendo un mensaje de error desde el componiente padre
watch(
  () => props.errorMessage, // si cambia el ref en el componiente padre,
  () => setError(props.errorMessage), // activamos el error
);

// filtrar las opciones al entrar un valor en el input
function filterFn(val, update) {
  update(() => {
    const needle = val.toLowerCase(); // filtramos sin distinguir entre mayusc. y minusc.
    displayOpts.value =
      val === ''
        ? props.options // si no hay valor, se muestran todas las opciones
        : props.options.filter(
            (v) => !v.disabled && v.label.toLowerCase().indexOf(needle) > -1,
          );
  });
}

// formulario agregar
const formularioAgregar = ref(props.componienteAdd); // el componiente a cargar
const objetoCreado = ref(null); //el resultado a agregar a las opciones del select
const showAddOpt = ref(false); // mostrar el dialog de agregar nuevo elto
function showAdd() {
  showAddOpt.value = true;
}

// recepcion del objeto creado desde el componiente en el dialog
watch(objetoCreado, async () => {
  const insert = {
    // el objeto que se insertara en la lista de opciones
    label: objetoCreado.value.nombre,
    value: objetoCreado.value._id,
    disable: false,
  };

  // especificar un lugar especifico donde insertar en la lista
  const insertarAntesDe = objetoCreado.value.insertarAntesDe;
  const index = insertarAntesDe // buscamos el index donde insertar
    ? displayOpts.value.findIndex((c) => c.value === insertarAntesDe)
    : displayOpts.value.length; // si no se especifico nada, se inserta al final
  displayOpts.value.splice(index, 0, insert); // insertamos el objeto
  localModel.value = displayOpts.value[index]; // y seleccionamos el nuevo elemento
});

// // validacion desde el componiente padre
// watch(
//   () => props.validate, // si cambia la ref validate en el componiente padre,
//   () => activarValidacion(), // se activa la validacion
//   { immediate: false },
// );
</script>
