<template>
  <q-form @submit.prevent="modificarDatosBasicosOferta">
    <p>Entre los datos basicos de la oferta:</p>
    <!-- nombre -->
    <input-text
      label="Nombre"
      @update="(v) => (estado.datos_ofertaBasica.nombre = v)"
      info="Se debe modificar el nombre UNICAMENTE para corrigir su ortografia o mejorar su descriptividad, caso contrario toca crear un nuevo producto."
      :porDefecto="estado.datos_ofertaBasica.nombre"
      :rules="[useRules.requerido()]"
    />
    <!-- abreviacion -->
    <input-text
      label="Abreviación"
      @update="(v) => (estado.datos_ofertaBasica.abreviacion = v)"
      info="Se debe modificar el abreviacion UNICAMENTE para corrigir su ortografia o mejorar su descriptividad, caso contrario toca crear un nuevo producto."
      :porDefecto="estado.datos_ofertaBasica.abreviacion"
    />

    <!-- Categoria -->
    <input-select
      label="Categoria"
      @update="
        (v) => {
          estado.datos_ofertaBasica.catalogo = v;
        }
      "
      :porDefecto="estado.datos_ofertaBasica.catalogo.nombre"
      :rules="[useRules.requerido()]"
      :opciones="estado.categoriaOpciones"
    />

    <!-- Imagen -->
    <input-image
      label="Imagen"
      @update="
        (base64Data, mimetype) =>
          (estado.datos_ofertaBasica.imagen = base64Data
            ? { data: base64Data, mimetype: mimetype }
            : null)
      "
      info="Por favor elija una foto del producto solo, que se distinga claramente ante un fondo claro y unido. Prefiera un formato cuadrado."
      icono="photo_camera"
      :rules="[]"
    />
    <q-btn color="primary" label="Modificar" type="submit" no-caps />
  </q-form>
</template>

<script setup>
import { useDatosBasicosTab } from '@/modulos/ofertas/negocio/datosBasicosTab.composable';
import { useOferta } from '@/modulos/ofertas/negocio/oferta.composable';

const { estado, ofertaStore, modificarDatosBasicosOferta } =
  useDatosBasicosTab();
const { actOfertasDB } = useOferta();
const { $socket } = useNuxtApp();

if (ofertaStore.oferta) {
  // estado.datos_ofertaBasica = ofertaStore.oferta;
  estado.categoriaOpciones = ofertaStore.categoriaOpciones;
  estado.datos_ofertaBasica = {
    nombre: ofertaStore.oferta.nombre,
    abreviacion: ofertaStore.oferta.abreviacion,
    catalogo: ofertaStore.oferta.catalogo,
    imagen: ofertaStore.oferta.imagen,
  };
}
onMounted(async () => {
  $socket.on('cambiosOfertas', async (data) => {
    console.log('first');
    await actOfertasDB();
  });
});
onBeforeUnmount(() => {
  $socket.off('cambiosOfertas');
});
</script>

<style lang="scss" scoped></style>
