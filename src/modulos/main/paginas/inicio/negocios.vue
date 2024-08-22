<template>
  <div class="w-full">
    <div class="w-full text-center">
      <q-avatar>
        <img
          :src="
            authStore.getUsuario?.cloudinaryUrl ??
            'https://i.pinimg.com/564x/20/c0/0f/20c00f0f135c950096a54b7b465e45cc.jpg'
          " />
      </q-avatar>
      <div class="mt-2 mb-2">
        {{ authStore.getUsuarioNombreCompleto }}
      </div>
    </div>
    <div
      v-for="(negocio, index) in authStore.getUsuario.negocios"
      :key="negocio.nombre"
      @click="elegirNegocio(index)">
      <q-btn :color="getColor(negocio)" class="w-full mt-2" no-caps>
        {{ negocio.nombre }}
        {{
          negocio.cargos.length > 0 ? '(' + negocio.cargos[0].nombre + ')' : ''
        }}
      </q-btn>
    </div>

    <div class="w-full text-center mt-4">
      <q-btn
        dense
        no-caps
        color="primary"
        label="desconectarse"
        @click="logout" />
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits(['go']);
import { useAuthStore } from '~/modulos/main/useAuthStore';
const authStore = useAuthStore();
const router = useRouter();

// elegir un negocio
const elegirNegocio = async index => {
  try {
    await authStore.elegirNegocio(index);
  } catch (e) {
    NotifyError(`Error no tratado: ${e}`);
  }
  switch (authStore.getNegocio.tipo) {
    case 'PUNTO':
      goTo(router, 'punto');
      break;
    case 'CATHERING':
      goTo(router, 'cathering');
      break;
    case 'CLIENTELA':
      goTo(router, 'cliente');
      break;
  }
};

// logout
const logout = () => {
  authStore.logout();
  emits('go', 'login'); // o 'byebye'
};

// colores para los botones
const getColor = negocio => {
  switch (negocio.tipo) {
    case 'CATHERING':
      return 'green';
    case 'PUNTO':
      return 'orange';
    case 'CLIENTELA':
      return 'black';
  }
};
</script>
