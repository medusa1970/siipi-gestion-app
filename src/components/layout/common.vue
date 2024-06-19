<template>
  <!-- view="lHr lpR lFr" -->
  <!-- lHh lpR lFf -->
  <q-layout v-if="$q.platform.is.desktop" view="lHr lpR lFr ">
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
          <!-- NAV END -->
          <nav class="flex flex-grow justify-end basis-0 items-center gap-2">
            <q-btn
              padding="0"
              dense
              flat
              round
              style="width: 40px; height: 40px"
            >
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
                        v-for="(negocio, index) in authStore.getUser?.negocios"
                        :key="negocio.nombre"
                      >
                        <q-item-section
                          @click="elegirNegocio(index, negocio.nombre)"
                          >{{ negocio.nombre }}</q-item-section
                        >
                      </q-item>
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
            <q-btn
              v-if="sede === false"
              flat
              round
              color="primary"
              icon="shopping_cart"
              @click="toggleRightDrawer"
            >
              <q-badge class="rounded-full" rounded color="orange" floating>{{
                storePedido.listaPedido.length
              }}</q-badge>
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
    <q-drawer
      v-if="sede === false"
      v-model="rightDrawerOpen"
      side="right"
      class="colorBackground"
      style=""
    >
      <!-- drawer content -->
      <q-list>
        <!-- SIDEBAR -->
        <div class="text-white py-4 flex flex-col gap-4">
          <h1 class="text-center font-extrabold">SIDE_BAR</h1>

          <q-list class="shadow-[0_0px_5px] shadow-orange-300">
            <q-expansion-item
              switch-toggle-side
              expand-separator
              default-opened
              class="[&>div>div>div>i]:bg-orange-400 [&>div>div>div>i]:rounded-full [&>div>div>div>i]:text-white"
            >
              <template v-slot:header>
                <div class="flex items-center">
                  <!-- uppercase font-bold line-clamp-1 -->
                  <p class="font-semibold">
                    Pedido productos ({{ storePedido.listaPedido.length }})
                  </p>
                </div>
              </template>
              <div class="p-2">
                <div
                  class="grid grid-cols-[70px_1fr_30px] gap-2 mb-2"
                  v-for="producto in storePedido.listaPedido"
                  :key="producto.id"
                >
                  <div>
                    <input
                      type="number"
                      class="w-full test border-[1px] border-gray-400 px-2 py-1 outline-none bg-transparent"
                      v-model.number="producto.cantidad"
                      min="0"
                      @input="
                        producto.cantidad = Math.max(0, producto.cantidad)
                      "
                    />
                  </div>
                  <!-- <h1 class="w-[30px] borde2">{{ producto.cantidad }}</h1> -->
                  <h1>{{ producto.nombre }}</h1>
                  <q-btn
                    color="red"
                    icon="delete"
                    flat
                    dense
                    rounded
                    size="sm"
                    @click="deleteProductoPedido(producto.id)"
                  />
                </div>

                <div
                  v-if="storePedido.listaPedido.length > 0"
                  class="flex gap-2 justify-center"
                >
                  <slot name="actionPedido" />
                </div>
              </div>
            </q-expansion-item>
          </q-list>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <div class="layoutContainer">
        <slot name="slot" />
      </div>
    </q-page-container>
  </q-layout>
  <!-- v-if="$q.platform.is.mobile" -->

  <!-- RESPONSIVE MOBILE -->
  <q-layout v-if="$q.platform.is.mobile" view="lHh lpR lFf">
    <q-header elevated class="text-white colorBackground" style="">
      <q-toolbar class="h-[6vh]">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="navBar">
          <h1 class="font-bold uppercase">
            {{ authStore.getNegocio.nombre }}
          </h1>
          <!-- NAV END -->
          <nav class="flex flex-grow justify-end basis-0 items-center">
            <q-btn
              padding="0"
              dense
              flat
              round
              style="width: 40px; height: 40px"
            >
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
                          v-if="authStore.getUser?.cloudinaryUrl"
                          class="rounded-full object-cover"
                          style="width: 38px; height: 38px"
                          :src="authStore.getUser?.cloudinaryUrl"
                        />
                        <img
                          v-else
                          class="rounded-full object-cover"
                          style="width: 38px; height: 38px"
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
                        v-for="(negocio, index) in authStore.getUser?.negocios"
                        :key="negocio.nombre"
                      >
                        <q-item-section @click="elegirNegocio(index)">{{
                          negocio.nombre
                        }}</q-item-section>
                      </q-item>
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
            <q-btn
              v-if="sede === false"
              flat
              round
              color="primary"
              icon="shopping_cart"
              size="12px"
              @click="toggleRightDrawer"
            >
              <q-badge class="rounded-full" rounded color="orange" floating>{{
                storePedido.listaPedido.length
              }}</q-badge>
            </q-btn>
          </nav>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" class="colorBackground" style="">
      <!-- drawer content -->
      <q-list>
        <!-- PERFIL -->
        <q-item style="height: 250px; width: 300px">
          <q-img
            id="portada"
            class="absolute-top"
            :src="portadaImg"
            style="height: 250px; object-fit: cover"
          >
            <div id="perfil" class="absolute-bottom text-center">
              <h1
                class="inline-block px-4 rounded-lg bg-white text-black uppercase font-bold"
              >
                {{
                  `${authStore.getUser?.nombre} ${authStore.getUser?.apellido}`
                }}
              </h1>
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

    <q-drawer
      v-if="sede === false"
      v-model="rightDrawerOpen"
      side="right"
      class="colorBackground"
      style=""
    >
      <!-- drawer content -->
      <q-list>
        <!-- SIDEBAR -->
        <div class="text-white py-4 flex flex-col gap-4">
          <h1 class="text-center font-extrabold">SIDE_BAR</h1>

          <q-list class="shadow-[0_0px_5px] shadow-orange-300">
            <q-expansion-item
              switch-toggle-side
              expand-separator
              default-opened
              class="[&>div>div>div>i]:bg-orange-400 [&>div>div>div>i]:rounded-full [&>div>div>div>i]:text-white"
            >
              <template v-slot:header>
                <div class="flex items-center">
                  <!-- uppercase font-bold line-clamp-1 -->
                  <p class="font-semibold">
                    Pedido productos ({{ storePedido.listaPedido.length }})
                  </p>
                </div>
              </template>
              <div class="p-2">
                <div
                  class="grid grid-cols-[70px_1fr_30px] gap-2 mb-2"
                  v-for="producto in storePedido.listaPedido"
                  :key="producto.id"
                >
                  <div>
                    <input
                      type="number"
                      class="w-full test border-[1px] border-gray-400 px-2 py-1 outline-none bg-transparent"
                      v-model.number="producto.cantidad"
                      min="0"
                      @input="
                        producto.cantidad = Math.max(0, producto.cantidad)
                      "
                    />
                  </div>
                  <!-- <h1 class="w-[30px] borde2">{{ producto.cantidad }}</h1> -->
                  <h1>{{ producto.nombre }}</h1>
                  <q-btn
                    color="red"
                    icon="delete"
                    flat
                    dense
                    rounded
                    size="sm"
                    @click="deleteProductoPedido(producto.id)"
                  />
                </div>

                <div
                  v-if="storePedido.listaPedido.length > 0"
                  class="flex gap-2 justify-center"
                >
                  <slot name="actionPedido" />
                </div>
              </div>
            </q-expansion-item>
          </q-list>
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
import { pedidoStore } from '@/ANTIGUO/stores/pedido.store';
import { pedidoService } from '~/ANTIGUO/services/pedido.service';
import { empleadoService } from '~/ANTIGUO/services/empleados.service';
import { useAuth } from '~/modulos/main/aplicacion/useAuth';
import { useAuthStore } from '~/modulos/main/negocio/useAuthStore';

const router = useRouter();
const authStore = useAuthStore();
if (!authStore.user) {
  router.push('/');
}
console.log(authStore.getUser);

const storePedido = pedidoStore();
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

const deleteProductoPedido = (id) => {
  storePedido.listaPedido = storePedido.listaPedido.filter(
    (producto) => producto.id !== id,
  );
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
