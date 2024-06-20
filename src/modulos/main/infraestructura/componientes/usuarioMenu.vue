<template>
  <q-btn color="green">
    {{ authStore.getUsuario?.nombre || 'USUARIO' }}
    <q-menu
      transition-show="rotate"
      transition-hide="rotate"
      anchor="bottom end"
      self="top end"
    >
      <q-list style="min-width: 100px">
        <!-- perfil -->
        <q-item clickable @click="toggle_editarPerfil">
          <q-item-section avatar>
            <q-avatar>
              <img
                v-if="authStore.getUsuario?.cloudinaryUrl"
                class="rounded-full object-cover"
                style="width: 40px; height: 40px"
                :src="authStore.getUsuario?.cloudinaryUrl"
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
              authStore.getUsuario?.correo
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
              v-for="(negocio, index) in authStore.getUsuario?.negocios"
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
  </q-btn>

  <q-dialog v-model="show_editarPerfil">
    <q-card :style="cardBig ? 'width: 450px' : 'width: 380px'" class="p-3">
      <q-card-section>
        <div class="flex justify-between">
          <h1 class="text-lg font-bold">Editar perfil</h1>
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
            class="border-2 border-red-500"
          />
        </div>
      </q-card-section>

      <q-form @submit.prevent="editarPerfil">
        <q-card-section>
          <input-text
            label="Nombre"
            @update="(v) => (ref_editarPerfil.nombre = v)"
            :default="ref_editarPerfil.nombre"
          />
          <br />
          <input-text
            label="Apellido"
            @update="(v) => (ref_editarPerfil.apellido = v)"
            :default="ref_editarPerfil.apellido"
          />
          <br />
          <input-text
            label="telefono"
            @update="(v) => (ref_editarPerfil.telefono = v)"
            :default="ref_editarPerfil.telefono"
          />
          <br />
          <input-text
            label="email"
            @update="(v) => (ref_editarPerfil.correo = v)"
            :default="ref_editarPerfil.correo"
          />
          <br />
          <input-image
            label="Cambiar imagen"
            @update="(v) => (ref_editarPerfil.imagen.data = v)"
            :default="ref_editarPerfil.imagen.data"
            maxSizeKb="500"
          />
          <br />
          <div class="flex justify-center">
            <q-btn
              class="mt-2 mb-1"
              no-caps
              style="font-size: 15px"
              padding="4px 10px"
              label="Guardar"
              color="secondary"
              type="submit"
            ></q-btn>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
// import { ModificarPersonaDto } from '#gql';
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';
import { useUsuarioService } from '~/modulos/main/negocio/useUsuarioService';

const authStore = useAuthStore();
const usuarioService = useUsuarioService();
const router = useRouter();

const props = defineProps({
  disable: {
    type: Boolean,
    default: true,
  },
});

// MODAL editarPerfil
const show_editarPerfil = ref(false);
const init_editarPerfil = {
  nombre: authStore.getUsuario?.nombre,
  apellido: authStore.getUsuario?.apellido,
  correo: authStore.getUsuario?.correo,
  telefono: authStore.getUsuario?.telefono,
  imagen: {
    data: '',
    mimetype: 'image/png',
  },
};
const ref_editarPerfil = ref(init_editarPerfil);
const toggle_editarPerfil = () => {
  show_editarPerfil.value = !show_editarPerfil.value;
};
const editarPerfil = async () => {
  // en que caso no hubiera usuario ? pero bueno por seguridad
  if (!authStore.getUsuarioId) {
    return false;
  }

  // el backend no puede recibir una imagen con data = ''
  // trabajemos con una copia
  const copia_editarPerfil = JSON.parse(JSON.stringify(ref_editarPerfil.value));
  if (copia_editarPerfil.imagen.data === '') {
    copia_editarPerfil.imagen = null;
  }

  // modificamos el usuario
  const persona = await usuarioService.editarPerfil(
    authStore.getUsuarioId,
    copia_editarPerfil,
  );

  // success : actualizamos el usuario en el store y cerramos
  if (persona !== null) {
    NotifySucessCenter('Usuario editado correctamente');
    authStore.editarPerfil(persona);
    show_editarPerfil.value = false;
    Object.assign(ref_editarPerfil, init_editarPerfil);
  } else {
    NotifyError('Hubo un error, intente de nuevo');
    show_editarPerfil.value = false;
  }
};

// logout
const logout = () => {
  const username = authStore.getUsuario?.nombre;
  authStore.logout();
  NotifySucess(`Hasta pronto ${username}!`);
  router.push('/');
};
</script>

<style lang="scss" scoped></style>
