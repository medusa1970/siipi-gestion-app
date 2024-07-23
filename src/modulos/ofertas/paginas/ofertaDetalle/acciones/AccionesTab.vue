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
import { useAccionesTab } from './accionesTab.composable';
const { estado, borrarOferta } = useAccionesTab();
</script>
