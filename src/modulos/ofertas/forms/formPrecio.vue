<template>
  <q-form @submit="formSubmit">
    <!-- Cantidad Minima -->
    <input-text
      v-if="!props.edicion || !props.edicion.hasOwnProperty('_esOferta')"
      tipo="number"
      label="Cantidad min."
      info="Info #50"
      :porDefecto="estado.dataForm.cantidadMin"
      @update="(v) => (estado.dataForm.cantidadMin = v)"
      :rules="[useRules.requerido(), rule2]"
    />

    <!-- Precios -->
    <div class="flex">
      <input-text
        label="Precio sin factura"
        tipo="decimal"
        info="Info #51"
        :porDefecto="estado.dataForm.precioSinFactura"
        @update="(v) => (estado.dataForm.precioSinFactura = v)"
        :watch="estado.watchSin"
        :rules="[useRules.requerido()]"
      />
      <q-btn
        icon="calculate"
        v-if="estado.dataForm.precioConFactura"
        flat
        dense
        style="height: 40px"
        color="orange"
        @click="
          estado.watchSin = estado.dataForm.precioConFactura * (100 / 113)
        "
      /><q-tooltip anchor="bottom right" self="top right" :offset="[0, -35]"
        >calcular sin factura -13%</q-tooltip
      >
    </div>
    <div class="flex">
      <input-text
        label="Precio con factura"
        tipo="decimal"
        :porDefecto="estado.dataForm.precioConFactura"
        info="Info #52"
        @update="(v) => (estado.dataForm.precioConFactura = v)"
        :watch="estado.watchCon"
        :rules="[useRules.requerido()]"
      />
      <q-btn
        v-if="estado.dataForm.precioSinFactura"
        icon="calculate"
        flat
        dense
        style="height: 40px"
        color="orange"
        @click="
          estado.watchCon = estado.dataForm.precioSinFactura * (113 / 100)
        "
      /><q-tooltip anchor="bottom right" self="top right" :offset="[0, -35]"
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
    edicion: Precio | Oferta | null;
  }>(),
  {
    edicionOferta: null,
    edicion: null,
  },
);

// datos por defecto del formulario
const initForm = {
  // @ts-ignore
  cantidadMin: props.edicion?.cantidadMin ?? null,
  precioConFactura: props.edicion?.precioConFactura ?? null,
  precioSinFactura: props.edicion?.precioSinFactura ?? null,
};

// definicion del estado
const estado = reactive({
  dataForm: clone(initForm),
  watchSin: null as number,
  watchCon: null as number,
});

// Inicializaciones
onMounted(async () => {});

// submision del formulario
const formSubmit = async () => {
  try {
    // si es una oferta
    if (props.edicion && props.edicion.hasOwnProperty('_esOferta')) {
      const oferta = await api.modificarOferta(store.oferta._id, {
        precioConFactura: estado.dataForm.precioConFactura,
        precioSinFactura: estado.dataForm.precioSinFactura,
      });
      emits('modificarObjeto', null, oferta);
    }

    // si edicion de precio por mayor
    else if (props.edicion) {
      const oferta = await api.modificarOferta(store.oferta._id, {
        preciosPorMayor: {
          buscar: {
            _id: [props.edicion._id],
          },
          modificar: estado.dataForm,
        },
      });
      emits(
        'modificarObjeto',
        oferta.preciosPorMayor.find((v) => v._id === props.edicion?._id),
        oferta,
      );
    }

    // es creacion de precio por mayor
    else {
      const oferta = await api.modificarOferta(store.oferta._id, {
        preciosPorMayor: {
          agregar: estado.dataForm,
        },
      });
      emits('crearObjeto', ultimo(oferta.preciosPorMayor), oferta);
    }
  } catch (err) {
    errFallBack(err);
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