<template>
  <q-form @submit="formSubmit">
    <!-- Marca -->
    <input-select
      label="Marca"
      :opciones="selectMarca"
      info="Info #33"
      :porDefecto="estado.dataForm.marca"
      @update="(v) => (estado.dataForm.marca = v)"
      :rules="[useRules.requerido()]"
      :error="estado.errorMarca"
      :disable="edicion != null"
      :dialog="formMarca"
    />

    <!-- Stock minimo -->
    <p>Alerta de cantidad baja en el stock</p>
    <div class="flex">
      <input-text
        class="flex-grow"
        style="margin-right: 16px"
        label="Primer aviso"
        info="Info #34"
        tipo="number"
        :porDefecto="estado.dataForm.cantidadLimite?.[0] ?? 0"
        @update="(v) => (estado.dataForm.cantidadLimite[0] = v)"
        requerido
      />
      <input-text
        class="flex-grow"
        style="margin-left: 16px"
        tipo="number"
        label="Segundo aviso"
        info="Info #35"
        :porDefecto="estado.dataForm.cantidadLimite?.[1] ?? 0"
        @update="(v) => (estado.dataForm.cantidadLimite[1] = v)"
        requerido
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
        :porDefecto="estado.dataForm.inventarioLimite?.[0] ?? 0"
        @update="(v) => (estado.dataForm.inventarioLimite[0] = v)"
        requerido
      />

      <input-text
        class="flex-grow"
        style="margin-left: 16px"
        tipo="number"
        label="Avisar X días antes"
        info="Info #37"
        :porDefecto="estado.dataForm.inventarioLimite?.[1]"
        @update="(v) => (estado.dataForm.inventarioLimite[1] = v)"
        requerido
      />
    </div>

    <!-- Cantidad max en un pedido -->
    <input-text
      label="Cantidad maxima"
      tipo="number"
      :porDefecto="estado.dataForm.cantidadMaxPedido"
      @update="(v) => (estado.dataForm.cantidadMaxPedido = v)"
      requerido
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
  cantidadLimite: props.edicion?.cantidadLimite ?? [0, 0],
  inventarioLimite: props.edicion?.inventarioLimite ?? [0, 0],
  cantidadMaxPedido: props.edicion?.cantidadMaxPedido ?? 0,
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
      estado.dataForm.cantidadLimite = {
        reemplazar: estado.dataForm.cantidadLimite,
      };
      estado.dataForm.inventarioLimite = {
        reemplazar: estado.dataForm.inventarioLimite,
      };
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
