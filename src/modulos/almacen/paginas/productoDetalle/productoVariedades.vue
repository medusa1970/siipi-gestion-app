<template>
  <Tabla
    :rows="rowsTabla"
    :disableExpand="true"
    :columns="
    [
  {
    name: 'marca',
    required: true,
    label: 'Marca',
    align: 'left',
    field: (row: any) => row.marca?.nombre,
    sortable: true,
  },
  {
    name: 'alertas',
    required: true,
    label: 'Alertas',
    align: 'left',
    slot:true,
    field: (row: any) => ''+ row.cantidadAvisoSuave + row.cantidadAvisoFuerte
      + row.inventarioAviso + row.inventarioPeriodo + row.cantidadMaxPedido,
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
          label="Buscar"
          labelAdentro
          @update="(v) => (estado.filtros.buscar = v as string)"
          class="col-span-1"
          noSlot />
        <q-btn
          @click="() => (estado.modal.formVariedadCrear = true)"
          icon="add"
          color="green"
          no-caps
          padding="4px 10px" />
      </div>
    </template>
    <template #cell-alertas="{ row }">
      <div class="space-y-[-4px]">
        <h1 v-if="row.cantidadAvisoFuerte">
          <b>stock:</b> Avisar cuando baja debajo de
          {{ row.cantidadAvisoSuave }} y
          {{ row.cantidadAvisoFuerte }}
        </h1>
        <h1 v-if="row.inventarioPeriodo">
          <b>inventario:</b> hacer inventario cada
          {{ row.inventarioPeriodo }} dias, avisar
          {{ row.inventarioAviso }} dias antes
        </h1>
        <h1 v-if="row.cantidadMaxPedido">
          <b>cantidad max:</b> El punto no puede pedir mas de
          {{ row.cantidadMaxPedido }} a la vez
        </h1>
      </div>
    </template>
    <template #cell-actions="{ row }">
      <q-btn-group push @click="e => e.stopPropagation()">
        <q-btn
          @click="
            estado.variedad = row;
            estado.modal.formVariedadModificar = true;
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
          @click="borrarProductoMarca(row)">
        </q-btn>
      </q-btn-group>
    </template>
    <!-- <template #body-expand="{ row }">
      <pre>{{ row }}</pre>
    </template> -->
  </Tabla>

  <Popup
    v-model="estado.modal.formVariedadModificar"
    titulo="Modificar la marca">
    <template #body>
      <formVariedad
        :config="{ producto: estado.producto }"
        :edicion="estado.variedad"
        @modificarObjeto="handleVariedadModificada" />
    </template>
  </Popup>

  <Popup
    v-model="estado.modal.formVariedadCrear"
    titulo="Registrar nueva marca">
    <template #body>
      <formVariedad
        :config="{ producto: estado.producto }"
        @crearObjeto="handleVariedadCreada" />
    </template>
  </Popup>
</template>

<script setup lang="ts">
import formVariedad from '@/modulos/almacen/forms/formVariedad.vue';
const $q = useQuasar();
const props = defineProps({
  productoCorriente: null
});

const estado = reactive({
  // el producto corriente
  producto: props.productoCorriente,

  // la variedad que se esta modificando
  variedad: null,
  // los dialogs
  modal: {
    formVariedadCrear: false,
    formVariedadModificar: false
  },
  // config de los filtros de la tabla
  filtros: {
    buscar: ''
  }
});

const handleVariedadCreada = (variedad, producto) => {
  NotifySucessCenter('Marca registrada éxitosamente');
  estado.modal.formVariedadCrear = false;
  estado.producto = producto;
};

const handleVariedadModificada = (variedad, producto) => {
  NotifySucessCenter('Marca modificada éxitosamente');
  estado.modal.formVariedadModificar = false;
  estado.producto = producto;
};

const borrarProductoMarca = (variedad: any) => {
  $q.dialog({
    title: `Eliminar ${variedad.marca.nombre}`,
    message: 'No se puede deshacer.',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      const productoVariedad = await modificarUno(
        GqlModificarProductos_basico,
        {
          busqueda: estado.producto._id,
          datos: {
            variedades: {
              borrar: { _id: variedad._id }
            }
          }
        }
      );
      if (productoVariedad) {
        NotifySucessCenter('Marca borrado correctamente');
        estado.producto.variedades = estado.producto.variedades.filter(
          e => e._id !== variedad._id
        );
      }
    } catch (err) {
      errFailback(err);
    }
  });
};

/**
 * Rows para la tabla
 */
const rowsTabla = computed(() => {
  let filtered = estado.producto?.variedades;
  if (!filtered) return [];
  if (estado.filtros.buscar != null) {
    const regex = new RegExp(`${estado.filtros.buscar}`, 'i');
    filtered = filtered.filter(variedad => {
      return regex.test(
        variedad.marca.nombre +
          variedad.marca.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      );
    });
  }
  return filtered;
});
</script>

<style lang="scss" scoped></style>
