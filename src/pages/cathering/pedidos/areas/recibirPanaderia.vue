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
const filtro = {
  entrada: [
    '65a4475e446a5885b05739c6', // panaderia
    '66101ce13e9dea0b967b40fd', // reposteria
    '66101e1499cbfcfbe0650ee5', // siinple
    '66101cca5fe56d5206050674', // proveedores
  ],
  salida: [
    '661005cc5b32687efb0f6483', // panaderia
    '65a44754446a5885b05739c7', // reposteria
    '66101e5174ef16d9398df9ba', // siinple
  ],
};

const obtenerCatalogosProductos = async () => {
  console.log(useAuth.negocioElegido._id);
  const { entidadLeerMenu } = await pedidoService.leerCatalogoConOfertas(
    useAuth.negocioElegido._id,
  ); //@ts-ignore
  const { catalogoArbol } = await ofertaService.buscarCatalogoID();
  console.log(catalogoArbol);
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
