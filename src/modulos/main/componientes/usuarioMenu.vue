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
        <q-item clickable @click="showPerfil = true">
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

  <q-dialog v-model="showPerfil">
    <q-card style="min-width: 350px" class="p-3">
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
            @update="(v) => (perfil.nombre = v as string)"
            :porDefecto="perfil.nombre"
            :rules="[useRules.requerido()]"
          />
          <input-text
            label="Apellido"
            @update="(v) => (perfil.apellido = v as string)"
            :porDefecto="perfil.apellido"
            :rules="[useRules.requerido()]"
          />
          <input-text
            label="telefono"
            @update="(v) => (perfil.telefono = v as string)"
            :porDefecto="perfil.telefono"
            :rules="[useRules.requerido()]"
          />
          <input-text
            label="email"
            @update="(v) => (perfil.correo = v as string)"
            :porDefecto="perfil.correo"
            :rules="[]"
          />
          <input-image
            label="inagen"
            @update="
              (base64Data, mimetype) =>
                (perfil.imagen = base64Data
                  ? { data: base64Data, mimetype: mimetype }
                  : null)
            "
            :dataPreview="previewImagenPerfil"
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
import { useAuthStore } from '~/modulos/main/useAuthStore';
import { UrlToBase64Image } from '~/components/input/input.service';
import { apiAuth } from '~/modulos/main/API/auth.api';

const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar();

const props = defineProps({
  disable: {
    type: Boolean,
    porDefecto: true,
  },
});

// MODAL editarPerfil

const showPerfil = ref(null);
const perfil = reactive({
  nombre: authStore.getUsuario?.nombre,
  apellido: authStore.getUsuario?.apellido,
  telefono: authStore.getUsuario?.telefono,
  correo: authStore.getUsuario?.correo,
  imagen: null as { data: string; mimetype: string },
});
const previewImagenPerfil = ref(null);
//@ts-ignore
await UrlToBase64Image(
  authStore.getUsuario?.cloudinaryUrl,
  (base64Data) => (previewImagenPerfil.value = null),
);
const editarPerfilSubmit = async () => {
  // preparacion de los datos
  const datos = {
    nombre: perfil.nombre,
    apellido: perfil.apellido,
    correo: perfil.correo,
    telefono: perfil.telefono,
  };
  if (perfil.imagen) Object.assign(datos, { imagen: perfil.imagen });

  // modificacion en API
  let persona = ref(null);
  try {
    loadingAsync(async () => {
      persona.value = await apiAuth.editarPerfil(authStore.getUsuarioId, datos);
      previewImagenPerfil.value = perfil.imagen?.data;
    }).then(() => {
      if (persona.value !== null) {
        authStore.editarPerfil(persona.value);
        showPerfil.value = false;
        NotifySucessCenter('Usuario editado correctamente');
      } else {
        NotifyError('Hubo un error, intente de nuevo');
      }
    });
  } catch (e) {
    throw e;
  }
};

// ELEGIR NEGOCIO

const password = ref('');
const elegirNegocio = (index: number, nombre: string) => {
  $q.dialog({
    title: `<strong>Entrar a ${nombre}</strong>`,
    message: '¿Está seguro de cambiar de negocio?',
    cancel: true,
    persistent: true,
    html: true,
    prompt: {
      //@ts-ignore
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
      loginResponse = await apiAuth.login(
        authStore.getUsuario?.usuario as string,
        password.value,
      );
      if (!loginResponse) {
      } else {
        await authStore.elegirNegocio(index);

        password.value = '';
        NotifySucess(`Negocio elegido: ${nombre}`);
        showPerfil.value = false;
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
