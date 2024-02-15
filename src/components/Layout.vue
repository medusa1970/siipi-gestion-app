<template>
  <q-layout view="lHh lpR lFf">
    <q-header elevated class="text-white" style="background-color: #010f1a">
      <q-toolbar class="h-[6vh]">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="navBar">
          <h1 class="font-bold uppercase">
            {{
              useAuth.negocioElegido ? useAuth.negocioElegido.nombre : 'Cliente'
            }}
          </h1>
          <!-- NAV END -->
          <nav class="flex flex-grow justify-end basis-0 items-center gap-2">
            <q-btn
              class="lg:mr-1"
              dense
              flat
              round
              style="width: 45px; height: 45px"
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
                  <q-item clickable @click="editProfile">
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
                        <q-icon
                          name="storefront"
                          color="blue"
                          class="px-[10px]"
                        />
                      </q-item-section>

                      <q-item-section> Negocios</q-item-section>
                    </template>
                    <q-list class="px-2">
                      <q-item
                        clickable
                        @click="sede"
                        v-for="negocio in useAuth.user.negocios"
                        :key="negocio.nombre"
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
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      behavior="desktop"
      style="background-color: #010f1a"
    >
      <!-- drawer content -->
      <q-list>
        <!-- PERFIL -->
        <q-item style="height: 250px">
          <q-img
            id="portada"
            class="absolute-top"
            src="https://i.pinimg.com/564x/72/ff/9e/72ff9e50e61a70d814862dbac5944858.jpg"
            style="height: 250px"
          >
            <div id="perfil" class="absolute-bottom text-center">
              <q-avatar size="70px" class="q-mb-sm">
                <img
                  style="object-fit: cover"
                  src="https://i.pinimg.com/564x/cf/c2/5b/cfc25b552003ba8881db6e678bda0b1b.jpg"
                />
                <q-btn
                  color="red"
                  icon="edit"
                  class="absolute bottom-0 left-[75%]"
                  dense
                  round
                  size="10px"
                  padding="5px"
                />
              </q-avatar>
              <!-- <div size="70px" class="q-mb-sm">
                <img
                  style="object-fit: cover"
                  src="https://i.pinimg.com/564x/cf/c2/5b/cfc25b552003ba8881db6e678bda0b1b.jpg"
                />
                <q-btn color="primary" icon="check" />
              </div> -->
              <div class="text-weight-bold">
                <!-- {{ user2.name + ' ' + user2.lastname }} -->
                will chambi
              </div>
              <div>willch@gmail.com</div>
            </div>
          </q-img>
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
              <q-list
                class="q-pl-lg"
                style="background-color: $dark"
                v-if="item.subMenu.length > 0"
              >
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

    <!-- SLOT -->
    <!-- <slot name="slot"/> -->

    <q-page-container>
      <div style="padding: 0.5rem">
        <slot name="slot" />
      </div>
    </q-page-container>
  </q-layout>

  <!-- MODAL -->
  <Dialog v-model="isEditProfile" title="Editar perfil">
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
          <!-- <template v-slot:append>
            <q-icon
              name="close"
              @click.stop.prevent="imagen = null"
              class="cursor-pointer"
            />
          </template> -->
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
        <q-input
          v-model="useAuth.user.nombre"
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
});

// IMPORTS
import { ref, watch, reactive } from 'vue';
import { LocalStorage } from 'quasar';
import { useRouter } from 'vue-router';
import { authStore } from '@/stores/auth.store';
import { useQuasar } from 'quasar';
import RickRoll from '@/assets/mp3/rickroll.mp3';
import { ApiError, showLoading, hideLoading } from '~/helpers/message.service';

const useAuth = authStore();
const router = useRouter();
const $q = useQuasar();
const leftDrawerOpen = ref(false);
const isEditProfile = ref(false);
const persona = reactive({
  nombre: '',
  apellido: '',
  correo: '',
  imagen: null,
});
const imagen = ref(null);
const selectedFileProfile = ref('');
const imagePreview = ref('');

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
const logout = () => {
  LocalStorage.remove('token');
  useAuth.user.nombre = '';
  useAuth.user.negocios = [];
  useAuth.token = '';
  router.push('/');
  useAuth.negocioElegido = '';
};

// Crear un nuevo objeto Audio y asignarle la URL del archivo de sonido
// Función para reproducir el sonido
const playSound = () => {
  const sonido = new Audio(RickRoll);
  sonido.play();
  setTimeout(() => {
    sonido.pause();
  }, 10000);
};

const prueba = (negocio) => {
  playSound();
  $q.dialog({
    title: `<strong>Entrar a ${negocio.nombre}</strong>`,
    message: '¿Está seguro de cambiar de negocio?',
    cancel: true,
    persistent: true,
    html: true,
  }).onOk(async () => {
    router.push(`/${negocio.tipo.toLowerCase()}`);
    useAuth.negocioElegido = negocio; //solucion
    $q.notify({
      type: 'positive',
      position: 'center',
      message: `Bienvenido a ${negocio.nombre}`,
      progress: true,
      timeout: 1000,
    });
  });
};

const editProfile = () => {
  isEditProfile.value = true;
  getPersona();
};

/**IMAGE VALIDATE */
const onRejected = (rejectedEntries) => {
  // const messageError = {
  //   maxTotalSize: "la imagen excede el tamaño maximo del formato",
  //   accept: "El tipo de formato no es correcto",
  // };
  const men =
    rejectedEntries[0].failedPropValidation === 'max-total-size'
      ? 'la imagen excede el tamaño maximo del formato'
      : 'El tipo de formato no es correcto';
  $q.notify({
    type: 'negative',
    message: `${men}`,
  });
};
watch(imagen, () => {
  const lector = new FileReader();
  selectedFileProfile.value = imagen.value;

  lector.addEventListener('load', () => {
    imagePreview.value = lector.result;
  });
  lector.readAsDataURL(selectedFileProfile.value);
});
const modificarPersona = async () => {
  delete profile.value._id;
  try {
    showLoading();
    await GqlModificarPersona({
      busqueda: { _id: useAuth.user._id },
      datos: profile.value,
    });
    NotifySucess('Persona modificada correctamente');
    hideLoading();
  } catch (error) {
    ApiError(error);
  }
};
const getPersona = async () => {
  try {
    showLoading();
    const { personaBuscar } = await GqlBuscarPersona({
      busqueda: { _id: useAuth.user._id },
    });
    // profile.value = personaBuscar[0];
    console.log(personaBuscar);
    persona.nombre = personaBuscar[0].nombre;
    persona.apellido = personaBuscar[0].apellido;
    persona.correo = personaBuscar[0].correo;
    imagen.value = personaBuscar[0].imagen;
    hideLoading();
  } catch (error) {
    ApiError(error);
  }
};
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
</style>
