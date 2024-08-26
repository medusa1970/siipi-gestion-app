<template>
  <q-form @submit="formSubmit">
    <!-- Marca -->
    <input-select
      label="Marca"
      :opciones="selectMarca"
      info="Seleccione la marca del producto, si la marca no existe, puede crearla con el boton (+)"
      :porDefecto="estado.dataForm.marca"
      @update="v => (estado.dataForm.marca = v)"
      requerido
      :error="estado.errorMarca"
      :disable="edicion != null"
      :dialog="formMarca" />

    <!-- Stock minimo -->
    <p>Alerta de cantidad baja en el stock</p>
    <div class="flex">
      <input-text
        class="flex-grow"
        style="margin-right: 16px"
        tipo="number"
        label="Avisar a la cantidad Y"
        info="Ingrese la cantidad mínima crítica del producto. Ejemplo: Si en el primer campo coloco 1000, aquí puede colocar 500. El sistema alertará si el stock es igual o menor a esta cantidad."
        :porDefecto="estado.dataForm.cantidadAvisoSuave"
        @update="v => (estado.dataForm.cantidadAvisoSuave = v)" />
      <input-text
        class="flex-grow"
        style="margin-left: 16px"
        label="Avisar a la cantidad X"
        info="Ingrese la cantidad mínima que debe existir del producto en su unidad básica. Ejemplo: Si desea que el sistema avise cuando quede 1 caja de vasos desechables (1000 unidades), coloque 1000."
        tipo="number"
        :porDefecto="estado.dataForm.cantidadAvisoFuerte"
        @update="v => (estado.dataForm.cantidadAvisoFuerte = v)" />
    </div>

    <!-- Stock minimo -->
    <p>Cada cuantos días se tiene que inventariar?</p>
    <div class="flex">
      <input-text
        class="flex-grow"
        style="margin-right: 16px"
        tipo="number"
        label="Inventariar cada X días"
        info="Despues de hacer un inventario, despues de cuantos dias se deberia volver a realizar otro inventario."
        :porDefecto="estado.dataForm.inventarioPeriodo"
        @update="v => (estado.dataForm.inventarioPeriodo = v)" />
      <input-text
        class="flex-grow"
        style="margin-left: 16px"
        tipo="number"
        label="Avisar Y días antes"
        info="Ingrese la cantidad de dias que desea que el sistema le bote una alerta antes de la fecha de inventario. Ejemplo: Si en el primer campo coloco 10, aqui se puede colocar 2. El sistema avisara despues de 8 dias que la fecha del inventario se acerca."
        :porDefecto="estado.dataForm.inventarioAviso"
        @update="v => (estado.dataForm.inventarioAviso = v)" />
    </div>

    <!-- Cantidad max en un pedido -->
    <input-text
      label="Cantidad maxima"
      tipo="number"
      :porDefecto="estado.dataForm.cantidadMaxPedido"
      @update="v => (estado.dataForm.cantidadMaxPedido = v)"
      info="Ingrese la cantidad máxima permitida del producto. Ejemplo: Si normalmente se piden 10 cajas de vasos, pero pueden pedir hasta 20, coloque su equivalente a unidades, es decir 20,000." />

    <!-- Submit -->
    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import type { Producto } from '#gql';
import type { Variedad } from '#gql';
import formMarca from '@/modulos/almacen/forms/formMarca.vue';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';
const { store } = useAlmacen();

// definicion de los emits
const emits = defineEmits(['crearObjeto', 'modificarObjeto']);

// definicion de los props
const props = withDefaults(
  defineProps<{
    config: {
      producto: Producto;
    };
    edicion?: Variedad;
  }>(),
  {
    edicion: null
  }
);

// datos por defecto del formulario
const initForm = {
  marca: props.edicion?.marca._id,
  inventarioPeriodo: props.edicion?.inventarioPeriodo,
  inventarioAviso: props.edicion?.inventarioAviso,
  cantidadAvisoFuerte: props.edicion?.cantidadAvisoFuerte,
  cantidadAvisoSuave: props.edicion?.cantidadAvisoSuave,
  cantidadMaxPedido: props.edicion?.cantidadMaxPedido
};

// definicion del estado
const estado = reactive({
  dataForm: clone(initForm),
  errorMarca: ''
});

// opciones
const selectMarca = computed(() => {
  if (!store.marcas) return [];
  return store.marcas.map(marca => ({
    value: marca._id,
    label: marca.nombre
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
      const producto = await modificarUno(GqlModificarProductos_basico, {
        busqueda: props.config.producto._id,
        datos: {
          variedades: {
            buscar: {
              _id: [props.edicion._id]
            },
            modificar: estado.dataForm
          }
        }
      });
      emits(
        'modificarObjeto',
        producto.variedades.find(v => v._id === props.edicion?._id),
        producto
      );
    } else {
      const producto = await modificarUno(GqlModificarProductos_basico, {
        busqueda: props.config.producto._id,
        datos: {
          variedades: {
            agregar: [estado.dataForm]
          }
        }
      });
      emits('crearObjeto', ultimo(producto.variedades), producto);
    }
  } catch (err) {
    if (isApiBadRequest(err, 'duplicado')) {
      estado.errorMarca = 'Esta marca ya esta registrada';
      return;
    }
    errFailback(err);
    return;
  }
  await store.refreshProductos();
  estado.dataForm = clone(initForm);
};
</script>
