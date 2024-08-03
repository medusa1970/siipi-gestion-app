<template>
  <NuxtLayout name="cathering">
    <q-tabs
      v-model="estado.tabActiva"
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
      v-model="estado.tabActiva"
      animated
      style="height: calc(100vh - 115px)"
    >
      <q-tab-panel name="persona" animated>
        <PersonaTabPanel :key="store.empleado?._id" />
      </q-tab-panel>
      <q-tab-panel name="cargos" animated>
        <CargosTabPanel :key="store.empleado?._id" />
      </q-tab-panel>
      <q-tab-panel name="permisos" animated>
        <PermisosTabPanel :key="store.empleado?._id" />
      </q-tab-panel>
    </q-tab-panels>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useEmpleadoDetalle } from "./empleadoDetalle.composable";
const { estado, store, authStore, router } = useEmpleadoDetalle();
const { params } = useRoute();

provide("infoPagina", {
  titulo: "Gestion de empleados",
  camino: [
    { label: "empleados", to: "empleados" },
    {
      label: `${store.empleado?.persona.nombre} ${store.empleado?.persona.apellido}`,
      to: "empleado",
      params: { id: store.empleado?._id },
    },
  ],
});

// otros imports
import PersonaTabPanel from "./persona/empleadoPersona.vue";
import PermisosTabPanel from "./permisos/empleadoPermisos.vue";
import CargosTabPanel from "./cargos/empleadoCargos.vue";

onBeforeMount(async () => {
  const empleado = await store.useEmpleado(params.id);
  if (!empleado) goTo(router, "empleados");
});
</script>
