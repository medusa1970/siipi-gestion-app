<template>
  <div v-if="!estado.validar">
    <div>TOTAL PEDIDO : {{ precioTotal }} bs</div>
    <div class="flex">
      <div class="text-center">
        <q-btn
          :disable="items.length == 0"
          label="Confirmar"
          color="green"
          @click="estado.validar = true" />
      </div>
      <div class="text-center">
        <q-btn
          :disable="items.length == 0"
          label="reiniciar"
          color="orange"
          @click="reiniciarForm" />
      </div>
    </div>
    <br />
    <input-text
      label="Buscar"
      labelAdentro
      @update="(v) => (estado.filtros.buscar = v as string)"
      noSlot />
    <div v-for="cat in catRows" :key="cat._id" :name="cat._id">
      <q-tabs
        v-show="showTree.cats.includes(cat._id)"
        active-color="primary"
        indicator-color="primary">
        <q-tab :label="cat.nombre" />
      </q-tabs>
      <q-list>
        <div v-for="subCat in cat.hijas" name="cantidad">
          <q-expansion-item
            v-show="showTree.cats.includes(subCat._id)"
            :key="subCat._id"
            class="expansion2"
            switch-toggle-side>
            <template v-slot:header>
              {{ subCat.nombre }}
              ({{ contador[subCat._id][1] }}/{{ contador[subCat._id][0] }})
            </template>
            <div v-for="oferta in subCat.ofertas">
              <div
                v-if="estado.formData[oferta._id]"
                v-show="showTree.ofertas.includes(oferta._id)"
                :key="oferta._id"
                class="oferta flex items-center justify-between">
                <div>
                  <q-btn
                    flat
                    dense
                    @click="
                      imagen = oferta.imagen.cloudinaryUrl;
                      modalImagen = true;
                    ">
                    <q-img
                      :src="oferta.imagen?.cloudinaryUrl ?? ProductoImage"
                      spinner-color="black"
                      class="cell-image" />
                  </q-btn>
                  <input
                    v-model="estado.formData[oferta._id].cantidad"
                    @input="
                      () => {
                        if (estado.formData[oferta._id].cantidad === '') {
                          estado.formData[oferta._id].cantidad = 0;
                        }
                        estado.formData[oferta._id].precio = calcularPrecio(
                          oferta,
                          estado.formData[oferta._id].cantidad,
                          false
                        );
                      }
                    "
                    type="number"
                    min="0" />
                  {{ oferta.nombre }}
                </div>
                <div>
                  {{ estado.formData[oferta._id].precio }}
                  bs
                </div>
              </div>
            </div>
          </q-expansion-item>
        </div>
      </q-list>
    </div>
  </div>
  <div v-else>
    <p><b>Detalle:</b></p>
    <q-list>
      <div v-for="cat in catRows" :key="cat._id" :name="cat._id">
        <div v-for="subCat in cat.hijas" :key="subCat._id">
          <div v-for="oferta in subCat.ofertas">
            <div v-if="estado.formData[oferta._id].cantidad > 0">
              <q-item>
                <q-item-section>
                  {{ estado.formData[oferta._id].cantidad }}
                  {{ oferta.nombre }} -
                  {{ estado.formData[oferta._id].precio }}
                  bs
                </q-item-section>
              </q-item>
            </div>
          </div>
        </div>
      </div>
      <q-item>
        <q-item-section>
          <b>TOTAL {{ precioTotal }} bs </b></q-item-section
        >
      </q-item>
    </q-list>
    <div class="text-center">
      <q-btn label="Volver" color="orange" @click="estado.validar = false" />
      <q-btn label="Confirmar" color="green" @click="confirmarPedido" />
    </div>
  </div>
  <q-dialog v-model="modalImagen">
    <q-img
      :src="imagen ?? ProductoImage"
      width="300px"
      height="300px"
      fit="contain"
      @click="modalImagen = false"
      spinner-color="black" />
  </q-dialog>
</template>

<script setup lang="ts">
const emits = defineEmits(['pedidoHecho']);
import type { Catalogo } from '#gql';
import { formPedido } from './formPedido';
import ProductoImage from '@/assets/img/noHayProducto.png';
const {
  estado,
  mandarPedido,
  contador,
  items,
  catRows,
  showTree,
  reiniciarForm,
  calcularPrecio,
  precioTotal
} = formPedido();
const modalImagen = ref(false);
const imagen = ref(null);
const props = withDefaults(
  defineProps<{
    comprador: string;
    vendedor: string;
    catalogo: Catalogo;
  }>(),
  {}
);
onBeforeMount(() => {
  estado.comprador = props.comprador;
  estado.vendedor = props.vendedor;
  estado.catalogo = props.catalogo;
});

const $q = useQuasar();
const confirmarPedido = () => {
  $q.dialog({
    title: `Confirmar pedido`,
    message: `El pedido se va realizar.`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    const pedido = await mandarPedido();
    if (pedido) emits('pedidoHecho', pedido);
  });
};
</script>

<style scoped>
.q-card {
  border: none;
}
.expansion1 {
  margin-top: 20px;
  background-color: black;
  padding: 0;
  color: white;
}
.expansion2 {
  background-color: gray;
  padding: 0;
}
.oferta {
  background-color: white;
  color: black;
  padding: 3px;
}
.oferta input {
  border: 1px solid gray;
  padding: 3px;
  width: 80px;
}

/* Estilo base del checkbox */
.weekday {
  display: none !important;
}
input[type='checkbox'] + label {
  display: inline-block;
  border-radius: 50%;
  background: #dddddd;
  height: 37px;
  width: 37px;
  line-height: 37px;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
}
input[type='checkbox']:checked + label {
  background: #007bff;
  color: #ffffff;
}
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  text-align: center;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  white-space: nowrap; /* Prevent text from wrapping onto new lines */
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
.cell-image {
  width: 40px;
  height: 40px;
  border-radius: 20%;
  margin-right: 10px;
}
</style>
