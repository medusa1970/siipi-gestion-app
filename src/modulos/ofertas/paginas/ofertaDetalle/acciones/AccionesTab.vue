<template>
  <div>
    <p>Indica el motivo por cual desea borrar esta oferta:</p>

    <!-- Comentario -->
    <div class="flex" style="justify-content: space-between; margin: 15px 0">
      <div style="flex-grow: 1">
        <input-text
          tipo="textarea"
          label="Motivo"
          @update="(v) => (estado.motivoEliminacion = v)"
          info="El jefe de logistica recibira una notificacion cuando elimines una oferta"
          requerido
        />
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
import { useAccionesTab } from "./accionesTab.composable";
const { estado, borrarOferta } = useAccionesTab();
</script>
