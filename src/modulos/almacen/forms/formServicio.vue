<template>
  <q-form @submit="formSubmit">
    <!-- Variedad -->
    <input-select
      label="Marca"
      :opciones="selectMarca"
      info="Seleccione la marca de la cual agregara proveedor, si no existe la marca, puede crear con el boton (+)"
      :porDefecto="estado.dataForm.marca"
      @update="v => (estado.dataForm.marca = v)"
      requerido
      :dialog="formVariedad"
      :dialogConfig="{ producto: props.config.producto }"
      :disable="edicion != null"
      @CrearObjeto="handleVariedadCreada"
      :watch="estado.dataForm.marca" />

    <!-- Categoria -->
    <input-select
      label="Proveedor"
      info="Seleccione proveedor, si el proveedor no existe, puede crearla con el boton (+)"
      :opciones="selectProveedor"
      :porDefecto="estado.dataForm.proveedor"
      @update="v => (estado.dataForm.proveedor = v)"
      requerido
      :dialog="formProveedor"
      :disable="edicion != null" />

    <!-- Identificativo -->
    <input-text
      label="Identificativo"
      info="Ingrese los nombres que el proveedor usa para este producto en sus facturas o recibos. Ejemplo: Si el platillo desechable se llama 'BEX 485', coloque 'BEX 485'. 
Esto facilitara la comunicación con los proveedores."
      :porDefecto="estado.dataForm.identificativo"
      @update="v => (estado.dataForm.identificativo = v)" />

    <!-- Precios -->
    <input-text
      label="Precio con factura"
      info="Agregar el precio de compra CON FACTURA si tuviera."
      tipo="decimal"
      :porDefecto="estado.dataForm.precioConFactura"
      @update="v => (estado.dataForm.precioConFactura = v)" />
    <input-text
      label="precio sin factura"
      info="Agregar el precio de compra SIN FACTURA."
      tipo="decimal"
      :porDefecto="estado.dataForm.precioSinFactura"
      @update="v => (estado.dataForm.precioSinFactura = v)" />

    <!-- Por mayor -->
    <div class="flex justify-between items-center mt-2 mb-1">
      <h1 class="font-bold text-xs">PRECIOS POR MAYOR:</h1>
      <q-btn
        color="primary"
        label="Agregar precio"
        dense
        no-caps
        padding="1px 6px"
        @click="estado.showFormPorMayor = true" />
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
          class="[&>td]:border [&>td]:border-gray-400">
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
            <q-btn
              color="primary"
              icon="edit"
              dense
              size="10px"
              flat
              @click="
                () => {
                  ppmIndexEdit = index;
                  estado.dataFormPorMayor.cantidadMin =
                    estado.dataForm.preciosPorMayor[index].cantidadMin;
                  estado.dataFormPorMayor.precioSinFactura =
                    estado.dataForm.preciosPorMayor[index].precioSinFactura;
                  estado.dataFormPorMayor.precioConFactura =
                    estado.dataForm.preciosPorMayor[index].precioConFactura;
                  estado.showFormPorMayor = true;
                }
              " />
            <q-btn
              color="red"
              icon="delete"
              dense
              size="10px"
              flat
              @click="
                () => {
                  $q.dialog({
                    message: '¿Estas seguro de borrar este precio?',
                    cancel: true,
                    persistent: true
                  }).onOk(() => {
                    estado.dataForm.preciosPorMayor.splice(index, 1);
                  });
                }
              " />
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
        <input-text
          tipo="number"
          label="Cantidad min."
          info="Info #23"
          :porDefecto="estado.dataFormPorMayor.cantidadMin"
          @update="v => (estado.dataFormPorMayor.cantidadMin = v)"
          requerido />
        <input-text
          label="Precio con factura"
          tipo="decimal"
          info="Agregar el precio de compra UNITARIO con factura, si tuviera."
          :porDefecto="estado.dataFormPorMayor.precioConFactura"
          @update="v => (estado.dataFormPorMayor.precioConFactura = v)" />
        <input-text
          label="Precio sin factura"
          tipo="decimal"
          info="Agregar el precio de compra UNITARIO sin factura."
          :porDefecto="estado.dataFormPorMayor.precioSinFactura"
          @update="v => (estado.dataFormPorMayor.precioSinFactura = v)" />

        <!-- Submit -->
        <div class="text-center">
          <q-btn label="Guardar" color="green" type="submit" />
        </div>
      </q-form>
    </template>
  </Popup>
</template>

<script setup lang="ts">
import type { Servicio } from '#gql';
import formVariedad from '@/modulos/almacen/forms/formVariedad.vue';
import formProveedor from '@/modulos/almacen/forms/formProveedor.vue';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';
import type { Producto } from '#gql';
const { store } = useAlmacen();

// definicion de los emits
const emits = defineEmits(['crearObjeto', 'modificarObjeto']);

// definicion de los props
const props = withDefaults(
  defineProps<{
    config?: {
      producto: Producto;
      proveedorId?: string;
    };
    edicion?: Servicio;
  }>(),
  {
    edicion: null
  }
);

// datos por defecto del formulario
const initForm = {
  producto: props.config.producto._id,
  proveedor: props.config?.proveedorId,
  marca: props.edicion?.marca._id,
  identificativo: props.edicion?.identificativo,
  precioConFactura: props.edicion?.precioConFactura,
  precioSinFactura: props.edicion?.precioSinFactura,
  preciosPorMayor: props.edicion?.preciosPorMayor ?? []
};
const initFormPorMayor = {
  cantidadMin: 0,
  precioConFactura: 0,
  precioSinFactura: 0
};

// definicion del estado
const estado = reactive({
  dataForm: clone(initForm),
  dataFormPorMayor: clone(initFormPorMayor),
  showFormPorMayor: false
});

// opciones
const selectMarca = computed(() => {
  if (!props.config.producto.variedades) return [];
  return props.config.producto.variedades.map(variedad => ({
    value: variedad.marca._id,
    label: variedad.marca.nombre
  }));
});
const selectProveedor = computed(() => {
  if (!store.proveedores) return [];
  return store.proveedores.map(proveedor => ({
    value: proveedor._id,
    label: proveedor.nombre
  }));
});

// Inicializaciones
onMounted(async () => {
  await store.getMarcas();
  await store.getProveedores();
});

// submision del formulario
const formSubmit = async () => {
  const proveedorId = estado.dataForm.proveedor;
  // el proveedor no entra en los datos para la consulta
  const data = clone(estado.dataForm);
  delete data.proveedor;

  try {
    // Modo edicion
    if (props.edicion != null) {
      data.preciosPorMayor = { reemplazar: data.preciosPorMayor };
      const proveedor = await modificarUno(GqlModificarEntidades_servicios, {
        busqueda: proveedorId,
        datos: {
          servicios: {
            buscar: {
              _id: [props.edicion._id]
            },
            modificar: data
          }
        }
      });
      emits(
        'modificarObjeto',
        proveedor.servicios.find(s => s._id === props.edicion._id)
      );
    }
    // Modo creacion
    else {
      const proveedor = await modificarUno(GqlModificarEntidades_servicios, {
        busqueda: proveedorId,
        datos: {
          servicios: {
            agregar: data
          }
        }
      });
      emits('crearObjeto', ultimo(proveedor.servicios), proveedor);
    }
  } catch (err) {
    errFailback(err);
    return;
  }
  await store.refreshProveedores();
  estado.dataForm = clone(initForm);
};

const ppmIndexEdit = ref(null);
const addPpmSubmit = () => {
  estado.showFormPorMayor = false;
  if (ppmIndexEdit.value !== null) {
    estado.dataForm.preciosPorMayor[ppmIndexEdit.value] = clone(
      estado.dataFormPorMayor
    );
    ppmIndexEdit.value = null;
  } else {
    estado.dataForm.preciosPorMayor.push(clone(estado.dataFormPorMayor));
  }
  estado.dataFormPorMayor = clone(initFormPorMayor);
};

const handleVariedadCreada = variedad => {
  props.config.producto.variedades.push(variedad);
  estado.dataForm.marca = variedad.marca._id;
};
</script>
