<template>
  <q-form @submit="formSubmit">
    <p>Hubieron los problemas siguientes :</p>
    <div class="flex">
      <q-card
        class="mr-3 mb-3"
        v-for="dif in edicion.diferencias"
        :key="dif._id">
        <q-card-section>
          <p>Marca {{ dif.marca.nombre }}</p>
          <p>
            Vence
            {{ dif.vencimiento ? fechaMes(dif.vencimiento) : '(sin)' }}
          </p>
          <p>
            {{
              dif.diferencia > 0
                ? `Hay ${dif.diferencia} por demás`
                : `Faltan ${-dif.diferencia}`
            }}
          </p>
        </q-card-section>
      </q-card>
    </div>
    <input-text
      tipo="textarea"
      label="Resolver este problema"
      info="Info #"
      noSlot
      :porDefecto="estado.dataForm.reporteResolucion"
      @update="v => (estado.dataForm.reporteResolucion = v)" />
    <q-toggle v-model="estado.dataForm.resuelto" color="green">
      Marcar como resuelto
    </q-toggle>

    <br />

    <!-- Submit -->
    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import type { Problema } from '#gql';
import { useAlmacen } from '~/modulos/almacen/almacen.composable';
const { store, authStore } = useAlmacen();

// definicion de los emits
const emits = defineEmits(['modificarObjeto']);

// definicion de los props
const props = withDefaults(
  defineProps<{
    edicion?: Problema;
  }>(),
  {
    edicion: null
  }
);

// datos por defecto del formulario
const initForm = {
  resuelto: props.edicion?.resuelto ?? false,
  reporteResolucion: props.edicion?.reporteResolucion
};

// definicion del estado
const estado = reactive({
  dataForm: clone(initForm)
});

// submision del formulario
const formSubmit = async () => {
  try {
    const entidad = await modificarUno(GqlModificarEntidades_problemas, {
      busqueda: authStore.getNegocio._id,
      datos: {
        problemas: {
          buscar: {
            _id: [props.edicion?._id]
          },
          modificar: {
            resuelto: estado.dataForm.resuelto,
            reporteResolucion: estado.dataForm.reporteResolucion
          }
        }
      }
    });
    emits(
      'modificarObjeto',
      entidad.problemas.find(v => v._id === props.edicion?._id),
      entidad
    );
  } catch (err) {
    errFailback(err);
    return;
  }
  // reinicializamos el formulario
  await store.refreshProblemas();
  estado.dataForm = clone(initForm);
};
</script>
