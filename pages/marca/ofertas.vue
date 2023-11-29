<template>
  <div>
    <Navigation label="Ofertas" icon="folder" />
    <Table :rows="Catalogos[0].items" :columns="columnsOfertas" badge dense>
      <!-- AGREGAR -->
      <template #dropdown>
        <q-btn
          icon-right="add"
          color="green"
          label="Agregar oferta"
          no-caps
          style="padding: 7px 15px"
          @click="() => (test = true)"
        />
      </template>
      <!-- BADGE -->
      <template #rows-badge="{ props }">
        <q-tr :props="props">
          <q-td key="nombre" :props="props">
            {{ props.row.nombre }}
          </q-td>
          <q-td key="descripcion" :props="props">
            {{ props.row.descripcion }}
          </q-td>
          <q-td key="productos" :props="props">
            <div v-for="(producto, index) in props.row.productos" :key="index">
              <h2>{{ producto.p }}</h2>
            </div>
          </q-td>
          <q-td key="grupos" :props="props">
            <div v-for="(grupo, index) in props.row.grupos" :key="index">
              <q-badge color="green">
                {{ grupo }}
              </q-badge>
            </div>
          </q-td>
          <q-td key="precio" :props="props">
            {{ props.row.precio + ' Bs' }}
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn color="red" icon="more_horiz" flat round>
              <q-menu
                transition-show="rotate"
                transition-hide="rotate"
                anchor="top start"
                self="top right"
              >
                <q-list dense style="min-width: 100px">
                  <q-item clickable v-close-popup class="test">
                    <q-icon name="edit" size="20px" color="blue" />
                    <q-item-section class="font-bold">Editar</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup class="test">
                    <q-icon name="delete" size="20px" color="red" />
                    <q-item-section class="font-bold">Eliminar</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </Table>
  </div>
  <!-- MODAL AGREGAR PRODUCTO -->
  <Dialog v-model="test" title="Agregar oferta">
    <template #inputsDialog>
      <q-input v-model="oferta.nombre" type="text" label="Nombre" />
      <q-input v-model="oferta.descripcion" type="text" label="Descripcion" />
      <q-select
        v-model="oferta.tags"
        multiple
        :options="tags"
        use-chips
        stack-label
        label="Tags"
      >
        <template v-slot:selected-item="scope">
          <q-chip
            removable
            dense
            @remove="scope.removeAtIndex(scope.index)"
            :tabindex="scope.tabindex"
            color="green"
            text-color="white"
            class="p-3"
            >{{ scope.opt }}</q-chip
          >
        </template>
      </q-select>
      <q-select
        v-model="oferta.grupos"
        multiple
        :options="tags"
        use-chips
        stack-label
        label="Grupos"
      >
        <template v-slot:selected-item="scope">
          <q-chip
            removable
            dense
            @remove="scope.removeAtIndex(scope.index)"
            :tabindex="scope.tabindex"
            color="green"
            text-color="white"
            class="p-3"
            >{{ scope.opt }}</q-chip
          >
        </template>
      </q-select>
      <span
        style="
          display: flex;
          gap: 10px;
          justify-content: center;
          align-items: center;
        "
      >
        <q-input
          color="secondary"
          label="Ingredientes"
          v-model="oferta.ingredientes[0].nombre"
          readonly
          style="flex: 1 0 auto"
          ><template v-slot:prepend> <q-icon name="bi-cart2" /> </template
        ></q-input>
        <q-btn
          size="14px"
          icon="add"
          color="primary"
          round
          style="height: 14px"
          @click="() => (dialog.isAddIngredients = true)"
        ></q-btn>
      </span>
      <span
        style="
          display: flex;
          gap: 10px;
          justify-content: center;
          align-items: center;
        "
      >
        <q-input
          color="secondary"
          label="Condiciones"
          v-model="oferta.condiciones[0]"
          readonly
          style="flex: 1 0 auto"
          ><template v-slot:prepend> <q-icon name="bi-lightbulb" /> </template
        ></q-input>
        <q-btn
          size="14px"
          icon="add"
          color="primary"
          round
          style="height: 14px"
          @click="() => (dialog.isAddConditions = true)"
        ></q-btn>
      </span>
    </template>
  </Dialog>

  <!--MODAL CONDICIONES -->
  <Dialog v-model="dialog.isAddConditions" title="Agregar Condiciones" card-big>
    <template #inputsDialog>
      <div class="flex flex-col gap-2">
        <Expansion title="Monto minimo" icon="bi-currency-dollar" color="green">
          <template #contenido>
            <q-input
              v-model="oferta.nombre"
              type="text"
              label="monto"
              dense
              filled
            />
          </template>
        </Expansion>
        <Expansion title="Dias" icon="bi-calendar-day" color="blue">
          <template #contenido>
            <span class="flex justify-center gap-2">
              <input
                v-model="oferta.condiciones"
                value="lunes"
                type="checkbox"
                id="weekday-monday"
                class="weekday"
              />
              <label for="weekday-monday">L</label>
              <input
                v-model="oferta.condiciones"
                value="martes"
                type="checkbox"
                id="weekday-tuesday"
                class="weekday"
              />
              <label for="weekday-tuesday">M</label>
              <input
                v-model="oferta.condiciones"
                value="miercoles"
                type="checkbox"
                id="weekday-wednesday"
                class="weekday"
              />
              <label for="weekday-wednesday">M</label>
              <input
                v-model="oferta.condiciones"
                value="jueves"
                type="checkbox"
                id="weekday-thursday"
                class="weekday"
              />
              <label for="weekday-thursday">J</label>
              <input
                v-model="oferta.condiciones"
                value="viernes"
                type="checkbox"
                id="weekday-friday"
                class="weekday"
              />
              <label for="weekday-friday">V</label>
              <input
                v-model="oferta.condiciones"
                value="sabado"
                type="checkbox"
                id="weekday-saturday"
                class="weekday"
              />
              <label for="weekday-saturday">S</label>
            </span>
          </template>
        </Expansion>
        <Expansion title="Fecha" icon="bi-calendar2-date" color="orange">
          <template #contenido>
            <div class="flex justify-center">
              <q-date v-model="fecha" range />
            </div>
          </template>
        </Expansion>
      </div>
    </template>
  </Dialog>

  <!-- MODAL INGREDIENTES -->
  <Dialog
    v-model="dialog.isAddIngredients"
    title="Agregar ingredientes"
    card-big
  >
    <template #inputsDialog>
      <div class="flex gap-2 justify-center">
        <q-select
          filled
          dense
          color="primary"
          v-model="oferta.ingredientes[0].nombre"
          label="Seleccionar producto"
          option-label="name"
          emit-value
          use-input
          input-debounce="0"
          hide-selected
          fill-input
          onfocus="this.select()"
        >
          <!-- <template v-slot:append>
            <q-icon
              style="margin: 0"
              name="close"
              @click.stop.prevent="oferta.ingredientes[0].nombre = ''"
              class="cursor-pointer q-mr-md"
            />
          </template> -->
          <template v-slot:prepend>
            <q-icon name="bi-cart-plus" />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No hay resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-input
          class="w-[140px]"
          dense
          filled
          v-model="oferta.ingredientes[0].precio"
          type="number"
          label="Precio adicional"
          onfocus="this.select()"
        />
      </div>
      <div class="flex justify-around my-[12px]">
        <q-checkbox v-model="itemProducto" label="Item producto" dense />
        <q-checkbox v-model="itemEleccion" label="Item eleccion" dense />
        <q-btn color="primary" label="Agregar" no-caps />
      </div>
      <!-- TABLA -->
      <table class="table">
        <thead>
          <tr>
            <th>Producto</th>
            <th style="width: 150px">Precio Adc.</th>
            <th style="width: 20px">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ingrediente, index) in oferta.ingredientes" :key="index">
            <td>
              <q-input
                v-model="ingrediente.nombre"
                filled
                dense
                emit-value
                label="Nombre"
                onfocus="this.select()"
              />
            </td>
            <td>
              <q-input
                v-model.number="ingrediente.precio"
                filled
                dense
                type="number"
                onfocus="this.select()"
              />
            </td>
            <td>
              <q-btn icon="delete" flat round color="red" dense size="12px" />
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { Catalogos } from '@/mocks/data.json';
import { columnsOfertas } from '@/helpers/columns';
import { ref } from 'vue';
console.log(Catalogos[0].items);

const test = ref(false);
const oferta = ref({
  nombre: '',
  descripcion: '',
  tags: [],
  grupos: [],
  ingredientes: [
    {
      nombre: '',
      precio: 0
    }
  ],
  condiciones: []
});
const fecha = ref(null);
const itemProducto = ref(false);
const itemEleccion = ref(false);

const dialog = ref({
  isAddConditions: false,
  isAddIngredients: false
});

const tags = ['empanadas', 'Masas', 'Embutidos', 'pedazos'];
</script>
<style scoped>
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
</style>
