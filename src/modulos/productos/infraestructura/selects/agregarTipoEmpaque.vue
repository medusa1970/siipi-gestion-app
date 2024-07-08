<template>
  <q-form @submit="formSubmit">
    <input-text
      label="Empaque"
      @update="(v) => (nombre.value = v)"
      info="Nombre del empaque"
      :rules="[useRules.requerido()]"
      :error="nombre.error"
    />

    <input-text
      label="Abreviacion"
      @update="(v) => (abreviacion.value = v)"
      info="La abreviacion debe tener entre 1 o 3 caracteres idealmente, por ejemplo TIR, DL, 12a, etc..."
      :rules="[useRules.requerido()]"
      :error="abreviacion.error"
    />

    <input-text
      label="Cantidad en unidades básicas"
      @update="(v) => (cantidad.value = Number(v))"
      info="Es la cantidad en stock del producto debajo de la cual se alertará para avisar que se necesita hacer un nuevo pedido al proveedor."
      :rules="[useRules.requerido(), useRules.numero()]"
    />

    <q-btn label="Crear" type="submit" />
  </q-form>
</template>

<script setup lang="ts">
/**
 * Imports
 */

import type { TipoEmpaque } from '#gql';
import type { CrearTipoEmpaqueDto } from '#gql';
import type { SelectOpcion } from '~/components/input/select.interface';
import { productoService } from '../../API/productoService';

/**
 * Eventos
 */

const emits = defineEmits<{
  (
    event: 'update:opciones',
    objeto: TipoEmpaque, // el objeto que se creó
    opciones: SelectOpcion[], // la lista de opciones puesta al día con ello
    value: String, // el valor del elemento a seleccionar (generalmente id del objeto)
  ): void;
}>();

/**
 * Props
 */

const props = withDefaults(
  defineProps<{
    opcionesPariente: SelectOpcion[];
    param: string;
  }>(),
  {},
);

/**
 * Inicializaciones
 */
const nombre = reactiveInput(null as string);
nombre.error = 'okokok';
const abreviacion = reactiveInput(null as string);
const cantidad = reactiveInput(null as number);
const medidaID = props.param;
console.log(medidaID);
nombre.error = 'okokok';
onMounted(async () => {});

/**
 * Submit
 */

const formSubmit = async (datos: any) => {
  if (!props.opcionesPariente) {
    throw 'prop opcionesPariente obligatoria';
  }

  // agregamos la categoria
  let nuevoTipoEmpaque;
  try {
    const medida = await productoService.agregarEmpaqueMedida(medidaID, {
      nombre: nombre.value,
      abreviacion: abreviacion.value,
      cantidad: cantidad.value,
    } as CrearTipoEmpaqueDto);
    nuevoTipoEmpaque = medida.tipoEmpaques.pop();
  } catch (err) {
    if (isApiBadRequest(err, 'duplicado')) {
      for (const campo of err.detalle.campos) {
        const [path] = campo;
        if (ultimo(path.split('.')) === 'nombre') {
          nombre.error = 'Este nombre ya esta registrado.';
        } else if (ultimo(path.split('.')) === 'abreviacion') {
          abreviacion.error = 'Esta abreviacion ya esta registrada.';
        }
      }
      return;
    }
    errFallBack(err);
    return;
  }
  NotifySucess(`Categoria creada con éxito`);

  // la nueva opcion que insertaremos en la lista
  const nuevaOpcion = {
    label: nuevoTipoEmpaque.nombre,
    value: nuevoTipoEmpaque._id,
    disable: false,
    class: 'option',
  };

  // buscamos el index donde la insertaremos (antes de la categoria de nivel superior que sigue el pariente)
  const opt = clone(props.opcionesPariente);
  opt.push(nuevaOpcion);
  emits('update:opciones', nuevoTipoEmpaque, opt, nuevoTipoEmpaque._id);
};
</script>
