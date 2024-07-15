<template>
  <q-form @submit="formSubmit">
    <!-- Variedad -->
    <input-select2
      label="Marca"
      :opciones="estado.marcaOpciones"
      info="SelecInfo."
      :porDefecto="estado.dataForm.marca"
      @update="(v) => (estado.dataForm.marca = v)"
      :rules="[useRules.requerido()]"
      :dialog="formMarca"
      :disable="edicion != null"
    />

    <!-- Categoria -->
    <input-select2
      label="Proveedor"
      :opciones="estado.proveedorOpciones"
      info="Info."
      :porDefecto="estado.dataForm.proveedor"
      @update="(v) => (estado.dataForm.proveedor = v)"
      :rules="[useRules.requerido()]"
      :dialog="formProveedor"
      :disable="edicion != null"
    />

    <!-- Identificativo -->
    <input-text2
      label="Identificativo"
      :porDefecto="estado.dataForm.identificativo"
      @update="(v) => (estado.dataForm.identificativo = v)"
    />

    <!-- Precios -->
    <input-text2
      label="Precio con factura"
      :porDefecto="estado.dataForm.precioConFactura"
      @update="(v) => (estado.dataForm.precioConFactura = Number(v))"
      :rules="[useRules.numero()]"
    />
    <input-text2
      label="precio sin factura"
      :porDefecto="estado.dataForm.precioSinFactura"
      @update="(v) => (estado.dataForm.precioSinFactura = Number(v))"
      :rules="[useRules.numero()]"
    />

    <!-- Por mayor -->
    <div class="flex justify-between items-center mt-2 mb-1">
      <h1 class="font-bold text-xs">PRECIOS POR MAYOR:</h1>
      <q-btn
        color="primary"
        label="Agregar precio"
        dense
        no-caps
        padding="1px 6px"
        @click="estado.showFormPorMayor = true"
      />
    </div>
    <table class="min-w-full bg-white rounded-sm overflow-hidden">
      <thead class="bg-teal-700 text-white">
        <tr class="[&>th]:py-1">
          <th class="text-center text-xs uppercase tracking-wider">Cantidad</th>
          <th class="text-center text-xs uppercase tracking-wider">
            Precio C/F
          </th>
          <th class="text-center text-xs uppercase tracking-wider">
            Precio S/F
          </th>
          <th class="text-center text-xs uppercase tracking-wider">Acciones</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr
          v-for="(precio, index) in estado.dataForm.preciosPorMayor"
          :key="index"
          class="[&>td]:border [&>td]:border-gray-400"
        >
          <td class="whitespace-nowrap text-center">
            {{ precio.cantidadMin }}
          </td>
          <td class="whitespace-nowrap text-center">
            {{ precio.precioConFactura }}
          </td>
          <td class="whitespace-nowrap text-center">
            {{ precio.precioSinFactura }}
          </td>
          <td class="whitespace-nowrap text-center">
            <q-btn color="primary" icon="edit" dense size="10px" flat />
            <q-btn color="red" icon="delete" dense size="10px" flat />
          </td>
        </tr>
      </tbody>
    </table>
    <br />
    <!-- Submit -->
    <div class="text-center">
      <q-btn label="Guardar" color="green" type="submit" />
    </div>
  </q-form>

  <Dialog2 v-model="estado.showFormPorMayor" titulo="Agregar precio por mayor">
    <template #body>
      <q-form @submit="addPpmSubmit">
        <input-text2
          label="Cantidad min."
          :porDefecto="estado.dataFormPorMayor.cantidadMin"
          @update="(v) => (estado.dataFormPorMayor.cantidadMin = Number(v))"
          :rules="[useRules.requerido(), useRules.numero()]"
        />
        <input-text2
          label="Precio con factura"
          :porDefecto="estado.dataFormPorMayor.precioConFactura"
          @update="
            (v) => (estado.dataFormPorMayor.precioConFactura = Number(v))
          "
          :rules="[useRules.numero()]"
        />
        <input-text2
          label="precio sin factura"
          :porDefecto="estado.dataFormPorMayor.precioSinFactura"
          @update="
            (v) => (estado.dataFormPorMayor.precioSinFactura = Number(v))
          "
          :rules="[useRules.numero()]"
        />

        <!-- Submit -->
        <div class="text-center">
          <q-btn label="Guardar" color="green" type="submit" />
        </div>
      </q-form>
    </template>
  </Dialog2>
</template>

<script setup lang="ts">
import type { Servicio } from '#gql';

// definicion de los props
const props = withDefaults(
  defineProps<{
    config?: { proveedorId?: string };
    edicion: Servicio | null;
  }>(),
  {
    edicion: null,
  },
);

import formMarca from '@/modulos2/almacen/forms/formMarca.vue';
import formProveedor from '@/modulos2/almacen/forms/formProveedor.vue';
import { useFormServicio2 } from './formServicio2';
const {
  estado,
  llenarMarcaOpciones,
  llenarProveedorOpciones,
  formSubmit,
  addPpmSubmit,
} = useFormServicio2(props);

import { useAlmacen } from '~/modulos2/almacen/almacen.composable';
const { store } = useAlmacen();

// Inicializaciones
onMounted(async () => {
  await llenarMarcaOpciones();
  await llenarProveedorOpciones();
});
</script>
