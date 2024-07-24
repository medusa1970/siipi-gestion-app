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
    field: (row: any) => row.cantidadLimite + row.inventarioLimite + row.cantidadMaxPedido,
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right',
    slot: true,
  },
]"
  >
    <template #dropdown>
      <div class="flex">
        <input-text
          @update="(v) => (estado.filtros.buscarFiltro = v as string)"
          class="col-span-1"
          label="Buscar"
          porDefecto=""
          noSlot
        />
        <q-btn
          @click="() => (estado.modal.formVariedadCrear = true)"
          icon="add"
          color="green"
          no-caps
          padding="4px 10px"
        />
      </div>
    </template>
    <template #body-cell-actions="{ row }">
      <q-btn-group push @click="(e) => e.stopPropagation()">
        <q-btn
          @click="modalEditarMarca(row)"
          class="p-1"
          color="black"
          size="sm"
          icon="edit"
        />
        <q-btn
          icon="delete"
          class="p-1"
          color="red"
          size="sm"
          @click="borrarProductoMarca(row)"
        >
          <q-tooltip> Eliminar marca </q-tooltip>
        </q-btn>
      </q-btn-group>
    </template>
    <!-- <template #body-expand="{ row }">
      <pre>{{ row }}</pre>
    </template> -->
  </Tabla>

  <Popup
    v-model="estado.modal.formVariedadModificar"
    titulo="Modificar la marca"
  >
    <template #body>
      <formVariedad
        :edicion="estado.variedad"
        @modificarObjeto="handleVariedadModificada"
      />
    </template>
  </Popup>

  <Popup
    v-model="estado.modal.formVariedadCrear"
    titulo="Registrar nueva marca"
  >
    <template #body>
      <formVariedad @crearObjeto="handleVariedadCreada" />
    </template>
  </Popup>
</template>

<script setup lang="ts">
import formVariedad from '@/modulos/almacen/forms/formVariedad.vue';
import { useProductoVariedades } from './productoVariedades.composable';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';
const { $socket } = useNuxtApp();
const {
  estado,
  store,
  handleVariedadCreada,
  handleVariedadModificada,
  borrarProductoMarca,
} = useProductoVariedades();

/**
 * Rows para la tabla
 */
const rowsTabla = computed(() => {
  let filtered = store.producto?.variedades;
  if (!filtered) return [];
  if (estado.filtros.buscarFiltro != null) {
    const regex = new RegExp(`${estado.filtros.buscarFiltro}`, 'i');
    filtered = filtered.filter((variedad) => {
      return regex.test(
        variedad.marca.nombre +
          variedad.marca.nombre
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''),
      );
    });
  }
  return filtered;
});

const modalEditarMarca = (row: any) => {
  // console.log('ROW' + JSON.stringify(row));
  estado.variedad = row;
  // console.log('ESTADO' + JSON.stringify(estado.variedad));
  estado.modal.formVariedadModificar = true;
};

//inicializaciones
onMounted(async () => {
  $socket.on('cambiosProductos', async (data: any) => {
    await store.refreshProductos();
  });
});
onBeforeUnmount(() => {
  $socket.off('cambiosProductos');
});
</script>

<style lang="scss" scoped></style>
