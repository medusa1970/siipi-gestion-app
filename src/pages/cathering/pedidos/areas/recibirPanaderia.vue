<template>
  <h1>probando</h1>
  <FormPedido></FormPedido>
</template>

<script setup>
definePageMeta({
  layout: 'cathering',
});
import { ref, onMounted } from 'vue';
import { ofertaService } from '~/services/marca/ofertas.service';
import { menuService } from '~/services/punto/menu.service';
import { authStore } from '@/stores/auth.store';
import { pedidoService } from '~/services/punto/pedido.service';

const useAuth = authStore();

const obtenerCatalogosProductos = async () => {
  const { entidadLeerMenu } = await pedidoService.leerCatalogoConOfertas(
    useAuth.negocioElegido._id,
  ); //@ts-ignore
  console.log(entidadLeerMenu);
  // estado.catalogosOfertas = entidadLeerMenu.hijas;
  // estado.catalogoSeleccionado = entidadLeerMenu.hijas[0];
  // estado.catalogoSeleccionado2 = entidadLeerMenu.hijas[0];
};

onMounted(() => {
  console.log('first');
  obtenerCatalogosProductos();
});
</script>
