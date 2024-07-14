<template>
  <q-form @submit="formSubmit">
    <!-- Variedad -->
    <input-select
      label="Marca"
      :opciones="estado.marcaOpciones"
      info="SelecInfo."
      :porDefecto="estado.dataForm.marca"
      @update="(v) => (estado.dataForm.marca = v)"
      :rules="[useRules.requerido()]"
      :dialog="formMarca"
      @payload="handleMarcaCreada"
      :disable="edicion != null"
    />

    <!-- Categoria -->
    <input-select
      label="Proveedor"
      :opciones="estado.proveedorOpciones"
      info="Info."
      :porDefecto="estado.dataForm.proveedor"
      @update="(v) => (estado.dataForm.proveedor = v)"
      :rules="[useRules.requerido()]"
      :dialog="formProveedor"
      @payload="handleProveedorCreado"
      :disable="edicion != null"
    />

    <!-- Precios -->
    <input-text
      label="Precio con factura"
      :porDefecto="estado.dataForm.precioConFactura"
      @update="(v) => (estado.dataForm.precioConFactura = Number(v))"
      :rules="[useRules.numero()]"
    />
    <input-text
      label="precio sin factura"
      :porDefecto="estado.dataForm.precioSinFactura"
      @update="(v) => (estado.dataForm.precioSinFactura = Number(v))"
      :rules="[useRules.numero()]"
    />

    <!-- Submit -->
    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import type { SelectOpcion } from '~/components/input/select.interface';
import type { Servicio } from '#gql';
import formMarca from '@/modulos2/almacen/forms/formMarca.vue';
import formProveedor from '@/modulos2/almacen/forms/formProveedor.vue';
import type { Entidad } from '#gql';

// definicion de los emits
const emits = defineEmits<{
  (event: 'crear:servicio', servicio: Servicio, proveedor: Entidad): void;
  (event: 'modificar:servicio', servicio: Servicio, proveedor: Entidad): void;
}>();

// definicion de los props
const props = withDefaults(
  defineProps<{
    productoId: string;
    proveedorId: string;
    edicion: Servicio | null; // edicion si null, sino creacion
  }>(),
  {
    proveedorId: null,
    edicion: null,
  },
);

// datos por defecto del formulario
const initForm = {
  producto: props.productoId,
  proveedor: props.proveedorId ?? '',
  marca: props.edicion?.marca._id ?? '',
  precioConFactura: props.edicion?.precioConFactura ?? '',
  precioSinFactura: props.edicion?.precioSinFactura ?? '',
};

// definicion del estado
const estado = reactive({
  // valor de los inputs
  dataForm: clone(initForm),
  // listas de opciones
  marcaOpciones: [] as SelectOpcion[],
  proveedorOpciones: [] as SelectOpcion[],
});

// Inicializaciones
onMounted(async () => {
  // opciones de marcas
  try {
    estado.marcaOpciones = (await api.buscarMarcas({})).map((marca) => {
      return {
        value: marca._id,
        label: marca.nombre,
      };
    });
  } catch (err) {
    errFallBack(err);
    return;
  }
  // opciones de proveedores
  try {
    estado.proveedorOpciones = (
      await api.buscarEntidades_basico({
        tipo: ['PROVEEDOR'],
      })
    ).map((proveedor) => {
      return {
        value: proveedor._id,
        label: proveedor.nombre,
      };
    });
  } catch (err) {
    errFallBack(err);
    return;
  }
});

// submision del formulario
const formSubmit = async () => {
  const proveedorId = estado.dataForm.proveedor;
  const data = clone(estado.dataForm);
  delete data.proveedor;
  try {
    // Modo edicion
    if (props.edicion != null) {
      // lanzamos la consulta
      const proveedor = await api.modificarEntidad_servicios(proveedorId, {
        servicios: {
          buscar: {
            _id: [props.edicion._id],
          },
          modificar: data,
        },
      });
      const servicio = proveedor.servicios.find(
        (s) => (s._id = props.edicion._id),
      );
      console.log(
        'found',
        props.edicion._id,
        servicio._id,
        proveedor.servicios.map((s) => s._id),
      );
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);
      // mandamos el resultado al componiente pariente
      emits('modificar:servicio', servicio, proveedor);
    }
    // Modo creacion
    else {
      // lanzamos la consulta
      const proveedor = await api.modificarEntidad_servicios(proveedorId, {
        servicios: {
          agregar: data,
        },
      });
      const servicio = ultimo(proveedor.servicios);
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);
      // mandamos el resultado al componiente pariente
      emits('crear:servicio', servicio, proveedor);
    }
  } catch (err) {
    errFallBack(err);
    return;
  }
};

const handleProveedorCreado = (proveedor: any) => {};
const handleMarcaCreada = (proveedor: any) => {};
</script>
