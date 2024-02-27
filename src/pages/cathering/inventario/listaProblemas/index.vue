<template>
  <Navigation label="listaProblemas" icon="folder" />
  <h1 class="font-bold text-lg">Lista de problemas</h1>
  <div class="flex flex-wrap gap-5 my-3">
    <div
      class="shadow-md w-56 p-4 flex"
      v-for="problema in listProblems"
      :key="problema._id"
    >
      <h1 class="font-bold">{{ problema._id }}</h1>
      <p class="italic">{{ formatDate(problema.fechaAparicion) }}</p>
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
        @click="router.push(`/punto/inventario/listaProblemas/${problema._id}`)"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { authStore } from "@/stores/auth.store";
import {
  ApiError,
  hideLoading,
  showLoading,
  NotifySucess,
  NotifyError,
  NotifyWarning,
} from "@/helpers/message.service";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "vue-router";
definePageMeta({
  layout: "cathering",
});

const router = useRouter();
const useAuth = authStore();
const listProblems = ref([]);

const formatDate = (date) => {
  return format(new Date(date), "dd-MM-yyyy, EEEE", { locale: es });
};

const getAllProblem = async () => {
  try {
    showLoading();
    const { entidadListarProblemas: res } = await GqlListarProblemas({
      entidadBusqueda: { _id: useAuth.negocioElegido._id },
      problemaBusqueda: { resuelto: false },
    });
    console.log(res);
    listProblems.value = res;
    if (res.length > 0) {
      NotifyWarning("Se encontraron problemas debe resolverlas");
    } else {
      NotifySucess("No hay problemas por resolver😯");
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
