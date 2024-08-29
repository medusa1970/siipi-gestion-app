<template>
  <p>
    La medida básica es la forma en que se maneja el producto (por peso, unidad,
    etc).
  </p>

  <!-- 
      No se podrá agregar empaque si la medida basica no esta registrada
      En este caso el input se desabilita
      asi que el boton guardar (menos si todavia no hay empaques)
  -->
  <div v-if="!estado.producto.medida">
    <p>Para poder agregar empaques, primero debes definir la medida basica.</p>
  </div>
  <input-select
    :disable="estado.producto.empaques.length > 0"
    label="Medida basica"
    :opciones="estado.medidaOpciones"
    @update="changeMedida"
    :porDefecto="estado.producto.medida?._id"
    requerido
    :dialog="formMedida" />
  <div
    class="!flex justify-center"
    v-if="!estado.producto.empaques || estado.producto.empaques.length === 0">
    <q-btn
      class="display-block mx-auto mt-1"
      color="primary"
      label="Guardar medida basica"
      dense
      no-caps
      padding="3px 20px"
      @click="formSubmit" />
  </div>

  <!-- 
      Solo se muestra la tabla si hay una medida seleccionada
  -->

  <p v-if="estado.producto.medida">
    Los empaques son la formas que llegan en producto en el almacén, por ejemplo
    en tira o paquete de tal o tal marca.
  </p>

  <Tabla
    v-if="estado.producto.medida"
    :rows="rowsTabla"
    :columns="
    [
    {
    name: 'marca',
    required: true,
    label: 'Marca',
    align: 'left',
    field: (row: any) => row.marca.nombre,
    sortable: true,
  },
  {
    name: 'nombre',
    required: true,
    label: 'Empaque',
    align: 'left',
    field: (row: any) => row.nombre,
    sortable: true,
  },
  {
    name: 'abreviacion',
    required: true,
    label: 'Abreviacion',
    align: 'left',
    field: (row: any) => row.abreviacion,
    sortable: true,
  },
  {
    name: 'cantidad',
    required: true,
    label: 'Cantidad',
    align: 'left',
    field: (row: any) => row.cantidad,
    format: (v) => `${v} ${estado.producto.medida.abreviacion}`,
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right',
    slot: true,
  },
]">
    <template #dropdown>
      <div class="flex">
        <input-text
          @update="(v) => (estado.filtros.buscar = v as string)"
          labelAdentro
          class="col-span-1"
          label="Buscar"
          noSlot />
        <q-btn
          @click="() => (estado.modal.formEmpaqueCrear = true)"
          icon="add"
          color="green"
          no-caps
          padding="4px 10px" />
      </div>
    </template>
    <template #cell-actions="{ row }">
      <q-btn-group push @click="e => e.stopPropagation()">
        <q-btn
          @click="
            () => {
              estado.empaque = row;
              estado.modal.formEmpaqueModificar = true;
            }
          "
          class="p-1"
          color="black"
          size="sm"
          icon="edit" />
        <q-btn
          icon="delete"
          class="p-1"
          color="red"
          size="sm"
          @click="borrarProductoEmpaque(row)">
          <q-tooltip> Eliminar empaque </q-tooltip>
        </q-btn>
      </q-btn-group>
    </template>
    <!-- <template #body-expand="{ row }">
      <pre>{{ row }}</pre>
    </template> -->
  </Tabla>

  <Popup
    v-model="estado.modal.formEmpaqueModificar"
    titulo="Modificar el empaque">
    <template #body>
      <formEmpaque
        :config="{ producto: estado.producto }"
        :empaque="estado.empaque"
        @modificarObjeto="handleEmpaqueModificado" />
    </template>
  </Popup>

  <Popup
    v-model="estado.modal.formEmpaqueCrear"
    titulo="Registrar nuevo empaque">
    <template #body>
      <formEmpaque
        :config="{ producto: estado.producto }"
        @crearObjeto="handleEmpaqueCreado" />
    </template>
  </Popup>
</template>

<script setup lang="ts">
import type { Medida } from '#gql';
import formEmpaque from '~/modulos/almacen/forms/formEmpaque.vue';
import formMedida from '~/modulos/almacen/forms/formMedida.vue';
import type { SelectOpcion } from '~/components/input/select.interface';
const $q = useQuasar();
const props = defineProps({
  productoCorriente: null
});

const estado = reactive({
  // el producto corriente
  producto: props.productoCorriente,

  // la variedad que se esta modificando
  empaque: null,
  // lista de todas las medidas
  medidas: [] as Medida[],
  // medida seleccionada
  medidaId: null,
  // los dialogs
  modal: {
    formEmpaqueCrear: false,
    formEmpaqueModificar: false
  },
  // opciones del select de medidas
  medidaOpciones: [] as SelectOpcion[],
  // config de los filtros de la tabla
  filtros: {
    buscar: ''
  }
});

// guardar la medida basica tras hacer click en el boton guardar
const formSubmit = async () => {
  let producto;
  try {
    producto = await modificarUno(GqlModificarProductos_basico, {
      busqueda: estado.producto._id,
      datos: {
        medida: estado.medidaId
      }
    });
  } catch (err) {
    errFailback(err);
    return;
  }
  NotifySucess('Medida guardada correctamente');
  estado.producto.medida = producto.medida;
};

const handleEmpaqueCreado = (empaque, producto) => {
  NotifySucessCenter('Empaque creado éxitosamente');
  estado.modal.formEmpaqueCrear = false;
  estado.producto = producto;
};

const handleEmpaqueModificado = (empaque, producto) => {
  NotifySucessCenter('Empaque modificade éxitosamente');
  estado.modal.formEmpaqueModificar = false;
  estado.producto = producto;
};

const borrarProductoEmpaque = (empaque: any) => {
  $q.dialog({
    title: `Eliminar ${empaque.nombre}`,
    message: 'No se puede deshacer.',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      const productoEmpaque = await modificarUno(GqlModificarProductos_basico, {
        busqueda: estado.producto._id,
        datos: {
          empaques: {
            borrar: { _id: empaque._id }
          }
        }
      });
      if (productoEmpaque) {
        NotifySucessCenter('Empaque borrado correctamente');

        estado.producto.empaques = estado.producto.empaques.filter(
          e => e._id !== empaque._id
        );
      }
    } catch (err) {
      errFailback(err);
    }
  });
};

//inicializaciones
onMounted(async () => {
  // llenamos las opciones de medidas
  try {
    estado.medidas = await buscarVarios(GqlBuscarMedidas);
  } catch (err) {
    errFailback(err);
  }
  estado.medidaOpciones = estado.medidas.map(medida => ({
    value: medida._id,
    label: `${medida.nombre} (${medida.abreviacion})`
  }));
});

const changeMedida = v => {
  estado.medidaId = v;
};

/**
 * Rows para la tabla
 */
const rowsTabla = computed(() => {
  let filtered = estado.producto.empaques;
  if (!filtered) return [];
  if (estado.filtros.buscar != null) {
    const regex = new RegExp(`${estado.filtros.buscar}`, 'i');
    filtered = filtered.filter(empaque => {
      return regex.test(
        empaque.abreviacion +
          empaque.nombre +
          empaque.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '') +
          empaque.marca.nombre +
          empaque.marca.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      );
    });
  }
  return filtered;
});
</script>

<style lang="scss" scoped></style>
