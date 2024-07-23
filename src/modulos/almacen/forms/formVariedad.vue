<template>
  <q-form @submit="formSubmit">
    <!-- Marca -->
    <input-select2
      label="Marca"
      :opciones="selectMarca"
      info="Seleccione una marca entre todas las marcas que se registraron globalmente en la empresa. Si la marca que quiere agregar no existe, puede crearla via el boton [+]"
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
      <input-text2
        style="width: 45%"
        tipo="number"
        label="Primer aviso"
        :porDefecto="estado.dataForm.cantidadLimite?.[0] ?? 0"
        @update="(v) => (estado.dataForm.cantidadLimite[0] = v)"
        :rules="[useRules.requerido()]"
      />
      <input-text2
        style="width: 55%"
        tipo="number"
        label="Segundo aviso"
        :porDefecto="estado.dataForm.cantidadLimite?.[1] ?? 0"
        @update="(v) => (estado.dataForm.cantidadLimite[1] = v)"
        :rules="[useRules.requerido()]"
        info="Cuando el stock del producto baja debajo del primer valor, se lanzara una alerta naranja, y una alerta roja cuando baje debajo del segundo valor."
      />
    </div>

    <!-- Stock minimo -->
    <p>Alerta de que hay que inventariar</p>
    <div class="flex">
      <input-text2
        style="width: 45%"
        tipo="number"
        label="Primer aviso"
        :porDefecto="estado.dataForm.inventarioLimite?.[0] ?? 0"
        @update="(v) => (estado.dataForm.inventarioLimite[0] = v)"
        :rules="[useRules.requerido()]"
      />

      <input-text2
        style="width: 55%"
        tipo="number"
        label="Segundo aviso"
        :porDefecto="estado.dataForm.inventarioLimite?.[1]"
        @update="(v) => (estado.dataForm.inventarioLimite[1] = v)"
        :rules="[useRules.requerido()]"
        info="Despues de hacer un inventario, cuando pasan el numero de días indicado en el primero campo, se mandara un recordatorio naranja, y un recordatorio rojo cuando pasan el numero de días indicado en el segundo campo."
      />
    </div>

    <!-- Cantidad max en un pedido -->
    <input-text2
      label="Cantidad maxima"
      tipo="number"
      :porDefecto="estado.dataForm.cantidadMaxPedido"
      @update="(v) => (estado.dataForm.cantidadMaxPedido = v)"
      :rules="[useRules.requerido()]"
      info="Para evitar errores como el million de Pinias =)"
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
    edicion: Variedad | null;
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
