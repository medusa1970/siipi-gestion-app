<template>
  <Navigation2
    :nav="[
      { label: 'empleados', to: 'empleados' },
      {
        label: `${store.empleado?.persona.nombre} ${store.empleado?.persona.nombre}`,
        to: 'empleado',
        params: { id: store.empleado?._id },
      },
    ]"
  />
  <div id="pageContainer">
    <q-tabs
      v-model="estado.tab"
      inline-label
      outside-arrows
      mobile-arrows
      class="bg-grey-7 text-white shadow-2"
      no-caps
    >
      <q-tab name="persona" icon="person" label="Persona" />
      <q-tab name="cargos" icon="work" label="Cargos" />
      <q-tab name="permisos" icon="group" label="Permisos" />
    </q-tabs>
    <q-tab-panels
      v-model="estado.tab"
      animated
      style="height: calc(100vh - 115px)"
    >
      <q-tab-panel name="persona" animated>
        <PersonaTabPanel />
      </q-tab-panel>
      <q-tab-panel name="permisos" animated>
        <PermisosTabPanel />
      </q-tab-panel>
      <q-tab-panel name="cargos" animated>
        <CargosTabPanel />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'cathering' });
import { useEmpleadoDetalle } from './empleadoDetalle.composable';
const composable = useEmpleadoDetalle();
const { estado, store } = composable;
const { params } = useRoute();
const router = useRouter();

import PersonaTabPanel from './persona/empleadoPersona.vue';
import PermisosTabPanel from './permisos/empleadoPermisos.vue';
import CargosTabPanel from './cargos/empleadoCargos.vue';

onMounted(async () => {
  await store.getEmpleados();
  const empleado = store.empleados.find((prod) => {
    return prod._id === params.id;
  });
  if (empleado) {
    store.empleado = empleado;
  } else {
    console.log('ooooh'); // goTo(router, 'empleados');
  }
});
</script>
