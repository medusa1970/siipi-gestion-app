<template>
  <h1 class="text-center font-bold text-lg">Arbol de categorias</h1>

  <!-- TREE -->
  <div class="flex justify-center mt-4">
    <q-list
      bordered
      class="rounded-borders w-[350px]"
      v-for="categoria in estado.categoriaArbol"
      :key="categoria.nombre"
    >
      <q-expansion-item
        expand-separator
        icon="category"
        :label="categoria.nombre"
        default-opened
        dense
      >
        <q-list
          v-for="(item, index) in categoria.hijas"
          :key="index"
          class="border-b-[1px] border-gray-300"
        >
          <q-expansion-item
            :header-inset-level="0.5"
            switch-toggle-side
            dense-toggle
            :label="item.nombre"
            default-opened
            dense
          >
            <q-list v-for="(item2, index) in item.hijas" :key="index">
              <q-expansion-item
                switch-toggle-side
                dense-toggle
                :label="item2.nombre"
                :header-inset-level="1"
                :content-inset-level="2"
                expand-separator
                active-class="text-blue"
                dense
              >
              </q-expansion-item>
            </q-list>
            <q-item clickable dense>
              <q-item-section side @click="modalAgregarCategoria(item)">
                <span class="text-blue ml-20"
                  >Agregar nueva categoria <q-icon name="add"
                /></span>
              </q-item-section>
            </q-item>
          </q-expansion-item>
        </q-list>
        <q-item clickable dense>
          <q-item-section side @click="modalAgregarCategoria(categoria)">
            <span class="text-blue ml-12"
              >Agregar nueva categoria <q-icon name="add"
            /></span>
          </q-item-section>
        </q-item>
      </q-expansion-item>
    </q-list>
  </div>

  <!-- MODAL -->
  <Dialog
    title="Crear categoria"
    v-model="estado.modal.isAddCategoryArbol"
    :handle-submit="agregarCategoriaArbol"
  >
    <template #inputsDialog>
      <q-input v-model="estado.categoria.nombre" type="text" label="nombre" />
    </template>
  </Dialog>
</template>

<script setup>
import { useProducts } from '@/composables/sede/useProducts';

const {
  obtenerTodasCategorias,
  estado,
  agregarCategoriaArbol,
  modalAgregarCategoria,
} = useProducts();

const expanded = ref(['Todas las categorias', 'Diversos', 'Consumibles']);
const selectedCategory = ref('');
const inputValue = ref('');

const updateInputValue = () => {
  if (selectedCategory.value === '') {
    inputValue.value = '';
  } else {
    inputValue.value = selectedCategory.value;
  }
  inputValue.value = selectedCategory.value;
};

onMounted(() => {
  obtenerTodasCategorias();
});
</script>
