<template>
  <q-form @submit="formSubmit">
    <!-- nombre -->
    <input-text
      label="Nombre"
      :porDefecto="estado.dataForm.nombre"
      @update="(v) => (estado.dataForm.nombre = v)"
      requerido
      :error="estado.errorNombre"
    />
    <!-- abreviacion -->
    <input-text
      label="Abreviacion"
      :porDefecto="estado.dataForm.abreviacion"
      @update="(v) => (estado.dataForm.abreviacion = v)"
      requerido
      :error="estado.errorAbreviacion"
    />
    <!-- cantidad -->
    <input-text
      label="Cantidad"
      tipo="number"
      :porDefecto="estado.dataForm.cantidad"
      @update="(v) => (estado.dataForm.cantidad = v)"
      requerido
    />

    <!-- Submit -->
    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import type { TipoEmpaque } from "#gql";
import type { SelectOpcion } from "~/components/input/select.interface";
import { useAlmacen } from "~/modulos/almacen/almacen.composable";
const { store } = useAlmacen();

// definicion de los emits
const emits = defineEmits(["crearObjeto", "modificarObjeto"]);

// definicion de los props
const props = withDefaults(
  defineProps<{
    edicion?: TipoEmpaque;
  }>(),
  {
    edicion: null,
  }
);

// datos por defecto del formulario
const initForm = {
  nombre: props.edicion?.nombre,
  abreviacion: props.edicion?.nombre,
  cantidad: props.edicion?.cantidad,
};

// definicion del estado
const estado = reactive({
  dataForm: clone(initForm),
  errorNombre: "",
  errorAbreviacion: "",
});

// Inicializaciones
onMounted(async () => {});

// submision del formulario
const formSubmit = async () => {
  try {
    // Modo edicion
    if (props.edicion) {
      const medida = await api.modificarMedida(store.producto.medida._id, {
        tipoEmpaques: {
          buscar: {
            _id: [props.edicion?._id],
          },
          modificar: estado.dataForm,
        },
      });
      emits(
        "modificarObjeto",
        medida.tipoEmpaques.find((v) => v._id === props.edicion?._id),
        medida
      );
    }

    // Modo creacion
    else {
      // lanzamos la consulta
      const medida = await api.modificarMedida(store.producto.medida._id, {
        tipoEmpaques: {
          agregar: [estado.dataForm],
        },
      });
      emits("crearObjeto", ultimo(medida.tipoEmpaques), medida);
    }
  } catch (err) {
    if (isApiBadRequest(err, "duplicado")) {
      for (const campo of err.detalle.campos) {
        const [path] = campo;
        if (ultimo(path.split(".")) === "nombre") {
          estado.errorNombre = "Este nombre ya esta registrado.";
        } else if (ultimo(path.split(".")) === "abreviacion") {
          estado.errorAbreviacion = "Esta abreviacion ya esta registrada.";
        }
      }
      return;
    }
    errFallBack(err);
    return;
  }
  await store.refreshMedidas();
  estado.dataForm = clone(initForm);
};
</script>
