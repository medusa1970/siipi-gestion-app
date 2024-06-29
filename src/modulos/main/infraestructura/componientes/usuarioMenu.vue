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
        <q-item clickable @click="perfil.show = true">
          <q-item-section avatar>
            <q-avatar>
              <img
                class="round object-cover"
                style="width: 40px; height: 40px"
                :src="
                  authStore.getUsuario?.cloudinaryUrl ??
                  'https://i.pinimg.com/564x/20/c0/0f/20c00f0f135c950096a54b7b465e45cc.jpg'
                "
              />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{
              authStore.getUsuarioNombreCompleto
            }}</q-item-label>
            <q-item-label caption lines="1"></q-item-label>
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

  <q-dialog v-model="perfil.show">
    <q-card style="min-width: 300px" class="p-3">
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
            @update="(v) => (perfil.nombre.value = v)"
            :valorInicial="perfil.nombre.value"
          />
          <input-text
            label="Apellido"
            @update="(v) => (perfil.apellido.value = v)"
            :valorInicial="perfil.apellido.value"
          />
          <input-text
            label="telefono"
            @update="(v) => (perfil.telefono.value = v)"
            :valorInicial="perfil.telefono.value"
          />
          <input-text
            label="email"
            @update="(v) => (perfil.correo.value = v)"
            :valorInicial="perfil.correo.value"
            :error="perfil.correo.error"
            dense
          />
          <input-image
            label="Cambiar imagen"
            @update="onImageChange"
            maxSizeKb="500"
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

const perfil = reactive({
  nombre: reactiveData(authStore.getUsuario?.nombre),
  apellido: reactiveData(authStore.getUsuario?.apellido),
  telefono: reactiveData(authStore.getUsuario?.telefono),
  correo: reactiveData(authStore.getUsuario?.correo, 'oo'),
  imagen: reactiveData(),
  show: false,
});
const showRaiz = ref(false);

function onImageChange(data, archivo, isPreview) {
  if (!isPreview && archivo !== null) {
    perfil.imagen.value = {
      data,
      mimetype: archivo.type,
    };
  } else {
    perfil.imagen.value = null;
  }
}

const editarPerfilSubmit = async () => {
  // en que caso no hubiera usuario ? pero bueno por seguridad
  if (!authStore.getUsuarioId) {
    return false;
  }

  // modificamos el usuario
  const datos = {
    nombre: perfil.nombre.value,
    apellido: perfil.apellido.value,
    correo: perfil.correo.value,
    telefono: perfil.telefono.value,
  };
  if (perfil.imagen.value) {
    Object.assign(datos, {
      imagen: perfil.imagen.value,
    });
  }

  let persona = ref(null);
  try {
    loadingAsync(async () => {
      persona.value = await usuarioService.editarPerfil(
        authStore.getUsuarioId,
        datos,
      );
    }).then(() => {
      if (persona.value !== null) {
        authStore.editarPerfil(persona.value);
        perfil.show = false;
        NotifySucessCenter('Usuario editado correctamente');
      } else {
        NotifyError('Hubo un error, intente de nuevo');
      }
    });
  } catch (e) {
    throw e;
  }
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

    let loginResponse;
    try {
      loginResponse = await useAuth.login(
        authStore.getUsuario?.usuario as string,
        password.value,
      );
      if (!loginResponse) {
      } else {
        authStore.elegirNegocio(index);
        authStore.token = loginResponse.token;
        password.value = '';
        NotifySucess(`Negocio elegido: ${nombre}`);
        perfil.show = false;
        switch (authStore.getNegocio?.tipo) {
          case 'PUNTO':
            goTo(router, 'punto');
            break;
          case 'CATHERING':
            goTo(router, 'cathering');
            break;
        }
      }
    } catch (e: any) {
      if (e === 'B104') {
        NotifyError(`Contraseña incorrecta`); // notificacion en caso de error desconocido
      } else {
        NotifyError(`Error no tratado: ${e}`); // notificacion en caso de error desconocido
      }
      return false;
    }
    // TODO averiguar suscripcion, etc
    // TODO BUGs de irala a iralita + cliente
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
