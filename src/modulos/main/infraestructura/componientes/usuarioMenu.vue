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
        <q-item clickable @click="showRaiz = true">
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

  <q-dialog v-model="showRaiz">
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

      <q-form @submit="editarPerfilSubmit">
        <q-card-section>
          <input-text
            label="Nombre"
            @update="(v) => (perfil.nombre.valor = v)"
            :default="perfil.nombre.valor"
            dense
          />
          <input-text
            label="Apellido"
            @update="(v) => (perfil.apellido.valor = v)"
            :default="perfil.apellido.valor"
            dense
          />
          <input-text
            label="telefono"
            @update="(v) => (perfil.telefono.valor = v)"
            :default="perfil.telefono.valor"
            dense
          />
          <input-text
            label="email"
            @update="(v) => (perfil.correo.valor = v)"
            :default="perfil.correo.valor"
            :errorMessage="perfil.correo.error"
            dense
          />
          <input-image
            label="Cambiar imagen"
            @update="(v) => (perfil.imagen.valor = v)"
            :default="perfil.imagen.valor"
            maxSizeKb="500"
            dense
          />
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
import { useAuth } from '../../API/useAuth';

const authStore = useAuthStore();
const usuarioService = useUsuarioService();
const router = useRouter();
const $q = useQuasar();

const props = defineProps({
  disable: {
    type: Boolean,
    default: true,
  },
});

// MODAL editarPerfil

const perfil = {
  nombre: reactiveInput(authStore.getUsuario?.nombre),
  apellido: reactiveInput(authStore.getUsuario?.apellido),
  telefono: reactiveInput(authStore.getUsuario?.telefono),
  correo: reactiveInput(authStore.getUsuario?.correo),
  imagen: reactiveInput(),
  show: ref(true),
};
const showRaiz = ref(false);

const editarPerfilSubmit = async () => {
  // en que caso no hubiera usuario ? pero bueno por seguridad
  if (!authStore.getUsuarioId) {
    return false;
  }

  // modificamos el usuario
  const datos = {
    nombre: perfil.nombre.valor,
    apellido: perfil.apellido.valor,
    correo: perfil.correo.valor,
    telefono: perfil.telefono.valor,
  };
  if (perfil.imagen.valor) {
    Object.assign(datos, {
      imagen: {
        data: perfil.imagen.valor,
        mimetype: 'image/png',
      },
    });
  }
  const persona = await usuarioService.editarPerfil(
    authStore.getUsuarioId,
    datos,
  );

  // success : actualizamos el usuario en el store y cerramos
  if (persona !== null) {
    try {
      authStore.editarPerfil(persona);
    } catch (e) {
      throw e;
    }
    NotifySucessCenter('Usuario editado correctamente');
  } else {
    NotifyError('Hubo un error, intente de nuevo');
  }
  // perfil.show.value = false;
};

const password = ref('');
const elegirNegocio = (index: number, nombre: string) => {
  // playSound();
  $q.dialog({
    title: `<strong>Entrar a ${nombre}</strong>`,
    message: '¿Está seguro de cambiar de negocio?',
    cancel: true,
    persistent: true,
    html: true,
    prompt: {
      model: password,
      type: 'password',
      clearable: true,
      required: true,
      // native attributes:
      min: 0,
      max: 10,
      step: 2,
      label: 'Ingrese tu contrasena',
      outlined: true,
      dense: true,
    },
  }).onOk(async () => {
    // averiguamos la contraseña

    try {
      await useAuth.login(
        authStore.getUsuario?.usuario as string,
        password.value,
      );
    } catch {
      // bad contraseña
    }

    const negocio = await authStore.elegirNegocio(index);

    if (!loginResponse) {
      NotifyError(`contraseña incorrecta`);
    } else {
      authStore.token = loginResponse.token;
      authStore.elegirNegocio(index);
      NotifySucess(`Negocio elegido: ${nombre}`);
      password.value = '';
      switch (authStore.getNegocio?.tipo) {
        case 'PUNTO':
          goTo(router, 'punto');
          break;
        case 'CATHERING':
          goTo(router, 'cathering');
          break;
      }

      // TODO averiguar suscripcion, etc
      // TODO BUGs de irala a iralita + cliente
    }
  });
};

// logout
const logout = () => {
  const username = authStore.getUsuario?.nombre;
  authStore.logout();
  NotifySucess(`Hasta pronto ${username}!`);
  goTo(router, 'inicio');
};
</script>

<style lang="scss" scoped></style>
