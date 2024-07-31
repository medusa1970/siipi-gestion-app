<template>
  <q-form @submit="formSubmit">
    <!-- Marca -->
    <input-select
      label="Marca"
      :opciones="selectMarca"
      info="Info #33"
      :porDefecto="estado.dataForm.marca"
      @update="(v) => (estado.dataForm.marca = v)"
      :error="estado.errorMarca"
      :disable="edicion != null"
      :dialog="formMarca"
      requerido
    />

    <!-- Stock minimo -->
    <p>Alerta de cantidad baja en el stock</p>
    <div class="flex">
      <input-text
        class="flex-grow"
        style="margin-right: 16px"
        label="Avisar a la cantidad X"
        info="Info #34"
        tipo="number"
        :porDefecto="estado.dataForm.cantidadAvisoFuerte"
        @update="(v) => (estado.dataForm.cantidadAvisoFuerte = v)"
      />
      <input-text
        class="flex-grow"
        style="margin-left: 16px"
        tipo="number"
        label="Avisar a la cantidad Y"
        info="Info #35"
        :porDefecto="estado.dataForm.cantidadAvisoSuave"
        @update="(v) => (estado.dataForm.cantidadAvisoSuave = v)"
      />
    </div>

    <!-- Stock minimo -->
    <p>Cada cuantos días se tiene que inventariar?</p>
    <div class="flex">
      <input-text
        class="flex-grow"
        style="margin-right: 16px"
        tipo="number"
        label="Inventariar cada X días"
        info="Info #36"
        :porDefecto="estado.dataForm.inventarioPeriodo"
        @update="(v) => (estado.dataForm.inventarioPeriodo = v)"
      />
      <input-text
        class="flex-grow"
        style="margin-left: 16px"
        tipo="number"
        label="Avisar Y días antes"
        info="Info #37"
        :porDefecto="estado.dataForm.inventarioAviso"
        @update="(v) => (estado.dataForm.inventarioAviso = v)"
      />
    </div>

    <!-- Cantidad max en un pedido -->
    <input-text
      label="Cantidad maxima"
      tipo="number"
      :porDefecto="estado.dataForm.cantidadMaxPedido"
      @update="(v) => (estado.dataForm.cantidadMaxPedido = v)"
      info="Info #38"
    />

    <!-- Submit -->
    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import type { Variedad } from '#gql';
import formMarca from '@/modulos/almacen/forms/formMarca.vue';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';
const { store } = useAlmacen();

// definicion de los emits
const emits = defineEmits(['crearObjeto', 'modificarObjeto']);

// definicion de los props
const props = withDefaults(
  defineProps<{
    edicion?: Variedad;
  }>(),
  {
    edicion: null,
  },
);

// datos por defecto del formulario
const initForm = {
  marca: props.edicion?.marca._id,
  inventarioPeriodo: props.edicion?.inventarioPeriodo,
  inventarioAviso: props.edicion?.inventarioAviso,
  cantidadAvisoFuerte: props.edicion?.cantidadAvisoFuerte,
  cantidadAvisoSuave: props.edicion?.cantidadAvisoSuave,
  cantidadMaxPedido: props.edicion?.cantidadMaxPedido,
};

// definicion del estado
const estado = reactive({
  dataForm: clone(initForm),
  errorMarca: '',
});

// opciones
const selectMarca = computed(() => {
  if (!store.marcas) return [];
  return store.marcas.map((marca) => ({
    value: marca._id,
    label: marca.nombre,
  }));
});

// Inicializaciones
onMounted(async () => {
  await store.getMarcas();
});

// submision del formulario
const formSubmit = async () => {
  try {
    if (props.edicion) {
      const producto = await api.modificarProducto_basico(store.producto._id, {
        variedades: {
          buscar: {
            _id: [props.edicion._id],
          },
          modificar: estado.dataForm,
        },
      });
      emits(
        'modificarObjeto',
        producto.variedades.find((v) => v._id === props.edicion?._id),
        producto,
      );
    } else {
      const producto = await api.modificarProducto_basico(store.producto._id, {
        variedades: {
          agregar: [estado.dataForm],
        },
      });
      emits('crearObjeto', ultimo(producto.variedades), producto);
    }
  } catch (err) {
    if (isApiBadRequest(err, 'duplicado')) {
      estado.errorMarca = 'Esta marca ya esta registrada';
      return;
    }
    errFallBack(err);
    return;
  }
  await store.refreshProductos();
  estado.dataForm = clone(initForm);
};
</script>
