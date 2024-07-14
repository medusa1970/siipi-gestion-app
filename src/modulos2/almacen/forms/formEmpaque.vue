<template>
  <q-form @submit="formSubmit">
    <!-- Marca -->
    <input-select
      label="Marca"
      :opciones="estado.marcaOpciones"
      info="Seleccione una marca entre todas las marcas que se registraron globalmente en la empresa. Si la marca que quiere agregar no existe, puede crearla via el boton [+]"
      :porDefecto="estado.dataForm.marca"
      @update="(v) => (estado.dataForm.marca = v)"
      :rules="[useRules.requerido()]"
      :disable="edicion != null"
      :dialog="formMarca"
      @payload="handleMarcaCreada"
    />

    <!-- 
    <input-select
      label="Empaques preseleccionados"
      info="La medida básica viene con nombres de empaque predefinidos, seleccione uno o creelo si no existe."
      :opciones="estado.selectTipoEmpaque"
      @update="(v) => prellenarEmpaque(v)"
      :watch="estado.resetEmpaque"
      :dialog="formTipoEmpaque"
      :dialog-param="store.producto.medida._id"
      @payload="handlePayloadTipoEmpaque"
    /> -->

    <input-text
      label="Empaque"
      @update="(v) => (estado.dataForm.nombre = v)"
      :porDefecto="estado.dataForm.nombre"
      :watch="estado.dataForm.nombre"
      info="Nombre del empaque"
      :rules="[useRules.requerido()]"
    />

    <input-text
      label="Abreviacion"
      @update="(v) => (estado.dataForm.abreviacion = v)"
      :porDefecto="estado.dataForm.abreviacion"
      :watch="estado.dataForm.abreviacion"
      info="La abreviacion debe tener entre 1 o 3 caracteres idealmente, por ejemplo TIR, DL, 12a, etc..."
      :rules="[useRules.requerido()]"
    />

    <input-text
      label="Cantidad en unidades básicas"
      @update="(v) => (estado.dataForm.cantidad = Number(v))"
      :porDefecto="estado.dataForm.cantidad"
      :watch="estado.dataForm.cantidad"
      info="Cantidad de empaques en unidades básicas"
      :rules="[useRules.requerido(), useRules.numero()]"
    />
    <q-btn :label="edicion != null ? 'Guardar' : 'Crear'" type="submit" />
  </q-form>
</template>

<script setup lang="ts">
import type { Marca } from '#gql';
import type { Empaque } from '#gql';
import type { Producto } from '#gql';
import formMarca from '@/modulos2/almacen/forms/formMarca.vue';
import formTipoEmpaque from '@/modulos2/almacen/forms/formTipoEmpaque.vue';
import type { selectOpcionCallback } from '~/components/input/select.interface';

// definicion de los emits
const emits = defineEmits<{
  (event: 'crear:empaque', empaque: Empaque, producto: Producto): void;
  (event: 'modificar:empaque', empaque: Empaque, producto: Producto): void;
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
    productoID: string;
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
});

// Inicializaciones
onMounted(async () => {
  // opciones de marcas
  let marcas = [];
  try {
    marcas = await api.buscarMarcas({});
  } catch (err) {
    errFallBack(err);
    return;
  }
  estado.marcaOpciones = marcas.map((marca) => {
    return {
      value: marca._id,
      label: marca.nombre,
    };
  });
});

// submision del formulario
const formSubmit = async () => {
  try {
    // Modo edicion
    if (props.edicion) {
      // lanzamos la consulta
      const producto = await api.modificarProducto_basico(props.productoID, {
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
        'modificar:empaque',
        producto.empaques.find((v) => v._id === props.edicion?._id),
        producto,
      );
    }

    // Modo creacion
    else {
      // lanzamos la consulta
      const producto = await api.modificarProducto_basico(props.productoID, {
        empaques: {
          agregar: [estado.dataForm],
        },
      });
      const empaque = ultimo(producto.empaques);
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);
      // mandamos el resultado al componiente pariente
      emits('crear:empaque', empaque, producto);
      // ... y especialmente para un eventual input select para insertar la nueva opcion
      emits('crear:opcion', empaque._id, empaque, (listaOpciones) => [
        ...listaOpciones,
        { label: empaque.nombre, value: empaque._id },
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

// manejar la marca creada desde el boton + del select
const handleMarcaCreada = (marca: any) => {
  console.log('marca creada via select:', marca);
  // logica para hacer algo aqui
  // tal vez se querra mandar la marca al componiente padre para
  // que él lo agregue al store, al estado o al indexdb ?
};
</script>
