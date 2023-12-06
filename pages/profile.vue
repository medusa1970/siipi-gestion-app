<template>
  <div class="flex justify-center items-center h-[75vh]">
    <q-form class="p-4 shadow-lg">
      <div class="flex">
        <div class="w-44 flex flex-col items-center gap-1">
          <h1 class="font-bold text-lg">Jaime Vallejos</h1>
          <q-img
            class="rounded-full w-[80%]"
            src="https://i.pinimg.com/564x/9f/9c/97/9f9c97b0c48c4a03270da070c7fe0bde.jpg"
          />
          <h1>Administrador</h1>
          <q-badge
            rounded
            color="green"
            label="propietario"
            class="px-3 py-1"
          />
        </div>
        <div class="flex flex-col justify-center gap-3">
          <q-input
            v-model="profile.nombre"
            type="text"
            label="Nombre"
            class="w-64"
          />
          <q-input
            v-model="profile.correo"
            type="text"
            label="Correo"
            class="w-64"
          />
          <q-input
            v-model="profile.telefono"
            type="text"
            label="Telefono"
            class="w-64"
          />
        </div>
      </div>
      <div class="mt-2 text-end">
        <q-btn
          label="Reset"
          type="reset"
          color="secondary"
          flat
          dense
          class="px-3"
          no-caps
        />
        <q-btn
          label="Actualizar"
          color="secondary"
          dense
          class="px-3"
          no-caps
          @click="modificarPersona()"
        />
      </div>
    </q-form>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { authStore } from '@/stores/auth.store';
import {
  ApiError,
  NotifyError,
  NotifySucess,
  hideLoading,
  showLoading
} from '@/helpers/message.service';

const useAuth = authStore();
const profile = ref({
  _id: '',
  nombre: '',
  correo: '',
  telefono: ''
});

const modificarPersona = async () => {
  delete profile.value._id;
  try {
    showLoading();
    await GqlModificarPersona({
      busqueda: { _id: useAuth.user._id },
      datos: profile.value
    });
    NotifySucess('Persona modificada correctamente');
    hideLoading();
  } catch (error) {
    ApiError(error);
  }
};
const getPersona = async () => {
  try {
    showLoading();
    const { personaBuscar } = await GqlBuscarPersona({
      busqueda: { _id: useAuth.user._id }
    });
    profile.value = personaBuscar[0];
    hideLoading();
  } catch (error) {
    ApiError(error);
  }
};

onMounted(() => {
  getPersona();
});
</script>
