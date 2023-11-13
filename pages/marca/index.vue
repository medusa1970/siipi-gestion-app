<template>
  <h1>HOLA estamos en template MARCA</h1>
  <Table :columns="columns" :rows="rows">
    <!-- ACCIONES -->
    <template #body-cell-actions="{ props }">
      <q-td :props="props" class="q-ma-none">
        <q-btn icon="edit" color="primary" flat round>
          <q-tooltip>Editar datos de {{ props.row.nombre }}</q-tooltip></q-btn
        >
        <q-btn icon="delete" color="red" flat round
          ><q-tooltip>Eliminar</q-tooltip></q-btn
        >
      </q-td>
    </template>
  </Table>
</template>

<script setup>
const columns = [
  {
    name: 'nombre',
    required: true,
    label: 'Nombre(s)',
    align: 'left',
    field: (row) => row.nombre,
    sortable: true
  },
  {
    name: 'telefono',
    required: true,
    label: 'Telefono',
    align: 'left',
    field: (row) => row.telefono
  },
  {
    name: 'correo',
    required: true,
    label: 'Correo',
    align: 'left',
    field: (row) => row.correo
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right'
  }
];
const { buscarVariasPersonas: rows } = await GqlBuscarVarias({ busqueda: {} });
</script>
