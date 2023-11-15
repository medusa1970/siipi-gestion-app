<template>
  <header class="shadow-lg">
    <div
      class="flex items-center justify-between h-[5rem] max-w-full xl:mx-36 lg:mx-20 md:mx-10 sm:mx-5 mx-2 px-[1rem]"
    >
      <nav class="flex flex-grow basis-0 gap-2 items-center">
        <h1 class="font-bold text-lg uppercase">
          {{ useAuth.negocioSelected }}
        </h1>
        <q-select
          dense
          v-model="model"
          :options="options"
          option-label="desc"
          emit-value
          style="min-width: 100px; max-width: 300px; font-weight: bold"
          transition-show="jump-down"
          class="mx-2"
        />
      </nav>
      <nav class="flex flex-grow justify-end basis-0 items-center gap-2">
        <q-btn dense flat round style="width: 55px; height: 55px"
          ><img
            style="border-radius: 100%; object-fit: cover"
            src="https://avatars.githubusercontent.com/u/739984?v=4"
            alt=""
          />
          <q-menu
            transition-show="rotate"
            transition-hide="rotate"
            anchor="bottom end"
            self="top end"
          >
            <q-list style="min-width: 100px">
              <q-item clickable>
                <q-item-section avatar>
                  <q-avatar>
                    <img
                      src="https://avatars.githubusercontent.com/u/739984?v=4"
                    />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>Perfil</q-item-label>
                  <q-item-label caption lines="1">will@gmail.com</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-expansion-item
                group="somegroup"
                label="Negocios"
                icon="storefront"
              >
                <template v-slot:header>
                  <q-item-section avatar>
                    <q-icon name="storefront" color="blue" class="px-[10px]" />
                  </q-item-section>

                  <q-item-section> Negocios</q-item-section>
                </template>
                <q-list class="px-2">
                  <q-item
                    clickable
                    @click="sede"
                    v-for="negocio in useAuth.user.negocios"
                  >
                    <q-item-section @click="prueba(negocio)">{{
                      negocio.nombre
                    }}</q-item-section>
                  </q-item>
                  <!-- <q-item clickable @click="marca">
                    <q-item-section> Negocio 2 </q-item-section>
                  </q-item> -->
                </q-list>
              </q-expansion-item>
              <q-item clickable @click="logout">
                <q-item-section avatar class="px-[10px]">
                  <q-icon name="logout" color="red" />
                </q-item-section>
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
import { LocalStorage } from 'quasar';
import { useRouter } from 'vue-router';
import { authStore } from '@/stores/auth.store';

const useAuth = authStore();
const router = useRouter();
const model = ref({
  id: 'goog',
  desc: 'Administrador'
});
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

const logout = () => {
  LocalStorage.remove('token');
  useAuth.user.nombre = '';
  router.push('/');
};

const prueba = (negocio) => {
  router.push(negocio.tipo.toLowerCase());
  useAuth.negocioSelected = negocio.nombre;
};
</script>
