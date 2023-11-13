<template>
  <header class="shadow-lg">
    <div
      class="flex items-center justify-between h-[5rem] max-w-full xl:mx-36 lg:mx-20 md:mx-10 sm:mx-5 mx-2 px-[1rem] bg-red-300">
      <nav class="flex flex-grow basis-0 items-end gap-2">
        <h1 class="font-bold text-lg">PUNTO ABASTO</h1>
        <q-select
          dense
          filled
          v-model="model"
          :options="options"
          option-value="id"
          option-label="desc"
          option-disable="inactive"
          emit-value
          map-options
          style="min-width: 100px; max-width: 300px" />
      </nav>
      <nav class="flex flex-grow justify-end basis-0 items-center gap-2">
        <q-btn dense flat round style="width: 55px; height: 55px"
          ><img
            style="border-radius: 100%; object-fit: cover"
            src="https://avatars.githubusercontent.com/u/739984?v=4"
            alt="" />
          <q-menu
            transition-show="rotate"
            transition-hide="rotate"
            anchor="bottom end"
            self="top end">
            <q-list style="min-width: 100px">
              <q-item clickable>
                <q-item-section> Perfil </q-item-section>
              </q-item>
              <q-separator />
              <q-expansion-item group="somegroup" label="Negocios">
                <q-list class="px-2">
                  <q-item clickable>
                    <q-item-section> Negocio 1 </q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section> Negocio 2 </q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>
              <q-item clickable>
                <q-item-section> Cerrar sesión </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </nav>
    </div>
  </header>
  <main>
    <Container>
      <slot></slot>
    </Container>
    <!-- TOASTIFY -->
    <!-- <UNotifications /> -->
  </main>
  <!-- <footer>footer</footer> -->
  <!-- <UNotifications /> -->
</template>
<script setup>
import { ref } from 'vue';

const model = ref(null);
const options = [
  {
    id: 'goog',
    desc: 'Administrador'
  },
  {
    id: 'fb',
    desc: 'Cajero'
  }
];
</script>
