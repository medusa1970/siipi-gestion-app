<template>
  <div>
    <p>Indica el motivo por cual desea borrar esta oferta:</p>

    <!-- Comentario -->
    <div class="flex" style="justify-content: space-between; margin: 15px 0">
      <div style="flex-grow: 1">
        <q-input
          class="w-full"
          v-model="estado.motivoEliminacion"
          type="textarea"
          label="Motivo"
          filled
        />
      </div>
      <div>
        <BotonDetalle mensaje="Se avisará el jefe de logistica." />
      </div>
    </div>
    <q-btn
      color="primary"
      label="Confirmar"
      :disable="estado.motivoEliminacion === ''"
      no-caps
      @click="borrarOferta()"
    />
  </div>
</template>

<script setup>
import { useAccionesTab } from '@/modulos/ofertas/negocio/accionesTab.composable';
import { useOferta } from '@/modulos/ofertas/negocio/oferta.composable';
import { useRouter } from 'vue-router';

const { estado, borrarOferta } = useAccionesTab();
const { $socket } = useNuxtApp();
const { actOfertasDB } = useOferta();
const router = useRouter();

onMounted(() => {
  $socket.on('cambiosOfertas', async (data) => {
    await actOfertasDB();
    router.push('/cathering/ofertas');
  });
});
onBeforeUnmount(() => {
  $socket.off('cambiosOfertas');
});
</script>
