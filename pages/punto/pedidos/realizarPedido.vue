<template>
  <div>
    <h1>Realizar pedido</h1>
    <div class="grid xl:grid-cols-3 md:grid-cols-2 gap-4 max-sm:grid-cols-1">
      <div v-for="categoria in categorias" class="col-span-1">
        <Expansion :title="categoria.nombre">
          <template #contenido>
            <div class="flex justify-center">
              <q-input
                borderless
                dense
                debounce="300"
                color="secondary"
                v-model="filter"
                style="
                  border: 0.5px solid #757575;
                  padding: 0 10px;
                  width: 280px;
                "
                placeholder="Buscar"
              >
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click.stop.prevent="filter = ''"
                    class="cursor-pointer"
                    size="22px"
                  />
                </template>
                <template v-slot:prepend>
                  <q-icon name="search" size="22px" />
                </template>
              </q-input>
            </div>
          </template>
        </Expansion>
      </div>
    </div>
  </div>
</template>
<script setup>
import categorias from '@/mocks/categoria.json';
</script>
