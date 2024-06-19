<template>
  <q-layout view="lHr lpR lFr ">
    <q-header
      elevated
      :class="[
        'text-white ',
        punto && 'bg-orange-600',
        cathering && 'bg-green-700',
        sede && 'colorBackground',
      ]"
      style=""
    >
      <q-toolbar class="h-[6vh]">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title class="navBar">
          <div>
            <h1 class="font-bold uppercase">
              {{ authStore.getNegocio?.nombre }}
            </h1>
            <p class="text-sm capitalize">
              {{
                `${authStore.getUserNombreCompleto} (${authStore.getNegocio?.cargos[0]?.nombre})`
              }}
            </p>
          </div>
        </q-toolbar-title>
        <usuario />
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      behavior="desktop"
      style=""
      :class="[
        'text-white ',
        punto && 'bg-orange-600',
        cathering && 'bg-green-700',
        sede && 'colorBackground',
      ]"
    >
      <!-- drawer content -->
      <q-list>
        <!-- PERFIL -->
        <q-item style="height: 150px; width: 300px">
          <q-img
            id="portada"
            class="absolute-top"
            :src="portadaImg"
            style="width: 300px; height: 150px"
            fit="cover"
            position="top right"
          >
            <div
              id="perfil"
              class="absolute-bottom text-center"
              style="height: 40px; padding: 9px; z-index: 100"
            >
              {{
                `${authStore.getUserNombreCompleto} (${authStore.getNegocio?.cargos[0]?.nombre})`
              }}
            </div>
          </q-img>
          <div class="w-full h-full flex justify-center items-center">
            <q-avatar size="100px">
              <img
                v-if="authStore.getUser?.cloudinaryUrl"
                style="object-fit: cover"
                :src="authStore.getUser?.cloudinaryUrl"
              />
              <img
                v-else
                style="object-fit: cover"
                src="https://i.pinimg.com/564x/20/c0/0f/20c00f0f135c950096a54b7b465e45cc.jpg"
              />
            </q-avatar>
          </div>
        </q-item>
        <div id="vistas-objetos">
          <q-list v-for="item in menuList" :key="item" clickable :to="item.to">
            <q-expansion-item
              group="somegroup"
              :icon="item.icon"
              :label="item.label"
              style="border: 0px; color: white"
              :to="item.to"
            >
              <q-list class="q-pl-lg" v-if="item.subMenu.length > 0">
                <q-item
                  clickable
                  v-for="i in item.subMenu"
                  :key="i"
                  :to="i.to"
                  :active="active"
                >
                  <q-item-section>{{ i.label }}</q-item-section>
                  <q-item-section avatar>
                    <q-icon color="secondary" name="keyboard_arrow_right" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
            <!-- <q-separator /> -->
          </q-list>
          <!-- <DrawerMenuAdm :menu-list="menuList" /> -->
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <div class="layoutContainer">
        <slot name="slot" />
      </div>
    </q-page-container>
  </q-layout>

  <!-- MODAL -->
  <Dialog
    v-model="isEditProfile"
    title="Editar perfil"
    :handle-submit="modificarPersona"
  >
    <template #inputsDialog>
      <div class="flex flex-col gap-2">
        <!-- IMAGE -->
        <q-file
          v-model="imagen"
          label="Seleccionar imagen"
          accept=".jpg, .png, .jpge"
          max-total-size="560000"
          @rejected="onRejected"
          counter
          outlined
          dense
          hint="Tamaño máximo de imagen 540KB"
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" @click.stop.prevent />
          </template>
        </q-file>
        <div
          v-if="imagePreview"
          style="width: 200px; height: 200px; margin: auto"
        >
          <q-img
            style="width: 100%; height: 100%; object-fit: cover"
            :src="imagePreview"
          ></q-img>
        </div>
        <!-- <q-file
          v-model="imagen"
          label="Seleccionar imagen"
          accept=".jpg, .png, .jpge"
          max-total-size="560000"
          counter
          outlined
          dense
          hint="Tamaño máximo de imagen 540KB"
          clearable
        >
          <img :src="persona.imagen" alt="" />
        </q-file> -->
        <q-input
          v-model="persona.nombre"
          type="text"
          label="Nombre"
          outlined
          dense
          clearable
        />
        <q-input
          v-model="persona.apellido"
          type="text"
          label="Apellido"
          outlined
          dense
          clearable
        />
        <q-input
          v-model="persona.correo"
          type="email"
          label="Correo"
          outlined
          dense
          clearable
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
// PROPS
defineProps({
  menuList: Array,
  punto: Boolean,
  sede: Boolean,
  portadaImg: String,
  cathering: Boolean,
});

// IMPORTS
import { ref, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import RickRoll from '@/assets/mp3/rickroll.mp3';
import Portada from '@/assets/img/marco.png';
import PortadaPunto from '@/assets/img/backPunto.png';
import { useAuth } from '~/modulos/main/API/useAuth';
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';
import usuario from '@/modulos/main/infraestructura/componientes/usuario.vue';

const router = useRouter();
const authStore = useAuthStore();
if (!authStore.user) {
  router.push('/');
}
console.log(authStore.getUser);

const $q = useQuasar();
const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);
const isEditProfile = ref(false);
const persona = ref({
  nombre: '',
  apellido: '',
  correo: '',
  telefono: '',
  imagen: null,
  _id: '',
});
const imagen = ref(null);
const selectedFileProfile = ref('');
const imagePreview = ref('');
const contrasena = ref('');

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}

const logout = () => {
  const username = authStore.getUser?.nombre;
  authStore.logout();
  NotifySucess(`Hasta pronto ${username}!`);
  router.push('/');
};

// Crear un nuevo objeto Audio y asignarle la URL del archivo de sonido
// Función para reproducir el sonido
// const playSound = () => {
//   const sonido = new Audio(RickRoll);
//   sonido.play();
//   setTimeout(() => {
//     sonido.pause();
//   }, 10000);
// };

const elegirNegocio = (index, nombre) => {
  // playSound();
  $q.dialog({
    title: `<strong>Entrar a ${nombre}</strong>`,
    message: '¿Está seguro de cambiar de negocio?',
    cancel: true,
    persistent: true,
    html: true,
    prompt: {
      model: contrasena,
      type: 'password',
      clearable: true,
      // native attributes:
      min: 0,
      max: 10,
      step: 2,
      label: 'Ingrese tu contrasena',
      outlined: true,
      dense: true,
    },
  }).onOk(async () => {
    const loginResponse = await useAuth.login(
      authStore.getUser?.usuario,
      contrasena.value,
    );
    if (!loginResponse) {
      NotifyError(`contraseña incorrecta`);
    }

    // login respone ya tiene el nuevo token
    // authStore.setToken()

    // TODO averiguar suscripcion, etc
    // TODO BUGs de irala a iralita + cliente
    authStore.elegirNegocio(index);
    NotifySucess(`Negocio elegido: ${authStore.getNegocio.nombre}`);
    router.push(`/${authStore.getNegocio.tipo.toLowerCase()}`);
    contrasena.value = '';
  });
};

const editProfile = () => {
  isEditProfile.value = true;
  getPersona();
};

/**IMAGE VALIDATE */
const onRejected = (rejectedEntries) => {
  const men =
    rejectedEntries[0].failedPropValidation === 'max-total-size'
      ? 'la imagen excede el tamaño maximo del formato'
      : 'El tipo de formato no es correcto';
  $q.notify({
    type: 'negative',
    message: `${men}`,
  });
};
const modificarPersona = async () => {
  console.log('first');
  console.log(selectedFileProfile.value);

  const datos = {
    nombre: persona.value.nombre,
    apellido: persona.value.apellido,
    correo: persona.value.correo,
  };
  if (selectedFileProfile.value === '') {
    Object.assign(datos, {
      imagen: {
        mimetype: 'image/png',
        data: fileToBase64(selectedFileProfile.value),
      },
    });
  }

  await empleadoService
    .modificarPersona(authStore.getUser?._id)
    .then((persona) => {
      // console.log(personaModificada);
      authStore.value.user.nombre = personaModificada.nombre;
      authStore.value.user.apellido = personaModificada.apellido;
      authStore.value.user.correo = personaModificada.correo;
      NotifySucess('Persona modificada correctamente');
    })
    .catch(() => {
      NotifyError(`error al modificar la persona`);
    });

  isEditProfile.value = false;
};

const getPersona = async () => {
  try {
    showLoading();
    const personaEncontrada = await empleadoService.buscarPersona(
      authStore.getUser?._id,
    );
    persona.value = personaEncontrada;
    imagePreview.value = personaEncontrada.imagen.cloudinaryUrl;
    hideLoading();
  } catch (error) {
    ApiError(error);
  }
};

//WATCH
watch(imagen, () => {
  if (imagen.value instanceof Blob) {
    const lector = new FileReader();
    selectedFileProfile.value = imagen.value;

    lector.addEventListener('load', () => {
      imagePreview.value = lector.result;
    });
    lector.readAsDataURL(selectedFileProfile.value);
  }
});
</script>

<style lang="scss">
.navBar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h6 {
    color: $white;
  }
}
.colorBackground {
  // #231f20 011627
  background-color: #011627;
}
.layoutContainer {
  // #002b3c #032541
  padding: 0.5rem;
  // background-color: #071c2f;
}

// .q-drawer.q-drawer--right {
//   width: 340px !important;
// }
</style>
