<template>
  <Navigation2
    :nav="[{ label: 'productos', to: 'productos' }]"
    titulo="Gestion de productos"
  />
  <Table
    :rows="productoStore.productos"
    :columns="[
  {
    name: 'imagen',
    label: 'Imagen',
    imagen: true,
    align: 'center',
    field: (row: any) => row.imagen?.cloudinaryUrl,
  },
  {
    name: 'modificado',
    label: 'Modif.',
    align: 'left',
    field: (row: any) => row._modificado,
    format: (val, row) => `${fechaMes(row._modificado ?? row._creado) }`,
    sortable: true,
  },
  {
    name: 'nombre',
    required: true,slot:true,
    label: 'Nombre',
    align: 'left',
    field: (row: any) => row.nombre,
    sortable: true,
  },
  {
    name: 'medida',
    required: true,
    label: 'Unidad',
    align: 'left',
    field: (row: any) => row.medida?.abreviacion,
    sortable: true,
  },
  {
    name: 'categoria',
    required: true,
    label: 'categoria',
    align: 'left',
    field: (row: any) => row.categoria.nombre,
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'right',
    slot: true,
  },
]"
    :defaultImage="ProductoImage"
  >
    <!-- BADGE -->
    <template #dropdown>
      <q-btn
        icon-right="add"
        color="green"
        label="Crear producto"
        no-caps
        style="font-size: 14.5px"
        padding="4px 10px"
        @click="
          () => {
            estado.modal.show_crearProductoBasico = true;
          }
        "
      />
    </template>
    <template #body-cell-actions="{ row }">
      <q-btn-group
        push
        @click="
          (e) => {
            e.stopPropagation();
          }
        "
      >
        <q-btn
          class="p-1"
          color="black"
          size="sm"
          icon="edit"
          @click="goTo(router, 'producto', { id: row._id })"
        />
      </q-btn-group>
    </template>
    <template #body-cell-nombre="{ val, row }">
      {{ val }}
      <br />
      <q-badge
        v-for="variedad in row.variedades"
        :key="variedad._id"
        color="green"
        class="mr-2 lowercase"
      >
        {{ variedad.marca?.nombre }}
      </q-badge>
    </template>
    <template #body-expand="{ row }">
      <div class="text-left">
        <h1 class="text-center bg-gray-300 font-bold py-[2px]">
          DATOS BASICOS
        </h1>
        <span class="flex gap-2 items-center"
          ><h1 class="font-bold text-xs">NOMBRE:</h1>
          <p>{{ row.nombre }}</p></span
        >
        <span class="flex gap-2 items-center"
          ><h1 class="font-bold text-xs">COMENTARIO:</h1>
          <p>{{ row.comentario }}</p></span
        >
        <span class="flex gap-2 items-center"
          ><h1 class="font-bold text-xs">CATEGORIA:</h1>
          <p>{{ row.categoria?.nombre }}</p></span
        >
        <!-- MARCAS -->
        <h1 class="text-center bg-gray-300 font-bold py-[2px]">MARCAS</h1>
        <div
          v-for="variedad in row.variedades"
          :key="variedad._id"
          class="border border-gray-400 p-1 mt-1 rounded-[4px] mb-1"
        >
          <span class="flex gap-2 items-center"
            ><h1 class="font-bold text-xs">MARCA:</h1>
            <p>{{ variedad.marca.nombre }}</p></span
          >
          <span class="flex gap-2 items-center"
            ><h1 class="font-bold text-xs">CANTIDAD MINIMA:</h1>
            <p>{{ variedad.cantidadLimite }}</p>
          </span>
          <span class="flex gap-2 items-center"
            ><h1 class="font-bold text-xs">CANTIDAD MAXIMA:</h1>
            <p>{{ variedad.cantidadMaxPedido }}</p></span
          >
        </div>
        <h1 v-if="row.variedades.length == 0">Sin marcas ...</h1>

        <!-- MEDIDAS -->
        <h1 class="text-center bg-gray-300 font-bold py-[2px]">
          MEDIDA & EMPAQUES
        </h1>
        <span class="flex gap-2 items-center"
          ><h1 class="font-bold text-xs">MEDIDA:</h1>
          <p v-if="row.medida">
            {{ row.medida?.nombre }}
          </p>
          <p v-else>sin medida basica...</p>
        </span>
        <div
          v-for="empaque in row.empaques"
          :key="empaque.nombre"
          class="border border-gray-400 p-1 mt-1 rounded-[4px] mb-1"
        >
          <span class="flex gap-2 items-center"
            ><h1 class="font-bold text-xs">NOMBRE:</h1>
            <p>{{ empaque.nombre }}</p></span
          >
          <span class="flex gap-2 items-center"
            ><h1 class="font-bold text-xs">ABREVIACION:</h1>
            <p>{{ empaque.abreviacion }}</p></span
          >
          <span class="flex gap-2 items-center"
            ><h1 class="font-bold text-xs">CANTIDAD:</h1>
            <p>{{ empaque.cantidad }}</p></span
          >
          <span class="flex gap-2 items-center"
            ><h1 class="font-bold text-xs">MARCA:</h1>
            <p>{{ empaque.marca.nombre }}</p></span
          >
        </div>
        <h1 v-if="row.empaques.length == 0">Sin empaques ...</h1>
      </div>
    </template>
  </Table>

  <!-- 
    MODAL
    crearProductoBasico 
  -->

  <Dialog2
    v-model="estado.modal.show_crearProductoBasico"
    title="Crear producto"
    label-btn="Crear"
    :handle-submit="crearProductoBasico"
  >
    <template #inputsDialog>
      <!--h1 class="text-center bg-gray-300 font-bold py-[2px]">DATOS BASICOS</h1-->
      <p>
        <b>Por favor asegúrese que el producto todavía no existe</b> ayudándose
        del buscador.
      </p>

      <!-- nombre -->
      <input-text
        label="Nombre"
        info="Por favor antes de crear un producto, asegúrese que no existe todavá. Ayúdese del buscador de la tabla."
        @update="(v) => (estado.datos_crearProductoBasico.nombre = v)"
        :rules="[useRules.requerido()]"
        :error="estado.errorProducto"
      />

      <!-- Categoria -->
      <input-select
        label="Categoria"
        :opciones="estado.categoriasParaSelect"
        info="La categoría existe solamente a fines de ubicar facilmente el producto en administracion. Para crear una nueva categoria, vaya al menu Logistica > Categorías."
        @update="(v) => (estado.datos_crearProductoBasico.categoria = v)"
        :rules="[useRules.requerido()]"
        :dialog="agregarCategoriaComp"
      />

      <!-- Imagen -->
      <input-image
        label="Imagen"
        info="Por favor elija una foto del producto solo, que se distinga claramente ante un fondo claro y unido. Prefiera un formato cuadrado."
        @update="
          (base64Data, mimetype) =>
            (estado.datos_crearProductoBasico.imagen = base64Data
              ? { data: base64Data, mimetype: mimetype }
              : null)
        "
        icono="photo_camera"
      />

      <div class="">
        <q-checkbox v-model="estado.datos_crearProductoBasico.puedeVencer" />
        Puede vencer ?
      </div>

      <div v-if="estado.datos_crearProductoBasico.puedeVencer" class="flex">
        <input-text
          style="width: 50%"
          label="Primer aviso"
          @update="
            (v) =>
              (estado.datos_crearProductoBasico.vencimientoLimite[0] =
                Number(v))
          "
          :porDefecto="
            '' + (productoStore.producto.vencimientoLimite?.[0] ?? 0)
          "
          :rules="[useRules.requerido(), useRules.numero()]"
        />
        <input-text
          style="width: 50%"
          label="Segundo aviso"
          info="Cuando faltarán el número de días indicado en el primer campo, se lanzará una alerta naranja, y una alerta roja al llegar al números de días indicados en el segundo."
          @update="
            (v) =>
              (estado.datos_crearProductoBasico.vencimientoLimite[1] =
                Number(v))
          "
          :porDefecto="
            '' + (productoStore.producto.vencimientoLimite?.[1] ?? 0)
          "
          :rules="[useRules.requerido(), useRules.numero()]"
        />
      </div>

      <input-text
        tipo="textarea"
        label="comentario"
        info="Agregue cualquier información adicional que sea útil registrar junto con el producto."
        @update="(v) => (estado.datos_crearProductoBasico.comentario = v)"
      />
    </template>
  </Dialog2>

  <!-- 
  VER INFORMACION PRODUCTO
  -->
  <Dialog
    v-model="estado.modal.show_informacionProducto"
    title="Informacion producto"
    no-btn
  >
    <template #inputsDialog>
      <!-- <h1 class="font-bold uppercase text-center mb-2 text-blue-800">
        {{ producto.informacion.nombre }}
      </h1> -->
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">DATOS BASICOS</h1>
      <span class="flex gap-2 items-center"
        ><h1 class="font-bold text-xs">NOMBRE:</h1>
        <p>{{ estado.producto?.nombre }}</p></span
      >
      <span class="flex gap-2 items-center"
        ><h1 class="font-bold text-xs">COMENTARIO:</h1>
        <p>{{ estado.producto?.comentario }}</p></span
      >
      <span class="flex gap-2 items-center"
        ><h1 class="font-bold text-xs">CATEGORIA:</h1>
        <p>{{ estado.producto.categoria?.nombre }}</p></span
      >

      <!-- MARCAS -->
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">MARCAS</h1>
      <div
        v-for="variedad in estado.producto.variedades"
        :key="variedad._id"
        class="border border-gray-400 p-1 mt-1 rounded-[4px] mb-1"
      >
        <span class="flex gap-2 items-center"
          ><h1 class="font-bold text-xs">MARCA:</h1>
          <p>{{ variedad.marca.nombre }}</p></span
        >
        <span class="flex gap-2 items-center"
          ><h1 class="font-bold text-xs">CANTIDAD MINIMA:</h1>
          <p>{{ variedad.cantidadLimite }}</p>
        </span>
        <span class="flex gap-2 items-center"
          ><h1 class="font-bold text-xs">CANTIDAD MAXIMA:</h1>
          <p>{{ variedad.cantidadMaxPedido }}</p></span
        >
      </div>
      <h1 v-if="estado.producto.variedades.length == 0">Sin marcas ...</h1>

      <!-- MEDIDAS -->
      <h1 class="text-center bg-gray-300 font-bold py-[2px]">
        MEDIDA & EMPAQUES
      </h1>
      <span class="flex gap-2 items-center"
        ><h1 class="font-bold text-xs">MEDIDA:</h1>
        <p v-if="estado.producto?.medida">
          {{ estado.producto?.medida?.nombre }}
        </p>
        <p v-else>sin medida basica...</p>
      </span>
      <div
        v-for="empaque in estado.producto.empaques"
        :key="empaque.nombre"
        class="border border-gray-400 p-1 mt-1 rounded-[4px] mb-1"
      >
        <span class="flex gap-2 items-center"
          ><h1 class="font-bold text-xs">NOMBRE:</h1>
          <p>{{ empaque.nombre }}</p></span
        >
        <span class="flex gap-2 items-center"
          ><h1 class="font-bold text-xs">ABREVIACION:</h1>
          <p>{{ empaque.abreviacion }}</p></span
        >
        <span class="flex gap-2 items-center"
          ><h1 class="font-bold text-xs">CANTIDAD:</h1>
          <p>{{ empaque.cantidad }}</p></span
        >
        <span class="flex gap-2 items-center"
          ><h1 class="font-bold text-xs">MARCA:</h1>
          <p>{{ empaque.marca.nombre }}</p></span
        >
      </div>
      <h1 v-if="estado.producto.empaques.length == 0">Sin empaques ...</h1>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Table from '@/components/input/Table.vue';
import ProductoImage from '@/assets/img/producto.png';
import { useProducto } from '@/modulos/productos/infraestructura/productos/productos.composable';
import { storeProducto } from '@/modulos/productos/negocio/producto.store';
import agregarCategoriaComp from '~/modulos/productos/infraestructura/selects/agregarCategoria.vue';
const router = useRouter();
const productoStore = storeProducto();

const { estado, crearProductoBasico, actProductosDB, categoriaSelectOptions } =
  useProducto();

// layout
definePageMeta({
  layout: 'cathering',
});

const { $socket } = useNuxtApp();
onMounted(async () => {
  productoStore.productos = await productoStore.getProductos();

  estado.categoriasParaSelect = await categoriaSelectOptions(true);

  // let reloaded = localStorage.getItem('reloaded');
  // if (reloaded) {
  //   console.log('Se ha recargado la pagina');
  // } else {
  //   console.log('No se ha recargado la pagina');
  //   localStorage.setItem('reloaded', 'true');
  // }
  $socket.on('cambiosProductos', async (data: any) => {
    await actProductosDB();
  });
});

onBeforeUnmount(() => {
  // localStorage.removeItem('reloaded');
  $socket.off('cambiosProductos');
});
</script>

<style scoped>
.prove {
  border: 1px solid red;
}
.table-cell-image {
  display: flex;
  justify-content: center;
  padding: 5px 0;
}
.cell-image {
  width: 70px;
  height: 70px;
}
.q-poput-edit {
  min-width: 400px !important;
}
.truncate-7 {
  display: inline-block;
  width: 15ch;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: uppercase;
}
</style>
