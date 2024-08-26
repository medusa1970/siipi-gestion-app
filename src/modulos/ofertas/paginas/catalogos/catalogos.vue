<template>
  <NuxtLayout
    :name="authStore.getNegocio.tipo === 'PUNTO' ? 'punto' : 'cathering'"
    :titulo="'Catalogo ' + estado.catalogoSeleccionado?.nombre"
    :navegacion="[
      { label: 'Catalogos', to: 'catalogos' },
      {
        label: estado.catalogoSeleccionado?.nombre,
        to: 'catalogos-id'
      }
    ]">
    <div class="flex justify-center mt-4">
      <q-list class="rounded-borders w-[350px]">
        <q-expansion-item
          expand-separator
          icon="category"
          :label="estado.catalogoSeleccionado?.nombre"
          default-opened
          dense>
          <template v-slot:header>
            <q-item-section>
              <h1>{{ estado.catalogoSeleccionado?.nombre }}</h1>
            </q-item-section>

            <q-item-section side>
              <div class="row items-center">
                <q-icon
                  name="add"
                  size="17px"
                  class="transition-all duration-300 ease-in-out transform hover:scale-125 hover:opacity-100 opacity-75 bg-green-600 text-white rounded-full"
                  @click.stop="
                    modalCrearCatalogoCategoria(estado.catalogoSeleccionado)
                  " />
              </div>
            </q-item-section>
          </template>
          <q-list
            v-for="(item, index) in estado.catalogoSeleccionado?.hijas ?? []"
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
                <q-item-section>
                  {{ item.nombre }}
                </q-item-section>

                <q-item-section side>
                  <div class="row items-center">
                    <q-icon
                      name="add"
                      size="17px"
                      class="transition-all duration-300 ease-in-out transform hover:scale-125 hover:opacity-100 opacity-75 bg-green-600 text-white rounded-full"
                      @click.stop="modalCrearCatalogoCategoria(item)" />
                    <q-icon
                      name="edit"
                      color="primary"
                      size="17px"
                      class="transition-all duration-300 ease-in-out transform hover:scale-125 hover:opacity-100 opacity-75"
                      @click.stop="modalModificarCatalogoCategoria(item)" />
                    <q-icon
                      v-if="item.hijas?.length == 0"
                      name="delete"
                      color="red"
                      size="17px"
                      class="transition-all duration-300 ease-in-out transform hover:scale-125 hover:opacity-100 opacity-75"
                      @click.stop="
                        borrarCatalogoArbol(item, estado.catalogoId)
                      " />
                  </div>
                </q-item-section>
              </template>
              <q-list v-for="(item2, index) in item.hijas ?? []" :key="index">
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
                    <q-item-section>
                      {{ item2.nombre }} ({{
                        item2.ofertas.length
                      }})</q-item-section
                    >

                    <q-item-section side>
                      <div class="row items-center">
                        <q-icon
                          name="edit"
                          color="primary"
                          size="17px"
                          class="transition-all duration-300 ease-in-out transform hover:scale-125 hover:opacity-100 opacity-75"
                          @click.stop="
                            modalModificarCatalogoCategoria(item2)
                          " />
                        <q-icon
                          v-if="item2.ofertas.length == 0"
                          name="delete"
                          color="red"
                          size="17px"
                          class="transition-all duration-300 ease-in-out transform hover:scale-125 hover:opacity-100 opacity-75"
                          @click.stop="
                            borrarCatalogoArbol(item2, estado.catalogoId)
                          " />
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

  <!-- MODAL CATALOGO -->
  <q-dialog persistent v-model="estado.modal.show_agregarCategoriaCatalogo">
    <q-card class="p-3 w-[380px]">
      <div class="flex justify-between">
        <h1 class="text-lg font-bold">Agregar Catalogo</h1>
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
          v-model="estado.datos_catalogoCategoria.nombre"
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
          @click="crearCatalogoArbol(estado.catalogoId)"></q-btn>
      </div>
    </q-card>
  </q-dialog>

  <!-- MODAL editar CATALOGO -->
  <q-dialog persistent v-model="estado.modal.show_modificarCategoriaCatalogo">
    <q-card class="p-3 w-[380px]">
      <div class="flex justify-between">
        <h1 class="text-lg font-bold">Editar Catalogoo</h1>
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
          v-model="estado.datos_catalogoCategoria.nombre"
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
          @click="modificarCatalogoArbol(estado.catalogoId)"></q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { areaInfo } from '../../oferta.definicion';
import { useCatalogos } from './catalogos.composable';
const {
  estado,
  store,
  authStore,
  route,
  router,
  modalCrearCatalogoCategoria,
  crearCatalogoArbol,
  modalModificarCatalogoCategoria,
  modificarCatalogoArbol,
  borrarCatalogoArbol
} = useCatalogos();

onBeforeMount(async () => {
  estado.catalogoId = areaInfo[route.params.area as string].catalogo;
  if (!estado.catalogoId) {
    goTo(router, '404');
  }
  estado.catalogoSeleccionado = await store.getCatalogoArbol(estado.catalogoId);
});
</script>
