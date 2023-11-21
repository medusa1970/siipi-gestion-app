<template>
  <div>
    <Navigation label="Productos" icon="list_alt" />
    <Table badge :rows="Productos" :columns="columnsProductos">
      <template #dropdown>
        <q-btn
          icon-right="add"
          color="green"
          label="Agregar producto"
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
          <q-td key="marca" :props="props">
            {{ props.row.marca }}
          </q-td>
          <q-td key="presentaciones" :props="props">
            <div v-for="(p, index) in props.row.presentaciones" :key="index">
              <q-badge color="blue">
                {{ p.nombre }}
              </q-badge>
            </div>
          </q-td>
          <q-td key="inventario" :props="props">
            {{ props.row.inventario }}
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
  <Dialog v-model="test" title="Agregar producto">
    <template #inputsDialog>
      <q-input v-model="producto.nombre" type="text" label="Nombre" />
      <q-input v-model="producto.descripcion" type="text" label="Descripcion" />
      <q-input v-model="producto.marca" type="text" label="marca" />
      <q-input
        v-model="producto.presentaciones"
        type="text"
        label="Presentaciones"
      />
      <q-select
        clearable
        v-model="producto.inventario"
        :options="options"
        label="Inventario"
      />
      <!-- <q-input v-model="producto.tags" type="text" label="Tags" /> -->
      <q-select
        v-model="producto.tags"
        multiple
        :options="tags"
        use-chips
        stack-label
        label="Tags"
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
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { Productos } from '@/mocks/data.json';
import { columnsProductos } from '@/helpers/columns';
import { ref } from 'vue';

const test = ref(false);
const producto = ref({
  nombre: '',
  descripcion: '',
  marca: '',
  presentaciones: '',
  inventario: '',
  tags: ['tag']
});
const options = ['Diario', 'Semanal', 'Mensual'];
const tags = ['empanadas', 'Masas', 'Embutidos', 'pedazos'];
</script>
