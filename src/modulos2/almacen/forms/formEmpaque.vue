<template>
  <q-form @submit="formSubmit">
    <!-- Marca -->
    <input-select2
      label="Marca"
      :opciones="estado.marcaOpciones"
      info="Seleccione una marca entre todas las marcas que se registraron globalmente en la empresa. Si la marca que quiere agregar no existe, puede crearla via el boton [+]"
      :porDefecto="estado.dataForm.marca"
      @update="(v) => (estado.dataForm.marca = v)"
      :rules="[useRules.requerido()]"
      :disable="edicion != null"
      :dialog="formVariedad"
    />

    <input-select2
      label="Empaques preseleccionados"
      info="La medida básica viene con nombres de empaque predefinidos, seleccione uno o creelo si no existe."
      :opciones="estado.tipoEmpaqueOpciones"
      @update="(v) => prellenarEmpaque(v)"
      :watch="estado.resetEmpaque"
      :dialog="formTipoEmpaque"
      :dialogConfig="store.producto.medida._id"
      @CrearObjeto="handleCrearTipoEmpaque"
    />

    <input-text2
      label="Empaque"
      @update="(v) => (estado.dataForm.nombre = v)"
      :porDefecto="estado.dataForm.nombre"
      :watch="estado.dataForm.nombre"
      info="Nombre del empaque"
      :rules="[useRules.requerido()]"
    />

    <input-text2
      label="Abreviacion"
      @update="(v) => (estado.dataForm.abreviacion = v)"
      :porDefecto="estado.dataForm.abreviacion"
      :watch="estado.dataForm.abreviacion"
      info="La abreviacion debe tener entre 1 o 3 caracteres idealmente, por ejemplo TIR, DL, 12a, etc..."
      :rules="[useRules.requerido()]"
    />

    <input-text2
      label="Cantidad en unidades básicas"
      @update="(v) => (estado.dataForm.cantidad = Number(v))"
      :porDefecto="estado.dataForm.cantidad"
      :watch="estado.dataForm.cantidad"
      info="Cantidad de empaques en unidades básicas"
      :rules="[useRules.requerido(), useRules.numero()]"
    />

    <!-- Submit -->
    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import type { Empaque } from '#gql';
import formVariedad from '@/modulos2/almacen/forms/formVariedad.vue';
import type { SelectOpcion } from '~/components/input/select.interface';
import { useAlmacen } from '~/modulos2/almacen/almacen.composable';
import formTipoEmpaque from '@/modulos2/almacen/forms/formTipoEmpaque.vue';
const { store } = useAlmacen();

// definicion de los emits
const emits = defineEmits(['crearObjeto', 'modificarObjeto']);

// definicion de los props
const props = withDefaults(
  defineProps<{
    edicion: Empaque | null;
  }>(),
  {
    edicion: null,
  },
);

// datos por defecto del formulario
const initForm = {
  marca: props.edicion?.marca._id ?? '',
  nombre: props.edicion?.nombre ?? '',
  abreviacion: props.edicion?.abreviacion ?? '',
  cantidad: props.edicion?.cantidad ?? '',
};

// definicion del estado
const estado = reactive({
  // valor de los inputs
  dataForm: clone(initForm),
  //mensajes de error del formulario
  errorNombre: '',
  errorAbreviacion: '',
  // lista de opciones para el select de marcas
  marcaOpciones: [],
  // tipos de empaque para el select de tipos
  tipoEmpaqueOpciones: [],
  resetEmpaque: '',
});

// Inicializaciones
onMounted(async () => {
  estado.tipoEmpaqueOpciones = store.producto.medida.tipoEmpaques.map(
    (tipo) => ({
      value: tipo._id,
      label: tipo.nombre,
    }),
  );
  estado.marcaOpciones = store.producto.variedades.map((variedad) => ({
    value: variedad.marca._id,
    label: variedad.marca.nombre,
  }));
});

// submision del formulario
const formSubmit = async () => {
  try {
    // Modo edicion
    if (props.edicion) {
      // lanzamos la consulta
      const producto = await api.modificarProducto_basico(store.producto._id, {
        empaques: {
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
        'modificarObjeto',
        producto.empaques.find((v) => v._id === props.edicion?._id),
        producto,
      );
    }

    // Modo creacion
    else {
      // lanzamos la consulta
      const producto = await api.modificarProducto_basico(store.producto._id, {
        empaques: {
          agregar: [estado.dataForm],
        },
      });
      const empaque = ultimo(producto.empaques);
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);
      // mandamos el resultado al componiente pariente
      emits('crearObjeto', empaque, {
        pariente: producto,
        selectValor: empaque._id,
        selectCallback: (listaOpciones: SelectOpcion[]): SelectOpcion[] => [
          ...listaOpciones,
          { label: empaque.nombre, value: empaque._id },
        ],
      });
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

// Prellenar el empaque con seleccionar un tipo de empaque
const prellenarEmpaque = async (empaqueId) => {
  const empaque = store.producto.medida.tipoEmpaques.find(
    (tipoE) => tipoE._id === empaqueId,
  );
  if (!empaque) {
    return false;
  }
  estado.resetEmpaque = 'Eligido ' + (empaque.nombre ?? '');
  estado.dataForm.nombre = empaque.nombre;
  estado.dataForm.abreviacion = empaque.abreviacion;
  estado.dataForm.cantidad = empaque.cantidad;
  await setTimeout(() => {
    estado.resetEmpaque = null;
  }, 1500);
};

// se ha creado un empaque
const handleCrearTipoEmpaque = (v) => {
  store.producto.medida.tipoEmpaques.push(v);
  prellenarEmpaque(v._id);
};
</script>
