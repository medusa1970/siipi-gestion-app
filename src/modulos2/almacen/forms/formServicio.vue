<template>
  <q-form @submit="formSubmit">
    <!-- Variedad -->
    <input-select2
      label="Marca"
      :opciones="estado.marcaOpciones"
      info="SelecInfo."
      :porDefecto="estado.dataForm.marca"
      @update="(v) => (estado.dataForm.marca = v)"
      :rules="[useRules.requerido()]"
      :dialog="formVariedad"
      :disable="edicion != null"
      @CrearObjeto="handleVariedadCreada"
    />

    <!-- Categoria -->
    <input-select2
      label="Proveedor"
      :opciones="estado.proveedorOpciones"
      info="Info."
      :porDefecto="estado.dataForm.proveedor"
      @update="(v) => (estado.dataForm.proveedor = v)"
      :rules="[useRules.requerido()]"
      :dialog="formProveedor"
      :disable="edicion != null"
    />

    <!-- Identificativo -->
    <input-text2
      label="Identificativo"
      :porDefecto="estado.dataForm.identificativo"
      @update="(v) => (estado.dataForm.identificativo = v)"
    />

    <!-- Precios -->
    <input-text2
      label="Precio con factura"
      :porDefecto="estado.dataForm.precioConFactura"
      @update="(v) => (estado.dataForm.precioConFactura = Number(v))"
      :rules="[useRules.numero()]"
    />
    <input-text2
      label="precio sin factura"
      :porDefecto="estado.dataForm.precioSinFactura"
      @update="(v) => (estado.dataForm.precioSinFactura = Number(v))"
      :rules="[useRules.numero()]"
    />

    <!-- Por mayor -->
    <div class="flex justify-between items-center mt-2 mb-1">
      <h1 class="font-bold text-xs">PRECIOS POR MAYOR:</h1>
      <q-btn
        color="primary"
        label="Agregar precio"
        dense
        no-caps
        padding="1px 6px"
        @click="estado.showFormPorMayor = true"
      />
    </div>
    <table class="min-w-full bg-white rounded-sm overflow-hidden">
      <thead class="bg-teal-700 text-white">
        <tr class="[&>th]:py-1">
          <th class="text-center text-xs uppercase tracking-wider">Cantidad</th>
          <th class="text-center text-xs uppercase tracking-wider">
            Precio C/F
          </th>
          <th class="text-center text-xs uppercase tracking-wider">
            Precio S/F
          </th>
          <th class="text-center text-xs uppercase tracking-wider">Acciones</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr
          v-for="(precio, index) in estado.dataForm.preciosPorMayor"
          :key="index"
          class="[&>td]:border [&>td]:border-gray-400"
        >
          <td class="whitespace-nowrap text-center">
            {{ precio.cantidadMin }}
          </td>
          <td class="whitespace-nowrap text-center">
            {{ precio.precioConFactura }}
          </td>
          <td class="whitespace-nowrap text-center">
            {{ precio.precioSinFactura }}
          </td>
          <td class="whitespace-nowrap text-center">
            <q-btn color="primary" icon="edit" dense size="10px" flat />
            <q-btn color="red" icon="delete" dense size="10px" flat />
          </td>
        </tr>
      </tbody>
    </table>
    <br />
    <!-- Submit -->
    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>

  <Popup v-model="estado.showFormPorMayor" titulo="Agregar precio por mayor">
    <template #body>
      <q-form @submit="addPpmSubmit">
        <input-text2
          label="Cantidad min."
          :porDefecto="estado.dataFormPorMayor.cantidadMin"
          @update="(v) => (estado.dataFormPorMayor.cantidadMin = Number(v))"
          :rules="[useRules.requerido(), useRules.numero()]"
        />
        <input-text2
          label="Precio con factura"
          :porDefecto="estado.dataFormPorMayor.precioConFactura"
          @update="
            (v) => (estado.dataFormPorMayor.precioConFactura = Number(v))
          "
          :rules="[useRules.numero()]"
        />
        <input-text2
          label="precio sin factura"
          :porDefecto="estado.dataFormPorMayor.precioSinFactura"
          @update="
            (v) => (estado.dataFormPorMayor.precioSinFactura = Number(v))
          "
          :rules="[useRules.numero()]"
        />

        <!-- Submit -->
        <div class="text-center">
          <q-btn label="Guardar" color="green" type="submit" />
        </div>
      </q-form>
    </template>
  </Popup>
</template>

<script setup lang="ts">
import type { SelectOpcion } from '~/components/input/select.interface';
import type { Servicio } from '#gql';
import formVariedad from '@/modulos2/almacen/forms/formVariedad.vue';
import formProveedor from '@/modulos2/almacen/forms/formProveedor.vue';
import { useAlmacen } from '~/modulos2/almacen/almacen.composable';
const { store } = useAlmacen();

// definicion de los emits
const emits = defineEmits(['crearObjeto', 'modificarObjeto']);

// definicion de los props
const props = withDefaults(
  defineProps<{
    config?: { proveedorId?: string };
    edicion: Servicio | null; // edicion si null, sino creacion
  }>(),
  {
    edicion: null,
  },
);

// datos por defecto del formulario
const initForm = {
  producto: store.producto._id,
  proveedor: props.config?.proveedorId ?? '',
  marca: props.edicion?.marca._id ?? '',
  identificativo: props.edicion?.identificativo ?? '',
  precioConFactura: props.edicion?.precioConFactura ?? '',
  precioSinFactura: props.edicion?.precioSinFactura ?? '',
  preciosPorMayor: props.edicion?.preciosPorMayor ?? [],
};
const initFormPorMayor = {
  cantidadMin: 0,
  precioConFactura: 0,
  precioSinFactura: 0,
};

// definicion del estado
const estado = reactive({
  // valor de los inputs
  dataForm: clone(initForm),
  dataFormPorMayor: clone(initFormPorMayor),
  // listas de opciones
  marcaOpciones: [] as SelectOpcion[],
  proveedorOpciones: [] as SelectOpcion[],
  // los dialogs
  showFormPorMayor: false,
});

// Inicializaciones
onMounted(async () => {
  // opciones de marcas
  estado.marcaOpciones = store.producto.variedades.map((variedad) => ({
    value: variedad._id, // ponemos la id de la variedad pero mas tarde seleccionaremos su marca
    label: variedad.marca.nombre,
  }));

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
  // el proveedor no entra en llos datos para la consulta
  const data = clone(estado.dataForm);
  delete data.proveedor;

  try {
    // Modo edicion
    if (props.edicion != null) {
      delete data.marca;
      // lanzamos la consulta
      data.preciosPorMayor = { reemplazar: data.preciosPorMayor };
      const proveedor = await api.modificarEntidad_servicios(proveedorId, {
        servicios: {
          buscar: {
            _id: [props.edicion._id],
          },
          modificar: data,
        },
      });
      const servicio = proveedor.servicios.find(
        (s) => s._id === props.edicion._id,
      );
      // reinicializamos el formulario
      estado.dataForm = clone(initForm);
      // mandamos el resultado al componiente pariente
      emits('modificarObjeto', servicio, { pariente: proveedor });
    }
    // Modo creacion
    else {
      // la opcion entrega una id de variedad, no de marca, seleccionamos la marca correspondiente
      data.marca = store.producto.variedades.find(
        (v) => v._id === data.marca,
      ).marca._id;
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
      emits('crearObjeto', servicio, {
        pariente: proveedor,
        selectValor: servicio._id,
        selectCallback: (listaOpciones: SelectOpcion[]): SelectOpcion[] => [
          ...listaOpciones,
          { label: servicio.nombre, value: servicio._id },
        ],
      });
    }
  } catch (err) {
    errFallBack(err);
    return;
  }
};

const addPpmSubmit = () => {
  estado.showFormPorMayor = false;
  estado.dataForm.preciosPorMayor.push(clone(estado.dataFormPorMayor));
  estado.dataFormPorMayor = clone(initFormPorMayor);
};

const handleVariedadCreada = (v) => {
  store.producto.variedades.push(v);
};
</script>
