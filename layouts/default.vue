<template>
  <header class="shadow-lg bg-white">
    <div
      class="flex items-center justify-between h-[5rem] max-w-full xl:mx-36 lg:mx-20 md:mx-10 sm:mx-5 mx-2 px-[1rem]"
    >
      <nav class="flex flex-grow basis-0 gap-2 items-center">
        <h1 class="font-bold text-lg uppercase">
          {{
            useAuth.negocioElegido ? useAuth.negocioElegido.nombre : 'Cliente'
          }}
        </h1>
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
              <q-item clickable @click="$router.push('/profile')">
                <q-item-section avatar>
                  <q-avatar>
                    <img
                      src="https://avatars.githubusercontent.com/u/739984?v=4"
                    />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>Perfil</q-item-label>
                  <q-item-label caption lines="1"
                    >{{ useAuth.user.nombre }}@gmail.com</q-item-label
                  >
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
  </main>
</template>
<script setup>
import { LocalStorage } from 'quasar';
import { useRouter } from 'vue-router';
import { authStore } from '@/stores/auth.store';
import { useQuasar } from 'quasar';

const useAuth = authStore();
const router = useRouter();
const $q = useQuasar();

const logout = () => {
  LocalStorage.remove('token');
  useAuth.user.nombre = '';
  useAuth.user.negocios = [];
  useAuth.token = '';
  router.push('/');
  useAuth.negocioElegido = '';
};

const prueba = (negocio) => {
  console.log(negocio);
  $q.dialog({
    title: `<strong>Entrar a ${negocio.nombre}</strong>`,
    message: '¿Está seguro de cambiar de negocio?',
    cancel: true,
    persistent: true,
    html: true
  }).onOk(async () => {
    router.push(`/${negocio.tipo.toLowerCase()}`);
    useAuth.negocioElegido = negocio; //solucion
    $q.notify({
      type: 'positive',
      position: 'center',
      message: `Bienvenido a ${negocio.nombre}`,
      progress: true,
      timeout: 1000
    });
  });
  console.log(useAuth.user.negocios);
};
</script>
