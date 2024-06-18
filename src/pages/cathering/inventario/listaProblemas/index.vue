<template>
  <Navigation label="listaProblemas" icon="folder" />
  <h1 class="font-bold text-lg">Lista de problemas</h1>
  <div class="flex flex-wrap gap-5 my-3 justify-center">
    <div
      class="shadow-md w-56 p-4 flex"
      v-for="problema in listProblems"
      :key="problema._id"
    >
      <h1 class="font-bold w-full text-center">
        {{ problema.producto.nombre }}
      </h1>
      <p class="italic">{{ formatDate(problema._creado) }}</p>
      <h1>Hay {{ problema.diferencias.length }} diferencias</h1>
      <q-btn
        color="green"
        label="Solucionar"
        dense
        no-caps
        size="13px"
        icon="check"
        padding="5px 15px"
        class="m-auto mt-2"
        @click="
          router.push(`/cathering/inventario/listaProblemas/${problema._id}`)
        "
      />
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'vue-router';
import { inventarioService } from '../../../../services/inventary.service';
definePageMeta({
  layout: 'cathering',
});

const router = useRouter();
const authStore = useAuthStore();
const listProblems = ref([]);

const formatDate = (date) => {
  return format(new Date(date), 'dd-MM-yyyy, EEEE', { locale: es });
};

const getAllProblem = async () => {
  try {
    showLoading();
    const listaProblemas = await inventarioService.buscarProblemasNoResueltos(
      authStore.negocio._id,
    );

    // console.log(res);
    listProblems.value = res;
    if (res.length > 0) {
      NotifyWarning('Se encontraron problemas debe resolveross');
    } else {
      NotifySucess('No hay problemas por resolver😯');
    }
    hideLoading();
  } catch (error) {
    ApiError(error);
  }
};

onMounted(() => {
  getAllProblem();
});
</script>
