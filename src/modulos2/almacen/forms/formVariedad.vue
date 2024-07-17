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
      :error="estado.errorMarca"
      :disable="edicion != null"
      :dialog="formMarca"
    />

    <!-- Stock minimo -->
    <p>Alerta de cantidad baja en el stock</p>
    <div class="flex">
      <input-text2
        style="width: 45%"
        label="Primer aviso"
        :porDefecto="estado.dataForm.cantidadLimite?.[0] ?? 0"
        @update="(v) => (estado.dataForm.cantidadLimite[0] = Number(v))"
        :rules="[useRules.requerido(), useRules.numero()]"
      />
      <input-text2
        style="width: 55%"
        label="Segundo aviso"
        :porDefecto="estado.dataForm.cantidadLimite?.[1] ?? 0"
        @update="(v) => (estado.dataForm.cantidadLimite[1] = Number(v))"
        :rules="[useRules.requerido(), useRules.numero()]"
        info="Cuando el stock del producto baja debajo del primer valor, se lanzara una alerta naranja, y una alerta roja cuando baje debajo del segundo valor."
      />
    </div>

    <!-- Stock minimo -->
    <p>Alerta de que hay que inventariar</p>
    <div class="flex">
      <input-text2
        style="width: 45%"
        label="Primer aviso"
        :porDefecto="estado.dataForm.inventarioLimite?.[0] ?? 0"
        @update="(v) => (estado.dataForm.inventarioLimite[0] = Number(v))"
        :rules="[useRules.requerido(), useRules.numero()]"
      />

      <input-text2
        style="width: 55%"
        label="Segundo aviso"
        :porDefecto="estado.dataForm.inventarioLimite?.[1]"
        @update="(v) => (estado.dataForm.inventarioLimite[1] = Number(v))"
        :rules="[useRules.requerido(), useRules.numero()]"
        info="Despues de hacer un inventario, cuando pasan el numero de días indicado en el primero campo, se mandara un recordatorio naranja, y un recordatorio rojo cuando pasan el numero de días indicado en el segundo campo."
      />
    </div>

    <!-- Cantidad max en un pedido -->
    <input-text2
      label="Cantidad maxima"
      :porDefecto="estado.dataForm.cantidadMaxPedido"
      @update="(v) => (estado.dataForm.cantidadMaxPedido = Number(v))"
      :rules="[useRules.requerido(), useRules.numero()]"
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
import formMarca from '@/modulos2/almacen/forms/formMarca.vue';
import type { SelectOpcion } from '~/components/input/select.interface';
import { useAlmacen } from '~/modulos2/almacen/almacen.composable';
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
  marca: props.edicion?.marca._id ?? '',
  cantidadLimite: props.edicion?.cantidadLimite ?? [0, 0],
  inventarioLimite: props.edicion?.inventarioLimite ?? [0, 0],
  cantidadMaxPedido: props.edicion?.cantidadMaxPedido ?? 0,
};

// definicion del estado
const estado = reactive({
  // valor de los inputs
  dataForm: clone(initForm),
  //mensajes de error del formulario
  errorMarca: '',
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
      estado.dataForm.cantidadLimite = {
        reemplazar: estado.dataForm.cantidadLimite,
      };
      estado.dataForm.inventarioLimite = {
        reemplazar: estado.dataForm.inventarioLimite,
      };
      const producto = await api.modificarProducto_basico(store.producto._id, {
        variedades: {
          buscar: {
            _id: [props.edicion?._id],
          },
          modificar: estado.dataForm,
        },
      });
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);

      emits(
        'modificarObjeto',
        producto.variedades.find((v) => v._id === props.edicion?._id),
        { pariente: producto },
      );
    }

    // Modo creacion
    else {
      // lanzamos la consulta
      const producto = await api.modificarProducto_basico(store.producto._id, {
        variedades: {
          agregar: [estado.dataForm],
        },
      });
      const variedad = ultimo(producto.variedades);
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);
      // mandamos el resultado al componiente pariente
      emits('crearObjeto', variedad, {
        pariente: producto,
        selectValor: variedad._id,
        selectCallback: (listaOpciones: SelectOpcion[]): SelectOpcion[] => {
          return [
            ...listaOpciones,
            { label: variedad.marca.nombre, value: variedad._id },
          ];
        },
      });
    }
  } catch (err) {
    if (isApiBadRequest(err, 'duplicado')) {
      estado.errorMarca = 'Esta marca ya esta registrada';
      return;
    }
    errFallBack(err);
    return;
  }
};
</script>
