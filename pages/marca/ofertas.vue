<template>
  <div>
    <Navigation label="Ofertas" icon="folder" />
    <Table :rows="Catalogos[0].items" :columns="columnsOfertas" badge>
      <!-- AGREGAR -->
      <template #dropdown>
        <q-btn
          icon-right="add"
          color="green"
          label="Agregar oferta"
          no-caps
          style="padding: 7px 15px"
          @click="() => (test = true)"
        />
      </template>
      <!-- BADGE -->
      <template #rows-badge="{ props }">
        <q-tr :props="props">
          <q-td key="nombre" :props="props">
            {{ props.row.nombre }}
          </q-td>
          <q-td key="descripcion" :props="props">
            {{ props.row.descripcion }}
          </q-td>
          <q-td key="productos" :props="props">
            <div v-for="(producto, index) in props.row.productos" :key="index">
              <h2>{{ producto.p }}</h2>
            </div>
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
  <!-- MODAL AGREGAR PRODUCTO -->
  <Dialog v-model="test" title="Agregar oferta">
    <template #inputsDialog>
      <q-select
        v-model="oferta.producto"
        multiple
        :options="Catalogos[0].items"
        use-chips
        stack-label
        label="Productos"
        option-label="nombre"
      >
        <template v-slot:selected-item="scope">
          <q-chip
            removable
            dense
            @remove="scope.removeAtIndex(scope.index)"
            :tabindex="scope.tabindex"
            color="green"
            text-color="white"
            class="p-3"
            >{{ scope.opt }}</q-chip
          >
        </template>
      </q-select>
      <q-input v-model="oferta.nombre" type="text" label="Nombre" />
      <q-input v-model="oferta.descripcion" type="text" label="Descripcion" />
      <q-input v-model="oferta.grupos" type="text" label="Grupo" />
      <q-input v-model="oferta.precio" type="text" label="Precio" />
      <!-- <q-select
        clearable
        v-model="oferta.inventario"
        :options="options"
        label="Inventario"
      /> -->
      <!-- <q-input v-model="producto.tags" type="text" label="Tags" /> -->
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { Catalogos } from '@/mocks/data.json';
import { columnsOfertas } from '@/helpers/columns';
import { ref } from 'vue';
console.log(Catalogos[0].items);

const test = ref(false);
const oferta = ref({
  producto: ['pastel choclo'],
  nombre: '',
  descripcion: '',
  grupos: '',
  precio: ''
});
</script>
