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
      :error="estado.errorMarca"
      :disable="edicion != null"
      :dialog="formMarca"
      @payload="handleMarcaCreada"
    />

    <!-- Stock minimo -->
    <p>Alerta de cantidad baja en el stock</p>
    <div class="flex">
      <input-text
        style="width: 45%"
        label="Primer aviso"
        :porDefecto="estado.dataForm.cantidadLimite?.[0] ?? 0"
        @update="(v) => (estado.dataForm.cantidadLimite[0] = Number(v))"
        :rules="[useRules.requerido(), useRules.numero()]"
      />
      <input-text
        style="width: 55%"
        label="Segundo aviso"
        :porDefecto="estado.dataForm.cantidadLimite?.[0] ?? 0"
        @update="(v) => (estado.dataForm.cantidadLimite[1] = Number(v))"
        :rules="[useRules.requerido(), useRules.numero()]"
        info="Cuando el stock del producto baja debajo del primer valor, se lanzara una alerta naranja, y una alerta roja cuando baje debajo del segundo valor."
      />
    </div>

    <!-- Stock minimo -->
    <p>Alerta de que hay que inventariar</p>
    <div class="flex">
      <input-text
        style="width: 45%"
        label="Primer aviso"
        :porDefecto="estado.dataForm.inventarioLimite?.[0] ?? 0"
        @update="(v) => (estado.dataForm.inventarioLimite[0] = Number(v))"
        :rules="[useRules.requerido(), useRules.numero()]"
      />

      <input-text
        style="width: 55%"
        label="Segundo aviso"
        :porDefecto="estado.dataForm.inventarioLimite?.[1]"
        @update="(v) => (estado.dataForm.inventarioLimite[1] = Number(v))"
        :rules="[useRules.requerido(), useRules.numero()]"
        info="Despues de hacer un inventario, cuando pasan el numero de días indicado en el primero campo, se mandara un recordatorio naranja, y un recordatorio rojo cuando pasan el numero de días indicado en el segundo campo."
      />
    </div>

    <!-- Cantidad max en un pedido -->
    <input-text
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
import type { Producto } from '#gql';
import formMarca from '@/modulos2/almacen/forms/formMarca.vue';
import type { selectOpcionCallback } from '~/components/input/select.interface';

// definicion de los emits
const emits = defineEmits<{
  (event: 'crear:variedad', variedad: Variedad, producto: Producto): void;
  (event: 'modificar:variedad', variedad: Variedad, producto: Producto): void;
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
      const producto = await api.modificarProducto_basico(props.productoID, {
        variedades: {
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
        'modificar:variedad',
        producto.variedades.find((v) => v._id === props.edicion?._id),
        producto,
      );
    }

    // Modo creacion
    else {
      // lanzamos la consulta
      const producto = await api.modificarProducto_basico(props.productoID, {
        variedades: {
          agregar: [estado.dataForm],
        },
      });
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);
      // mandamos el resultado al componiente pariente
      emits(
        'crear:variedad',
        producto.variedades[producto.variedades.length - 1],
        producto,
      );
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

const handleMarcaCreada = (marca: any) => {};
</script>
