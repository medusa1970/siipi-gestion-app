<template>
  <div>
    <Navigation label="Ofertas" icon="folder" />
    <Table :rows="estado.ofertas" :columns="columnsOfertas" badge dense>
      <!-- AGREGAR -->
      <template #dropdown>
        <a href="ofertas/detailOferta">
          <q-btn
            icon-right="add"
            color="green"
            label="Agregar oferta"
            no-caps
            style="padding: 7px 15px"
          />
        </a>
      </template>
      <!-- BADGE -->
      <template #rows-badge="{ props }">
        <q-tr :props="props">
          <q-td key="nombre" :props="props">
            {{ props.row.nombre }}
          </q-td>
          <q-td key="ingredientes" :props="props">
            <h1 v-if="props.row.ingredientes[0]">
              {{ props.row.ingredientes[0]._tipo }}
            </h1>
            <h1 v-else class="text-red-500">No hay ingredientes</h1>
          </q-td>
          <q-td key="preparados" :props="props">
            <h1 v-if="props.row.preparados">
              {{ props.row.preparados.length }}
            </h1>
          </q-td>
          <q-td key="grupos" :props="props">
            <div v-for="(grupo, index) in props.row.grupos" :key="index">
              <q-badge color="green">
                {{ grupo }}
              </q-badge>
            </div>
          </q-td>
          <q-td key="precio" :props="props">
            {{ props.row.precio + ' Bs' }}
          </q-td>
          <q-td key="ocultar" :props="props">
            <q-toggle v-model="props.row.ocultar" />
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn color="red" icon="more_horiz" flat round>
              <q-menu
                transition-show="rotate"
                transition-hide="rotate"
                anchor="top start"
                self="top right"
              >
                <q-list dense style="min-width: 100px">
                  <q-item clickable v-close-popup class="test">
                    <q-icon name="edit" size="20px" color="blue" />
                    <q-item-section class="font-bold">Editar</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup class="test">
                    <q-icon name="delete" size="20px" color="red" />
                    <q-item-section class="font-bold">Eliminar</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { columnsOfertas } from '@/helpers/columns';
import { useOferta } from '@/composables/marca/useOferta';

const { estado } = useOferta();
</script>
<style scoped>
/* Estilo base del checkbox */
.weekday {
  display: none !important;
}
input[type='checkbox'] + label {
  display: inline-block;
  border-radius: 50%;
  background: #dddddd;
  height: 37px;
  width: 37px;
  line-height: 37px;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
}
input[type='checkbox']:checked + label {
  background: #007bff;
  color: #ffffff;
}
</style>
