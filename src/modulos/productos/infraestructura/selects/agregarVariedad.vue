<template>
  <q-form @submit="formSubmit">
    <!-- Marca -->
    <input-select
      label="Marca"
      :opciones="marcasParaSelect"
      info="Seleccione una marca entre todas las marcas que se registraron globalmente en la empresa. Si la marca que quiere agregar no existe, puede crearla via el boton [+]"
      @update="(v) => (marca.value = v)"
      :error="marca.error"
      :rules="[useRules.requerido()]"
      :dialog="agregarMarcaComp"
      @payload="handlePayload"
    />

    <!-- Imagen -->
    <input-image
      label="Imagen"
      @update="
        (base64Data, mimetype) =>
          (imagen.value = base64Data
            ? { data: base64Data, mimetype: mimetype }
            : null)
      "
      info="Por favor elija una foto del producto solo, que se distinga claramente ante un fondo claro y unido. Prefiera un formato cuadrado."
      icono="photo_camera"
    />

    <!-- Stock minimo -->
    <input-text
      label="Stock minimo antes de hacer pedido"
      @update="(v) => (cantidadLimite.value[0] = Number(v))"
      info="Es la cantidad en stock del producto debajo de la cual se alertará para avisar que se necesita hacer un nuevo pedido al proveedor."
      :rules="[useRules.requerido(), useRules.numero()]"
    />
    <input-text
      label="Stock minimo antes de hacer pedido"
      @update="(v) => (cantidadLimite.value[0] = Number(v))"
      info="Es la cantidad en stock del producto debajo de la cual se alertará para avisar que se necesita hacer un nuevo pedido al proveedor."
      :rules="[useRules.requerido(), useRules.numero()]"
    />

    <!-- Cantidad max en un pedido -->
    <input-text
      label="Cantidad max en un pedido"
      @update="(v) => (cantidadMaxPedido.value = Number(v))"
      info="Es la cantidad maxima que un punto puede pedir a produccion, para evitar errores inecesarias."
      :rules="[useRules.requerido(), useRules.numero()]"
    />

    <!-- dias inventario -->
    <input-text
      label="dias maximos entre 2 pedidos"
      @update="(v) => (inventarioLimite.value[0] = Number(v))"
      info="Es la cantidad en stock del producto debajo de la cual se alertará para avisar que se necesita hacer un nuevo pedido al proveedor."
      :rules="[useRules.requerido(), useRules.numero()]"
    />

    <input-text
      label="dias maximos entre 2 pedidos + aviso"
      @update="(v) => (inventarioLimite.value[1] = Number(v))"
      info="Es la cantidad en stock del producto debajo de la cual se alertará para avisar que se necesita hacer un nuevo pedido al proveedor."
      :rules="[useRules.requerido(), useRules.numero()]"
    />

    <q-btn label="Crear" type="submit" />
  </q-form>
</template>

<script setup lang="ts">
import type { CrearVariedadDto } from '#gql';
import type { SelectOpcion } from '~/components/input/select.interface';
import { productoService } from '../../API/productoService';
import agregarMarcaComp from '~/modulos/productos/infraestructura/selects/agregarMarca.vue';
import type { Variedad } from '#gql';

/**
 * Eventos
 */

const emits = defineEmits<{
  (
    event: 'update:opciones',
    objeto: Variedad, // el objeto que se creó
    opciones: SelectOpcion[], // la lista de opciones puesta al día con ello
    value: String, // el valor del elemento a seleccionar (generalmente id del objeto)
  ): void;
}>();

/**
 * Props
 */

const props = withDefaults(
  defineProps<{
    opcionesPariente: SelectOpcion[];
    param: string;
  }>(),
  {},
);

/**
 * Inicializaciones
 */

const marca = reactiveInput(null as string);
const imagen = reactiveInput(null as { data: string; mimetype: string });
const cantidadLimite = reactiveInput(null as [Number, Number]);
const inventarioLimite = reactiveInput(null as [Number, Number]);
const cantidadMaxPedido = reactiveInput(null as Number);

const productoID = props.param;
const marcasParaSelect = ref([]);
onMounted(async () => {
  const marcas = await productoService.buscarMarcas();
  marcasParaSelect.value = clone(marcas).map((marca) => {
    return {
      label: marca.nombre,
      value: marca._id,
    };
  });
});

/**
 * Handle payload
 */

const handlePayload = (payload: any) => {
  console.log('creado marca', marca);
};

/**
 * Submit
 */

const formSubmit = async (datos: any) => {
  if (!props.opcionesPariente) {
    throw 'prop opciones obligatoria';
  }

  // agregamos la variedad
  const datosMod = {
    marca: marca.value,
    cantidadLimite: cantidadLimite.value,
    cantidadMaxPedido: cantidadMaxPedido.value,
  } as CrearVariedadDto;
  console.log(datosMod);
  if (imagen.value) {
    Object.assign(datos, {
      imagen: imagen.value,
    });
  }
  // hacemos la consulta con manejo de errores
  let productoModificado;
  try {
    await loadingAsync(async () => {
      productoModificado = await productoService.crearProductosMarca(
        productoID,
        datosMod,
      );
      if (!productoModificado) throw 'No se pudo modificar el producto';
    });
  } catch (err) {
    if (isApiBadRequest(err, 'duplicado')) {
      marca.error = 'Esta marca ya esta registrada';
      return;
    }
    errFallBack(err);
    return;
  }
  const nuevaVariedad = productoModificado.variedades.pop();
  // Avisamos que todo fue bien;
  NotifySucess(`Marca registrada al producto con éxito`);

  // la nueva opcion que insertaremos en la lista
  const nuevaOpcion = {
    label: nuevaVariedad.marca.nombre,
    value: nuevaVariedad.marca._id,
    disable: false,
  };

  // insertamos en las opciones y emitimos las nuevas opciones
  const opt = clone(props.opcionesPariente);
  let index = 0;
  if (opt.length > 0) {
    while (
      opt[index] &&
      opt[index].label.toLowerCase() < nuevaVariedad.marca.nombre.toLowerCase()
    ) {
      index++;
    }
  }
  opt.splice(index, 0, nuevaOpcion);
  emits('update:opciones', nuevaVariedad, opt, nuevaVariedad.marca._id);
};
</script>
