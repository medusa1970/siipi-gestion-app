<template>
  [Usuario]
  <q-menu>
    <q-list style="min-width: 100px">
      <!-- perfil -->
      <q-item clickable @click="show_editarPerfil">
        <q-item-section avatar>
          <q-avatar>
            <img
              v-if="authStore.getUser?.cloudinaryUrl"
              class="rounded-full object-cover"
              style="width: 40px; height: 40px"
              :src="authStore.getUser?.cloudinaryUrl"
            />
            <img
              v-else
              class="rounded-full object-cover"
              style="width: 40px; height: 40px"
              src="https://i.pinimg.com/564x/20/c0/0f/20c00f0f135c950096a54b7b465e45cc.jpg"
            />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>Perfil</q-item-label>
          <q-item-label caption lines="1">{{
            authStore.getUser?.correo
          }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />

      <!-- negocios -->
      <q-expansion-item group="somegroup" label="Negocios" icon="storefront">
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon name="storefront" color="blue" class="px-[10px]" />
          </q-item-section>
          <q-item-section> Negocios </q-item-section>
        </template>
        <q-list class="px-2">
          <q-item
            clickable
            @click="sede"
            v-for="(negocio, index) in authStore.getUser?.negocios"
            :key="negocio.nombre"
          >
            <q-item-section @click="elegirNegocio(index, negocio.nombre)">{{
              negocio.nombre
            }}</q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>

      <!-- logout -->
      <q-item clickable @click="logout">
        <q-item-section avatar class="px-[10px]">
          <q-icon name="logout" color="red" />
        </q-item-section>
        <q-item-section> Cerrar sesión </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';
import { useUsuarioService } from '~/modulos/main/negocio/useUsuarioService';

import type { EditarPerfil } from '~/modulos/main/negocio/usuario.interface';
import type { Persona } from '~/modulos/main/API/usuario.interfaceApi';

const usuarioService = useUsuarioService();
const authStore = useAuthStore();
const router = useRouter();

// MODAL editarPerfil
const show_editarPerfil = ref(false);
const init_editarPerfil = {
  nombre: '',
} as EditarPerfil;
const datos_editarPerfil = ref(init_editarPerfil);
const editarPerfil = async () => {
  if (!authStore.getUserId) {
    return false; // TODO Notify error ?
  }
  const usuario = await usuarioService.editarPerfil(
    authStore.getUserId,
    datos_editarPerfil.value,
  );
  if (usuario !== null) {
    NotifySucessCenter('Usuario editado correctamente');
    show_editarPerfil.value = false;
    Object.assign(datos_editarPerfil, init_editarPerfil);
  }
};

// logout
const logout = () => {
  const username = authStore.getUser?.nombre;
  authStore.logout();
  NotifySucess(`Hasta pronto ${username}!`);
  router.push('/');
};
</script>

<style lang="scss" scoped></style>
