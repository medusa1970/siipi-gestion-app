<template>
  <div>
    <Navigation label="Empleados" icon="group" />
    <Table :rows="estado.rows" :columns="columnsEmpleados" dense>
      <!-- IMAGES -->
      <template #body-cell-image="{ value }">
        <q-td>
          <q-img :src="value" spinner-color="black" class="cell-image" />
        </q-td>
      </template>
      <template #dropdown>
        <q-btn
          icon-right="add"
          color="green"
          label="Agregar empleadooo"
          no-caps
          style="padding: 7px 15px"
          @click="abrirModal"
        />
      </template>
      <!-- ACTIONS -->
      <template #body-cell-actions="{ props }">
        <q-td :props="props">
          <q-btn color="red" icon="more_horiz" flat round>
            <q-menu
              transition-show="rotate"
              transition-hide="rotate"
              anchor="top start"
              self="top right"
            >
              <q-list dense style="min-width: 100px">
                <q-item clickable v-close-popup>
                  <q-item-section avatar>
                    <q-icon
                      name="accessibility_new"
                      color="green"
                      class="px-[10px]"
                    />
                  </q-item-section>
                  <q-item-section @click="abrirPermisos(props.row)"
                    >Ver permisos</q-item-section
                  >
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section avatar>
                    <q-icon name="edit" color="blue" class="px-[10px]" />
                  </q-item-section>
                  <q-item-section>Editar</q-item-section>
                </q-item>
                <q-separator />
                <q-separator />
                <q-item clickable v-close-popup>
                  <q-item-section avatar>
                    <q-icon name="delete" color="red" class="px-[10px]" />
                  </q-item-section>
                  <q-item-section @click="borrarEmpleado(props.row)"
                    >Eliminar</q-item-section
                  >
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </template>
    </Table>
  </div>

  <!-- DIALOG -->
  <Dialog
    v-model="estado.test"
    title="Agregar empleado"
    :handle-submit="agregarEmpleado"
  >
    <template #inputsDialog>
      <div class="row items-center" style="width: 100%">
        <q-select
          color="primary"
          v-model="estado.personaSelect.nombre"
          :options="estado.personas"
          label="Seleccionar persona"
          option-label="nombre"
          style="width: 100%; flex: 1 0 auto"
          use-input
          input-debounce="0"
          hide-selected
          fill-input
          onfocus="this.select()"
        >
          <template v-slot:append>
            <q-icon
              style="margin: 0"
              name="close"
              @click.stop.prevent="estado.personaSelect.nombre = ''"
              class="cursor-pointer q-mr-md"
            />
          </template>
          <template v-slot:prepend>
            <q-icon name="group" />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No hay resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <q-input v-model="estado.cargo" type="text" label="Cargo" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { columnsEmpleados } from '@/helpers/columns';
import { useEmpleado } from '@/composables/useEmpleado';

const { estado, abrirModal, abrirPermisos, agregarEmpleado, borrarEmpleado } =
  useEmpleado();
</script>

<style scoped>
.cell-image {
  width: 50px;
  height: 50px;
  border-radius: 100%;
}
</style>
