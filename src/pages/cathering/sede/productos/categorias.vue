<template>
  <h1 class="text-lg font-extrabold uppercase text-center">
    Gestion de categorias
  </h1>

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
        label="Selecciona una categoria"
        default-opened
        switch-toggle-side
        dense
      >
        <template v-slot:header>
          <q-item-section> <h1>Selecciona una categoria</h1> </q-item-section>

          <q-item-section side>
            <div class="row items-center">
              <q-icon
                name="add"
                size="17px"
                class="transition-all duration-300 ease-in-out transform hover:scale-125 hover:opacity-100 opacity-75 bg-green-600 text-white rounded-full"
                @click.stop="modalAgregarCategoria(categoria)"
              />
            </div>
          </q-item-section>
        </template>
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
            <template v-slot:header>
              <q-item-section> {{ item.nombre }} </q-item-section>

              <q-item-section side>
                <div class="row items-center">
                  <q-icon
                    name="add"
                    size="17px"
                    class="transition-all duration-300 ease-in-out transform hover:scale-125 hover:opacity-100 opacity-75 bg-green-600 text-white rounded-full"
                    @click.stop="modalAgregarCategoria(item)"
                  />
                  <q-icon
                    name="edit"
                    color="primary"
                    size="17px"
                    class="transition-all duration-300 ease-in-out transform hover:scale-125 hover:opacity-100 opacity-75"
                    @click.stop="modalEditarCategoria(item)"
                  />
                  <q-icon
                    name="delete"
                    color="red"
                    size="17px"
                    class="transition-all duration-300 ease-in-out transform hover:scale-125 hover:opacity-100 opacity-75"
                    @click.stop="borrarCategoriaArbol(item)"
                  />
                </div>
              </q-item-section>
            </template>

            <!-- <q-item-section>
            {{ item.nombre }}
          </q-item-section>
          <q-item-section side>
            <div class="row items-center">
              <q-icon name="star" color="red" size="24px" />
              <q-icon name="star" color="red" size="24px" />
              <q-icon name="star" color="red" size="24px" />
            </div>
          </q-item-section> -->
            <q-list v-for="(item2, index) in item.hijas" :key="index">
              <q-expansion-item
                switch-toggle-side
                dense-toggle
                :label="item2.nombre"
                :header-inset-level="1"
                :content-inset-level="2"
                expand-separator
                active-class="text-blue"
              >
                <template v-slot:header>
                  <q-item-section> {{ item2.nombre }} </q-item-section>

                  <q-item-section side>
                    <div class="row items-center">
                      <q-icon
                        name="edit"
                        color="primary"
                        size="17px"
                        class="transition-all duration-300 ease-in-out transform hover:scale-125 hover:opacity-100 opacity-75"
                        @click.stop="modalEditarCategoria(item2)"
                      />
                      <q-icon
                        name="delete"
                        color="red"
                        size="17px"
                        class="transition-all duration-300 ease-in-out transform hover:scale-125 hover:opacity-100 opacity-75"
                        @click.stop="borrarCategoriaArbol(item2)"
                      />
                    </div>
                  </q-item-section>
                </template>
              </q-expansion-item>
            </q-list>
          </q-expansion-item>
        </q-list>
      </q-expansion-item>
    </q-list>
  </div>

  <!-- MODAL -->
  <Dialog
    :title="
      estado.modal.esEditarCategoria ? 'Editar categoria' : 'Agregar categoria'
    "
    v-model="estado.modal.isAddCategoryArbol"
    :handle-submit="
      estado.modal.esEditarCategoria
        ? modificarCategoriaArbol
        : agregarCategoriaArbol
    "
  >
    <template #inputsDialog>
      <q-input v-model="estado.categoria.nombre" type="text" label="nombre" />
    </template>
  </Dialog>
</template>

<script setup>
definePageMeta({
  layout: 'cathering',
});
import { useProducts } from '@/composables/sede/useProducts';

const {
  obtenerTodasCategorias,
  estado,
  agregarCategoriaArbol,
  modalAgregarCategoria,
  modalEditarCategoria,
  modificarCategoriaArbol,
  borrarCategoriaArbol,
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
