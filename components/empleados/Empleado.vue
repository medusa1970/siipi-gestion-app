<template>
  <div>
    <Navigation label="Empleados" icon="group" />
    <Table :rows="rows" :columns="columnsEmpleados" dense>
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
          @click="openDialog"
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
                  <q-item-section @click="openPermisos(props.row)"
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
    v-model="test"
    title="Agregar empleado"
    :handle-submit="agregarEmpleado"
  >
    <template #inputsDialog>
      <div class="row items-center" style="width: 100%">
        <q-select
          color="primary"
          v-model="personaSelect.nombre"
          :options="personas"
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
              @click.stop.prevent="personaSelect.nombre = ''"
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
      <q-input v-model="cargo" type="text" label="Cargo" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { authStore } from '@/stores/auth.store';
import { columnsEmpleados } from '@/helpers/columns';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import {
  showLoading,
  hideLoading,
  NotifySucess,
  ApiError
} from '@/helpers/message.service';
import { useQuasar } from 'quasar';

const test = ref(false);
const router = useRouter();
const useAuth = authStore();
const personaSelect = ref({ id: '', nombre: '' });
const personas = ref<any>([]);
const cargo = ref('');
const rows = ref<any>([]);
const $q = useQuasar();

const getAllEntity = async () => {
  showLoading();
  const { buscarEntidad } = await GqlBuscarEntidadEmpleados({
    busqueda: { nombre: useAuth.negocioSelected }
  });
  rows.value = buscarEntidad?.empleados?.map((empleado) => {
    return {
      id: empleado.personaId._id,
      nombre: empleado.personaId.nombre,
      correo: empleado.personaId.correo,
      telefono: empleado.personaId.telefono,
      cargo: empleado.cargo,
      foto: 'https://mighty.tools/mockmind-api/content/popular/32.jpg'
    };
  });
  hideLoading();
};

const openPermisos = (row: { id: string }) => {
  router.push(`/sede/empleados/${row.id}`);
};

const openDialog = () => {
  test.value = true;
};

const getAllPeoples = async () => {
  const { buscarPersonas } = await GqlBuscarPersonas({ busqueda: {} });
  personas.value = buscarPersonas?.map((persona) => {
    return {
      id: persona._id,
      nombre: persona.nombre
    };
  });
};
const agregarEmpleado = async () => {
  try {
    showLoading();
    await GqlAgregarEmpleadoEntidad({
      entidadId: useAuth.negocioIDSelected,
      personaId: personaSelect.value.id,
      datos: { cargo: cargo.value }
    });
    NotifySucess('Empleado agregado');
    getAllEntity();
    getAllPeoples();
    personaSelect.value.nombre = '';
    cargo.value = '';
    test.value = false;
    hideLoading();
  } catch (err: any) {
    ApiError(err);
  }
};

/**DELETE ARTICLE */
const borrarEmpleado = async (row: { id: string; nombre: string }) => {
  $q.dialog({
    title: `Eliminar ${row.nombre}`,
    message: '¿Está seguro de eliminar este articulo?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await GqlBorrarEmpleadoEntidad({
      entidadId: useAuth.negocioIDSelected,
      personaId: row.id
    });
    NotifySucess('Empleado eliminado');
    getAllEntity();
    // articles.value = articles.value.filter((user) => user._id !== row._id);
  });
};

onMounted(() => {
  getAllEntity();
  getAllPeoples();
});

// defineProps({});
</script>

<style scoped>
.cell-image {
  width: 50px;
  height: 50px;
  border-radius: 100%;
}
</style>
