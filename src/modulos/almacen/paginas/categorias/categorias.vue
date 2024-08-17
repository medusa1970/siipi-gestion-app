<template>
  <NuxtLayout
    :name="authStore.getNegocio.tipo === 'PUNTO' ? 'punto' : 'cathering'"
    titulo="Gestion de categorias"
    :navegacion="[{ label: 'Categorias', to: 'categorias' }]">
    <!-- ARBOL -->
    <div class="flex justify-center mt-4">
      <q-list
        class="rounded-borders w-[350px]"
        v-for="categoria in estado.categorias"
        :key="categoria._id">
        <q-expansion-item
          expand-separator
          icon="category"
          :label="categoria.nombre"
          default-opened
          dense>
          <template v-slot:header>
            <q-item-section>
              <h1>{{ categoria?.nombre }}</h1>
            </q-item-section>

            <q-item-section side>
              <div class="row items-center">
                <q-icon
                  name="add"
                  size="17px"
                  class="transition-all duration-300 ease-in-out transform hover:scale-125 hover:opacity-100 opacity-75 bg-green-600 text-white rounded-full"
                  @click.stop="modalCrearCategoria(categoria)" />
              </div>
            </q-item-section>
          </template>
          <q-list
            v-for="(item, index) in categoria?.hijas"
            :key="index"
            class="border-b-[1px] border-gray-300">
            <q-expansion-item
              :header-inset-level="0.5"
              switch-toggle-side
              dense-toggle
              :label="item.nombre"
              default-opened
              dense>
              <template v-slot:header>
                <q-item-section> {{ item.nombre }} </q-item-section>

                <q-item-section side>
                  <div class="row items-center">
                    <q-icon
                      name="add"
                      size="17px"
                      class="transition-all duration-300 ease-in-out transform hover:scale-125 hover:opacity-100 opacity-75 bg-green-600 text-white rounded-full"
                      @click.stop="modalCrearCategoria(item)" />
                    <q-icon
                      name="edit"
                      color="primary"
                      size="17px"
                      class="transition-all duration-300 ease-in-out transform hover:scale-125 hover:opacity-100 opacity-75"
                      @click.stop="modalModificarCategoria(item)" />
                    <q-icon
                      v-if="item.hijas.length == 0"
                      name="delete"
                      color="red"
                      size="17px"
                      class="transition-all duration-300 ease-in-out transform hover:scale-125 hover:opacity-100 opacity-75"
                      @click.stop="borrarCategoriaArbol(item)" />
                  </div>
                </q-item-section>
              </template>
              <q-list v-for="(item2, index) in item.hijas" :key="index">
                <q-expansion-item
                  switch-toggle-side
                  dense-toggle
                  :label="item2.nombre"
                  :header-inset-level="1"
                  :content-inset-level="2"
                  expand-separator
                  active-class="text-blue"
                  dense>
                  <template v-slot:header>
                    <q-item-section> {{ item2.nombre }} </q-item-section>

                    <q-item-section side>
                      <div class="row items-center">
                        <q-icon
                          name="edit"
                          color="primary"
                          size="17px"
                          class="transition-all duration-300 ease-in-out transform hover:scale-125 hover:opacity-100 opacity-75"
                          @click.stop="modalModificarCategoria(item2)" />
                        <q-icon
                          v-if="item2.productos.length == 0"
                          name="delete"
                          color="red"
                          size="17px"
                          class="transition-all duration-300 ease-in-out transform hover:scale-125 hover:opacity-100 opacity-75"
                          @click.stop="borrarCategoriaArbol(item2)" />
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
  </NuxtLayout>

  <!-- DIALOGOS -->
  <!-- MODAL CATEGORIA -->
  <q-dialog persistent v-model="estado.modal.show_agregarCategoria">
    <q-card class="p-3 w-[380px]">
      <div class="flex justify-between">
        <h1 class="text-lg font-bold">Agregar Categoria</h1>
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          class="border-2 border-red-500" />
      </div>
      <!-- <q-space /> -->

      <div class="my-1">
        <q-input
          v-model="estado.datos_categoria.nombre"
          label="Nombre categoria"
          dense />
      </div>
      <div class="flex row justify-center">
        <q-btn
          class="mt-2 mb-1"
          no-caps
          style="font-size: 15px"
          padding="4px 10px"
          label="Guardar"
          color="secondary"
          type="submit"
          @click="crearCategoriaArbol"></q-btn>
      </div>
    </q-card>
  </q-dialog>

  <!-- MODAL editar CATEGORIA -->
  <q-dialog persistent v-model="estado.modal.show_modificarCategoria">
    <q-card class="p-3 w-[380px]">
      <div class="flex justify-between">
        <h1 class="text-lg font-bold">Editar Categoria</h1>
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          class="border-2 border-red-500" />
      </div>
      <!-- <q-space /> -->

      <div class="my-1">
        <q-input
          v-model="estado.datos_categoria.nombre"
          label="Nombre del catalogo"
          dense />
      </div>
      <div class="flex row justify-center">
        <q-btn
          class="mt-2 mb-1"
          no-caps
          style="font-size: 15px"
          padding="4px 10px"
          label="Guardar"
          color="secondary"
          type="submit"
          @click="modificarCategoriaArbol"></q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useCategorias } from './categorias.composable';
const {
  estado,
  authStore,
  router,
  buscarCategorias,
  modalCrearCategoria,
  crearCategoriaArbol,
  modalModificarCategoria,
  modificarCategoriaArbol,
  borrarCategoriaArbol
} = useCategorias();

onMounted(async () => {
  await buscarCategorias();
});
</script>

<style lang="scss" scoped></style>
./categorias.composable
