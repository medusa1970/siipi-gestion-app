<template>
  <q-form @submit="formSubmit">
    <!-- Cantidad Minima -->
    <input-text
      v-if="!props.edicion || !props.edicion.hasOwnProperty('_esOferta')"
      tipo="number"
      requerido
      label="Cantidad min."
      info="Info #50"
      :porDefecto="estado.dataForm.cantidadMin"
      @update="v => (estado.dataForm.cantidadMin = v)"
      :rules="[rule2]" />

    <!-- Precios -->
    <div class="flex">
      <input-text
        tipo="decimal"
        requerido
        :rules="[
          val =>
            val >= estado.precioMinS || 'Precio inferior al precio de compra.'
        ]"
        class="flex-grow"
        label="Precio sin
      factura"
        info="Info #51"
        :porDefecto="estado.dataForm.precioSinFactura"
        @update="v => (estado.dataForm.precioSinFactura = v)"
        :watch="estado.watchSin"
        :forceWatch="estado.forceWatchSin" />
      <q-btn
        icon="calculate"
        size="lg"
        :disable="!estado.dataForm.precioConFactura"
        :color="colorCalculateSin"
        flat
        dense
        @click="
          estado.forceWatchSin = !estado.forceWatchSin;
          estado.watchSin = estado.dataForm.precioConFactura * (100 / 113);
        " /><q-tooltip anchor="bottom right" self="top right" :offset="[0, -35]"
        >calcular sin factura -13%</q-tooltip
      >
    </div>
    <div class="flex">
      <input-text
        class="flex-grow"
        :rules="[
          val =>
            val >= estado.precioMinC || 'Precio inferior al precio de compra.'
        ]"
        label="Precio con factura"
        tipo="decimal"
        :porDefecto="estado.dataForm.precioConFactura"
        info="Info #52"
        @update="v => (estado.dataForm.precioConFactura = v)"
        :watch="estado.watchCon"
        :forceWatch="estado.forceWatchCon"
        requerido="Debe entrar un precio con factura" />
      <q-btn
        icon="calculate"
        size="lg"
        flat
        dense
        :disable="!estado.dataForm.precioSinFactura"
        :color="colorCalculateCon"
        @click="
          {
            estado.forceWatchCon = !estado.forceWatchCon;
            estado.watchCon = estado.dataForm.precioSinFactura * (113 / 100);
          }
        " /><q-tooltip anchor="bottom right" self="top right" :offset="[0, -35]"
        >calcular con factura +13%</q-tooltip
      >
    </div>

    <!-- Submit -->
    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import type { Oferta } from '#gql';
import type { Precio } from '#gql';
import { useOfertas } from '@/modulos/ofertas/ofertas.composable';
const { store } = useOfertas();

// definicion de los emits
const emits = defineEmits(['crearObjeto', 'modificarObjeto']);

// definicion de los props
const props = withDefaults(
  defineProps<{
    edicion?: Precio | Oferta;
    preciosProveedor?: any;
  }>(),
  {
    edicion: null,
    preciosProveedor: []
  }
);

// datos por defecto del formulario
const initForm = {
  // @ts-ignore
  cantidadMin: props.edicion?.cantidadMin ?? null,
  precioConFactura: props.edicion?.precioConFactura ?? null,
  precioSinFactura: props.edicion?.precioSinFactura ?? null
};

// definicion del estado
const estado = reactive({
  dataForm: clone(initForm),
  watchSin: null as number,
  watchCon: null as number,
  forceWatchCon: false,
  forceWatchSin: false,
  precioMinS: 0,
  precioMinC: 0
});

// color de los botones calduladoras
const colorCalculateSin = computed(() =>
  estado.dataForm.precioConFactura ? 'orange' : 'orange-4'
);
const colorCalculateCon = computed(() =>
  estado.dataForm.precioSinFactura ? 'orange' : 'orange-4'
);

// Inicializaciones
onMounted(async () => {
  if (props.preciosProveedor) {
    estado.precioMinS = props.preciosProveedor.reduce(
      (precioMin, precio) =>
        precioMin === null ? precio[0] : Math.min(precioMin, precio[0]),
      null
    );
    estado.precioMinC = props.preciosProveedor.reduce(
      (precioMin, precio) =>
        precioMin === null ? precio[1] : Math.min(precioMin, precio[1]),
      null
    );
  }
});

// submision del formulario
const formSubmit = async () => {
  try {
    // si es una oferta
    if (props.edicion && props.edicion.hasOwnProperty('_esOferta')) {
      const oferta = await modificarUno(GqlModificarOfertas, {
        busqueda: store.oferta._id,
        datos: {
          precioConFactura: estado.dataForm.precioConFactura,
          precioSinFactura: estado.dataForm.precioSinFactura
        }
      });
      emits('modificarObjeto', null, oferta);
    }

    // si edicion de precio por mayor
    else if (props.edicion) {
      const oferta = await modificarUno(GqlModificarOfertas, {
        busqueda: store.oferta._id,
        datos: {
          preciosPorMayor: {
            buscar: {
              _id: [props.edicion._id]
            },
            modificar: estado.dataForm
          }
        }
      });
      emits(
        'modificarObjeto',
        oferta.preciosPorMayor.find(v => v._id === props.edicion?._id),
        oferta
      );
    }

    // es creacion de precio por mayor
    else {
      const oferta = await modificarUno(GqlModificarOfertas, {
        busqueda: store.oferta._id,
        datos: {
          preciosPorMayor: {
            agregar: estado.dataForm
          }
        }
      });
      emits('crearObjeto', ultimo(oferta.preciosPorMayor), oferta);
    }
  } catch (err) {
    errFailback(err);
    return;
  }
  await store.refreshOfertas();
  estado.dataForm = clone(initForm);
};

// rule dos
const rule2 = (val: number): String | true => {
  if (
    !(props.edicion && props.edicion.hasOwnProperty('_esOferta')) &&
    Number(val) <= 1
  ) {
    return 'Los precios por mayor son a partir de 2';
  } else {
    return true;
  }
};
</script>
