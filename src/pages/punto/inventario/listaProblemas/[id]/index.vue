<template>
  <Navigation
    label="listaProblemas"
    icon="folder"
    href="/punto/inventario/listaProblemas"
    :label2="problem._id"
    icon2="folder"
  />
  <h1 class="font-bold text-center text-lg mt-2 mb-4" v-if="problem.producto">
    Solucion de problema INVENTARIO {{ problem.producto.nombre }}
  </h1>
  <div class="my-3 px-6">
    <q-editor
      v-model="qeditor"
      :dense="$q.screen.lt.md"
      :toolbar="[
        [
          {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify'],
          },
        ],
        ['bold', 'italic', 'strike', 'underline'],
        ['link', 'custom_btn'],
        ['print', 'fullscreen'],
        [
          {
            label: $q.lang.editor.formatting,
            icon: $q.iconSet.editor.formatting,
            list: 'no-icons',
            options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'code'],
          },
          {
            label: $q.lang.editor.fontSize,
            icon: $q.iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'size-1',
              'size-2',
              'size-3',
              'size-4',
              'size-5',
              'size-6',
              'size-7',
            ],
          },
          {
            label: $q.lang.editor.defaultFont,
            icon: $q.iconSet.editor.font,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'default_font',
              'arial',
              'arial_black',
              'comic_sans',
              'courier_new',
              'impact',
              'lucida_grande',
              'times_new_roman',
              'verdana',
            ],
          },
          'removeFormat',
        ],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

        ['viewsource'],
      ]"
      :fonts="{
        arial: 'Arial',
        arial_black: 'Arial Black',
        comic_sans: 'Comic Sans MS',
        courier_new: 'Courier New',
        impact: 'Impact',
        lucida_grande: 'Lucida Grande',
        times_new_roman: 'Times New Roman',
        verdana: 'Verdana',
      }"
    />
    <span class="flex justify-end my-4">
      <q-btn
        label="Resolver"
        icon="save"
        color="secondary"
        @click="resolverProblema"
      />
    </span>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import {
  ApiError,
  hideLoading,
  showLoading,
  NotifyWarning,
  NotifySucessCenter,
} from '~/helpers/message.service';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

definePageMeta({
  layout: 'punto',
});

const { params } = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const texto = ref('');
const qeditor = ref(texto);
const problem = ref({});

const formatDate = (date) => {
  return format(new Date(date), 'dd-MM-yyyy, EEEE', { locale: es });
};

const getProblem = async () => {
  try {
    showLoading();
    const problema = await buscarProblema(authStore.negocio._id, params.id);
    problem.value = problema;
    const text = problem.value.diferencias.map((item) => {
      return `<ol>
    <li><strong>¿Cómo solucionaste la diferencia de ${
      item.diferencia
    } productos, con el vencimiento de ${formatDate(
        item.vencimiento,
      )}?</strong></li>
    </ol>
    <ul>
    <li>Primera solucion: </li>
    <li>Segunda solucion: </li>
    </ul>`;
    });
    texto.value = text;
    hideLoading();
  } catch (error) {
    ApiError(error);
  }
};

const resolverProblema = async () => {
  try {
    showLoading();
    await GqlResolverProblema({
      entidadBusqueda: { _id: authStore.negocioIDSelected },
      problemaBusqueda: { _id: params.id },
      datos: {
        reporte: qeditor.value,
        resuelto: true,
      },
    });
    NotifySucessCenter('Problema resuelto 🙂');
    hideLoading();
    setTimeout(() => {
      router.push('/punto/inventario/listaProblemas');
    }, 1000);
  } catch (error) {
    ApiError(error);
  }
};

onMounted(() => {
  getProblem();
});
</script>
