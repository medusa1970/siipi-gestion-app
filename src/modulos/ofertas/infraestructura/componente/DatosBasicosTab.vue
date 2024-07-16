<template>
  <q-form @submit.prevent="modificarDatosBasicosOferta">
    <p>Entre los datos basicos de la oferta:</p>
    <!-- nombre -->
    <input-text
      label="Nombre"
      @update="(v) => (estado.datos_ofertaBasica.nombre = v)"
      info="Se debe modificar el nombre UNICAMENTE para corrigir su ortografia o mejorar su descriptividad, caso contrario toca crear una nueva oferta."
      :porDefecto="estado.datos_ofertaBasica.nombre"
      :rules="[useRules.requerido()]"
    />
    <!-- abreviacion -->
    <input-text
      label="Abreviación"
      @update="(v) => (estado.datos_ofertaBasica.abreviacion = v)"
      info="Se debe modificar el abreviacion UNICAMENTE para corrigir su ortografia o mejorar su descriptividad."
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
      info="Seleccione la categoria a la que pertenece la oferta."
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
      info="Por favor elija una foto para la oferta, que se distinga claramente ante un fondo claro y unido. Prefiera un formato cuadrado."
      icono="photo_camera"
      :rules="[]"
      :dataPreview="estado.modOfertaBasicaImagen"
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
  // recuperamos la imagen desde la url
  if (ofertaStore.oferta.imagen?.cloudinaryUrl) {
    await UrlToBase64Image(
      ofertaStore.oferta.imagen?.cloudinaryUrl,
      (base64Data) => {
        estado.modOfertaBasicaImagen = base64Data;
      },
    );
  } else {
    estado.modOfertaBasicaImagen = null;
  }

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
