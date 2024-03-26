<template>
  <!-- view="lHr lpR lFr" -->
  <!-- lHh lpR lFf -->
  <q-layout v-if="$q.platform.is.desktop" view="lHr lpR lFr ">
    <q-header
      elevated
      :class="['text-white ', punto ? 'bg-orange-500' : 'colorBackground']"
      style=""
    >
      <q-toolbar class="h-[6vh]">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="navBar">
          <h1 class="font-bold uppercase">
            {{
              storeAuth.negocioElegido
                ? storeAuth.negocioElegido.nombre
                : 'Cliente'
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
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAbFBMVEX///8yicggg8Yth8cnhcYagcW0zucAfMPN3e77/P4Ae8IMfsTt8/nz9/vJ2+291OlGkcvC1+s6jMnl7vZ6rNeryORupdSewOCVu96Is9pPlc1fndCCsNl5q9bW5PHe6fRkn9GYvd5xptWmxePjJF1wAAAGmklEQVR4nO2da3ejLBCAFUZTY4wkZt+oubXN//+Pr+Sy2+aiqDADHp5v27Nn67MzwAAKQeDxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeCwjWX785Ej9PFo5LTd1LSL2gwjquo6XJ+pH00CRC8EZcM7D3zQ/YYyLakX9hKMo8pCzsAUeQrTe59TPOZTVGthj5F5ZNn+rWlA/bH+yiqno/ZVcO5atWZWCqt5NkoUOOWbVrKffxTFyJo7xEL+ro8ioH16BTLT2nh2OsyqhFuginiv3Ly9htd2pmtXRKL9LGGNqixby2bgAXomErZma5KkGvwYQlhYA4zP0Dp/bmKlJPXCMeElqn6JeQQsVdQs2/Y1divoFLVM0IWiVohlBmxT/jKhE2+CRJes4sbZx8EmxtqK6KTRVMq8AGxSTWkct+g5mQVM8mOll7swKakFzjfAKp55oZEZzVEKdpxuzOSqhzdOFwX70DheUhsJ0jkooS5vccDdzgzCIAkWQMIhIISQMIlII6UYMjI70Cl/TGCKMhXdSmjFxjiYYwoZCMDY0733JjMLw6d0Dk1D0NSYnvs9QpKmpxZk3zPENDc98HyFI0xmqIIEhcpISpCnqWCFJsQ3/w22GTZr+QTbEmlb8M8RuiNhJGsJ/uILozbCZB0/ekOEa5pM33GGW3TdD3K4GJm+IOnXyht7QG3pDb+gNvSGRYTh5w+nHkGJugbs7M/354fQNV+iG6Luk6Iboa234q4nY66Vf2CvCEfaHe+j7Fuir+glymvIa2xB9dw27GQbBFrchpvgv0n6gNkSCJEV9nSYM4UxgiJqm6D2p5Ij4ugnfURgGn3hzRNiSGCKmKcHbNBfQ0pQohE0QsQYMkn7mAlLlxqhCiBZERvdhUIKyUUoYwiA4IwSRA+W3XQnCuilpCDEKG/gkFQyCyvCwz0Pq0/kyw3nKvogFTecp0JTcv6kM9qecW/FF/s5cU0w/qOUuFMY2E6OK2u1GYai0YbYImooi7QfAD5QmZhlAftjATyrtijyy7MAv7YrMMkGpqLMtgn2CQbDQqMj2FgpKRU1DP4/21C5vWGhqjNyecfCJKh2fqWDXKPHIko/MVJ7afi70YlQYOfAltUE3y1r9mOsHICwtD+CNMhxUivNoR71iocyihN6OjZ8DCfqPrKcjOOYnycqdagXAIaqc87uwrFLWGUmAdFe6cFD5a7JlWafwNpQAbF5W7urdyMqtSCOAn6K8+RNL59XXyoJzEfWw2G63+1l6h5+32ziYjJ3HcpypQoaRnOu54d29jBP2tUk5b0Y7tjb5BOdZCGlNUw5Iv+ugJozdZpTtL4sGJCXrXz9JujcTxlzcf0fjiLxH8/W75ARh4FOBbP9zZ7KZ+yO2x4/d05ZhdNC8uJLE4qHYgxQtVctXhSbMY50lSiFeLNtFnyhhPD4H8AoT2hyLw+vFHmAI1+ws388UOKu1OBabtxNLHn1r+AWtvPnP1ehYbFjbxJl9m11NPXS9ldA4bkY8QnI8tPqFMlMNjhvHx+7t9SPAYeAznGKhsPDBzSkeVddBIRKb3k9R5HWo9t4KB0MbN6c+C73yasoe/V6RC87U365iByOCPbcHeSMZrhRK1iKv1k30ev3rzMDBX6cB2xHyLtU1L/O3wcziXIS8ez0OQ3GI4M0SGAOAXfzAVv6U9UhNs4rFuI+c+OVq3N+8uECXUHGkoBlSnQsoGnZ2DTDXp4h+zqUi2hS/8c9PUINr+pbG9E0yI9DzlvvR1ghKtHSoayt7mTswvgr/trSXuTH+aja0SzqGMvZo2mLwiyNojLyixfIcvcDG5Kn1OSqBz+FLQwv7c1QyIk9trdYeiYaufa1cyFHJ4MsvCE5DHggbtr9n8ostzQy7rzRDvWVlJNGQIJr+OFQvaf/3UjPkU5JGMmCR2K0QDgiiYyEcEETXQtg7iJmNy4ft9AyieyHsGUQHQ9gEsc+3RC6GsNc5Pc51pFd6VKfo51rqoccptXYvIL5HuTp1Zl74iPKA4WY/I5mpDRh4l+BqR/GQU4KjunXB1c78JrgUQBtKa1KFs60wVFyTIrgTQCMqdQ3BbVwaUTi53ekkVUpTt5NUpTd1tWK7A507Ua4bdjZEZ2vSO5x3GO7d7mjkKYQdhoL6CUfTMQ8+Od4KG6C9+sY9LN8IHTN95CvhTcDXrTtttftZ2r6WkYgJGLK2T9w+XB8NJa23DEygo2loO27x7H5HI7ualq8Up9DRNF1NS0N05/2SNtq6mkka/g86T4LooUCtLAAAAABJRU5ErkJggg=="
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
                          src="data:image/png;base64,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"
                        />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label>Perfil</q-item-label>
                      <q-item-label caption lines="1"
                        >{{ storeAuth.user.nombre }}@gmail.com</q-item-label
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
                        v-for="negocio in storeAuth.user.negocios"
                        :key="negocio.nombre"
                      >
                        <q-item-section @click="prueba(negocio)">{{
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
      class="colorBackground"
    >
      <!-- drawer content -->
      <q-list>
        <!-- PERFIL -->
        <q-item style="height: 250px">
          <q-img
            id="portada"
            class="absolute-top"
            :src="Portada"
            style="height: 250px; object-fit: cover"
          >
            <div id="perfil" class="absolute-bottom text-center">
              <q-avatar size="70px" class="q-mb-sm">
                <img
                  style="object-fit: cover"
                  src="data:image/png;base64,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"
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
              <h1 class="text-weight-bold">
                <!-- {{ user2.name + ' ' + user2.lastname }} -->
                {{ `${storeAuth.user.nombre} ${storeAuth.user.apellido}` }}
              </h1>
              <h1>{{ storeAuth.user.correo }}</h1>
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

          <q-list class="shadow-md border-b-[1px] border-orange-400">
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

                <span class="flex gap-2 justify-center">
                  <slot name="actionPedido" />
                </span>
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
            {{
              storeAuth.negocioElegido
                ? storeAuth.negocioElegido.nombre
                : 'Cliente'
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
                        >{{ storeAuth.user.nombre }}@gmail.com</q-item-label
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
                        v-for="negocio in storeAuth.user.negocios"
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

    <q-drawer v-model="leftDrawerOpen" class="colorBackground" style="">
      <!-- drawer content -->
      <q-list>
        <!-- PERFIL -->
        <q-item style="height: 250px">
          <q-img
            id="portada"
            class="absolute-top"
            :src="Portada"
            style="height: 250px; object-fit: cover"
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
    <!-- <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      
    </q-drawer> -->

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
        <!-- <q-file
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
        </q-file> -->
        <div
          v-if="imagePreview"
          style="width: 200px; height: 200px; margin: auto"
        >
          <q-img
            style="width: 100%; height: 100%; object-fit: cover"
            :src="imagePreview"
          ></q-img>
        </div>
        <q-file
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
        </q-file>
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
});

// IMPORTS
import { ref, watch, reactive } from 'vue';
import { LocalStorage } from 'quasar';
import { useRouter } from 'vue-router';
import { authStore } from '@/stores/auth.store';
import { useQuasar } from 'quasar';
import RickRoll from '@/assets/mp3/rickroll.mp3';
import Portada from '@/assets/img/marco.png';
import { pedidoStore } from '@/stores/pedido.store';
import { pedidoService } from '~/services/punto/pedido.service';
import {
  ApiError,
  showLoading,
  hideLoading,
  NotifySucess,
  NotifySucessCenter,
} from '~/helpers/message.service';
import { authService } from '~/services/auth.service';

// storeAuth
const storeAuth = authStore();
const storePedido = pedidoStore();
const router = useRouter();
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
  LocalStorage.remove('token');
  storeAuth.user.nombre = '';
  storeAuth.user.negocios = [];
  storeAuth.token = '';
  router.push('/');
  storeAuth.negocioElegido = '';
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

const prueba = (negocio) => {
  // playSound();
  $q.dialog({
    title: `<strong>Entrar a ${negocio.nombre}</strong>`,
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
    const { conectar } = await authService.login(
      storeAuth.user.usuario,
      contrasena.value,
      negocio._id,
    );
    storeAuth.token = conectar.token;
    if (conectar.token) {
      router.push(`/${negocio.tipo.toLowerCase()}`);
      storeAuth.negocioElegido = negocio; //solucion
      $q.notify({
        type: 'positive',
        position: 'center',
        message: `Bienvenido a ${negocio.nombre}`,
        progress: true,
        timeout: 1000,
      });
    }
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
  const formData = new FormData();
  formData.append('imagen', selectedFileProfile.value);

  delete persona.value.telefono;
  delete persona.value._id;
  delete imagen.value.__key;
  persona.value.imagen = formData.get('imagen');
  // delete persona.value.imagen;
  // console.log(persona.value);
  // console.log(persona.value.imagen);
  try {
    showLoading();
    await GqlModificarPersona(
      {
        busqueda: { _id: storeAuth.user._id },
        datos: persona.value,
      },
      useGqlHeaders({
        'apollo-require-preflight': '1',
        'Content-Type': 'multipart/form-data',
      }),
    );
    NotifySucess('Persona modificada correctamente');
    hideLoading();
  } catch (error) {
    console.log(error);
    ApiError(error);
  }
};
const getPersona = async () => {
  try {
    showLoading();
    const { personaBuscar } = await GqlBuscarPersona({
      busqueda: { _id: storeAuth.user._id },
    });
    persona.value = personaBuscar[0];
    imagen.value = personaBuscar[0].imagen;
    imagePreview.value = `https://siipi-gestion-production.up.railway.app/public/personas/${persona.value.imagen}`;
    // console.log(imagePreview.value);
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
