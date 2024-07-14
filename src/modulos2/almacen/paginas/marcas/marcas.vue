<template>
  <Navigation2
    :nav="[
      {
        label: 'marcas',
        to: 'marcas2',
      },
    ]"
    titulo="Gestion de marcas"
  />

  <Tabla
    :rows="rowsTablaMarcas"
    :columns="
    [
  {
    name: 'marca',
    required: true,
    label: 'Marca',
    field: (row: any) => row.marca?.nombre,
    sortable: true,
  },
  {
    name: 'alertas',
    required: true,
    label: 'Alertas',
    field: (row: any) => row.cantidadLimite + row.inventarioLimite + row.cantidadMaxPedido,
    sortable: true,
  },
  {
    name: 'categoria',
    required: true,
    label: 'categoria',
    align: 'left',
    field: (row: any) => row.categoria.nombre,
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    slot: true,
  },
]"
  >
    <template #dropdown>
      <div class="w-full grid grid-cols-[1fr_1fr_1fr_auto] gap-3">
        <input-text
          class="col-span-1"
          label="Buscar"
          @update="(v) => (estado.filtros.buscarFiltro = v)"
          porDefecto=""
          noSlot
        />
        <input-select
          class="col-span-1"
          label="Categoria"
          @update="(v) => (estado.filtros.categoriaSeleccionada = v)"
          :opciones="estado.filtros.categoriaOpciones"
          noSlot
        />
        <input-select
          class="col-span-1"
          label="Marca"
          @update="(v) => (estado.filtros.marcaSeleccionada = v)"
          :opciones="estado.filtros.marcaOpciones"
          noSlot
        />
        <q-btn
          class=""
          icon="add"
          color="green"
          no-caps
          padding="4px 10px"
          @click="
            () => {
              estado.modal.formProductoBasico = true;
            }
          "
        />
      </div>
    </template>
    <template #body-cell-actions="{ row }">
      <q-btn-group push @click="(e) => e.stopPropagation()">
        <q-btn
          @click="() => (estado.modal.modificarOferta = true)"
          class="p-1"
          color="black"
          size="sm"
          icon="edit"
        />
      </q-btn-group>
    </template>
    <template #body-expand="{ row }"> EXPAND MARCA </template>
  </Tabla>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'cathering',
});

const router = useRouter();
</script>

<style lang="scss" scoped></style>
