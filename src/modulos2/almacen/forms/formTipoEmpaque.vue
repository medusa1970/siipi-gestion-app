<template>
  <q-form @submit="formSubmit">
    <!-- nombre -->
    <input-text
      label="Nombre"
      :porDefecto="estado.dataForm.nombre"
      @update="(v) => (estado.dataForm.nombre = v)"
      :rules="[useRules.requerido()]"
      :error="estado.errorNombre"
    />
    <!-- abreviacion -->
    <input-text
      label="Abreviacion"
      :porDefecto="estado.dataForm.abreviacion"
      @update="(v) => (estado.dataForm.abreviacion = v)"
      :rules="[useRules.requerido()]"
      :error="estado.errorAbreviacion"
    />
    <!-- cantidad -->
    <input-text
      label="Cantidad"
      :porDefecto="estado.dataForm.cantidad"
      @update="(v) => (estado.dataForm.cantidad = Number(v))"
      :rules="[useRules.requerido()]"
    />

    <q-btn :label="edicion != null ? 'Guardar' : 'Crear'" type="submit" />
  </q-form>
</template>

<script setup lang="ts">
import type { TipoEmpaque } from '#gql';
import type { Medida } from '#gql';
import type { selectOpcionCallback } from '~/components/input/select.interface';

// definicion de los emits
const emits = defineEmits<{
  (event: 'crear:tipoEmpaque', tipoEmpaque: TipoEmpaque, medida: Medida): void;
  (
    event: 'modificar:tipoEmpaque',
    tipoEmpaque: TipoEmpaque,
    medida: Medida,
  ): void;
  (
    event: 'crear:opcion',
    valor: string,
    objeto: any,
    callback: selectOpcionCallback,
  ): void;
}>();

// definicion de los props
const props = withDefaults(
  defineProps<{
    medidaID: string;
    edicion: TipoEmpaque | null;
  }>(),
  {
    edicion: null,
  },
);

// datos por defecto del formulario
const initForm = {
  nombre: props.edicion?.nombre ?? '',
  abreviacion: props.edicion?.nombre ?? '',
  cantidad: props.edicion?.cantidad ?? '',
};

// definicion del estado
const estado = reactive({
  // valor de los inputs
  dataForm: clone(initForm),
  //mensajes de error del formulario
  errorNombre: '',
  errorAbreviacion: '',
});

// Inicializaciones
onMounted(async () => {
  // nada todavia
});

// submision del formulario
const formSubmit = async () => {
  try {
    // Modo edicion
    if (props.edicion) {
      // lanzamos la consulta
      estado.dataForm.cantidadLimite = {
        reemplazar: estado.dataForm.cantidadLimite,
      };
      estado.dataForm.inventarioLimite = {
        reemplazar: estado.dataForm.inventarioLimite,
      };
      const medida = await api.modificarMedida(props.medidaID, {
        tipoEmpaques: {
          buscar: {
            _id: [props.edicion?._id],
          },
          modificar: estado.dataForm,
        },
      });
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);
      // mandamos el resultado al componiente pariente
      emits(
        'modificar:tipoEmpaque',
        medida.tipoEmpaques.find((v) => v._id === props.edicion?._id),
        medida,
      );
    }

    // Modo creacion
    else {
      // lanzamos la consulta
      const medida = await api.modificarMedida(props.medidaID, {
        tipoEmpaques: {
          agregar: [estado.dataForm],
        },
      });
      const tipoEmpaque = ultimo(medida.tipoEmpaques);
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);
      // mandamos el resultado al componiente pariente
      emits('crear:tipoEmpaque', tipoEmpaque, medida);
      // ... y especialmente para un eventual input select para insertar la nueva opcion
      emits('crear:opcion', tipoEmpaque._id, tipoEmpaque, (listaOpciones) => [
        ...listaOpciones,
        { label: tipoEmpaque.nombre, value: tipoEmpaque._id },
      ]);
    }
  } catch (err) {
    if (isApiBadRequest(err, 'duplicado')) {
      for (const campo of err.detalle.campos) {
        const [path] = campo;
        if (ultimo(path.split('.')) === 'nombre') {
          estado.errorNombre = 'Este nombre ya esta registrado.';
        } else if (ultimo(path.split('.')) === 'abreviacion') {
          estado.errorAbreviacion = 'Esta abreviacion ya esta registrada.';
        }
      }
      return;
    }
    errFallBack(err);
    return;
  }
};
</script>
