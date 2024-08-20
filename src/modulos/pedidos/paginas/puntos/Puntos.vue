<template>
  <div class="w-full max-w-[400px] max-sm:w-[350px] mx-auto">
    <!-- <q-btn
      color="primary"
      label="prueba impresora"
      no-caps
      padding="2px 10px"
      @click="pruebaImpresora" /> -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="font-bold">Pedidos por Aceptar:</h1>

      <span class="flex gap-2" v-if="pedidoStore.pedidosSinAceptar.length > 0">
        <q-btn
          class="text-orange-500"
          icon="warning"
          dense
          size="11px"
          flat
          round
          @click="mostrarEntidadSinPedidos"
          ><q-tooltip class="no-print bg-gray-400-500"
            >Entidades sin pedidos</q-tooltip
          ></q-btn
        >
      </span>
    </div>
    <h1 v-if="pedidoStore.pedidosSinAceptar.length === 0">
      No hay pedidos😯...
    </h1>

    <Item
      v-for="punto in pedidoStore.pedidosSinAceptar"
      :key="punto._id"
      :title="punto.comprador.nombre"
      class="w-full max-sm:w-full"
      :href="`listaPedidos/${punto._id}`"
      :title2="formateadorFecha(punto.estado[0]?._creado)">
      <template v-slot:actions>
        <div class="flex">
          <q-btn
            dense
            round
            icon="print"
            flat
            color="orange"
            padding="4px"
            size="12px"
            class="no-print"
            @click="imprimir(punto)" />
        </div>
      </template>
    </Item>
    <h1 class="font-bold">Pedidos Aceptados:</h1>
    <h1 v-if="pedidoStore.pedidosAceptados.length === 0">
      No hay pedidos😯...
    </h1>
    <Item
      v-for="punto in pedidoStore.pedidosAceptados"
      :key="punto._id"
      :href="`listaPedidos/${punto._id}`"
      :title="punto.comprador?.nombre"
      class="w-[400px] max-sm:w-full"
      :title2="formateadorFecha(punto.estado[0]._creado)">
      <template v-slot:actions>
        <div class="flex">
          <h1 class="text-orange-500 font-bold">
            {{ punto.estadoItems }}
          </h1>
          <q-btn
            dense
            round
            icon="print"
            flat
            color="orange"
            padding="4px"
            size="12px"
            class="no-print"
            @click="imprimir(punto)"
            ><q-tooltip class="no-print bg-gray-400-500"
              >Imprimir pedido</q-tooltip
            ></q-btn
          >
        </div>
      </template>
    </Item>
  </div>
  <!-- IMPRESION -->
  <div id="divParaImprimir" v-if="estado.pedidoSeleccionado" class="w-[283px]">
    <div style="text-align: center">
      <!-- <NuxtImg src="/logo.png" alt="logoSiipi" width="100" height="50" /> -->
      <NuxtImg
        id="logoParaImprimir"
        src="/logo.png"
        alt="logoSiipi"
        width="100"
        height="50" />
      <!-- <img src="/logo.png" alt="logoSiipi" width="100" height="50" /> -->
    </div>

    <div
      style="
        font-family: 'Nunito Sans', sans-serif;
        line-height: 1.2;
        margin: 10px 0;
        font-size: 12px;
      ">
      <p>Origen: {{ estado.pedidoSeleccionado.comprador.nombre }}</p>
      <p>Destino: {{ estado.pedidoSeleccionado.vendedor.nombre }}</p>
      <p>
        Responsable: {{ estado.pedidoSeleccionado.estado[0].persona.nombre }}
        {{ estado.pedidoSeleccionado.estado[0].persona.apellido }}
      </p>
      <p>
        Fecha:
        {{ formateadorFecha(estado.pedidoSeleccionado.estado[0]._creado) }}
      </p>
    </div>
    <p style="text-align: center">------------------------------------------</p>
    <table>
      <tbody>
        <tr
          v-for="item in estado.pedidoSeleccionado.items"
          :key="item._id"
          style="font-size: 12px">
          <td>{{ item.oferta.nombre }}</td>
          <td>{{ item.cantidad }}</td>
        </tr>
      </tbody>
    </table>
    <br />
  </div>
</template>

<script setup>
import { usePuntos } from './puntos.composable';
definePageMeta({
  layout: 'cathering'
});

const { estado, authStore, buscarPedidos, pedidoStore, imprimir } = usePuntos();

onMounted(async () => {
  await buscarPedidos();
});
</script>

<style lang="scss" scoped>
@media print {
  /* Ocultar la URL del navegador en la impresión */
  #url {
    display: none;
  }

  @page :left {
    margin: 0.5cm;
  }

  @page :right {
    margin: 0.8cm;
  }
  .no-print {
    display: none;
  }
  // body {
  //   // width: 80mm; /* Ajusta el ancho según las especificaciones de tu impresora térmica */
  //   // font-size: 12px; /* Ajusta el tamaño de fuente según tus necesidades */
  //   visibility: hidden;
  // }

  // #printableArea,
  // #printableArea * {
  //   visibility: visible;
  // }
  // #printableArea {
  //   /* Aquí puedes agregar los estilos específicos para el div que quieres imprimir */
  //   // position: absolute;
  //   left: 0;
  //   top: 0;
  //   font-size: 10px;
  //   line-height: 1.2;
  //   text-align: justify;
  // }

  /* Oculta todos los elementos que no quieres imprimir */
  // .no-print,
  // .no-print * {
  //   display: none !important;
  // }
}
</style>
