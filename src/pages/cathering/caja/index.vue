<template>
  <Navigation label="Caja" icon="group" />
  <!-- <h1>CAJITA</h1> -->

  <!-- TABLEEXPANDED -->
  <TableExpand :rows="productos">
    <template #body-data="{ props }">
      <div class="col-span-1">
        <q-list class="shadow-1">
          <q-expansion-item
            switch-toggle-side
            expand-separator
            group="somegroup"
            :label="`Nombre: ${props.row.nombre}`"
            class="w-expansion [&>div>div>div>i]:bg-orange-400 [&>div>div>div>i]:rounded-full [&>div>div>div>i]:text-white"
          >
            <template v-slot:header>
              <div class="flex items-center justify-center w-full">
                <div class="flex flex-row w-[150px]">
                  <h1 class="font-bold w-[65px]">Nombre</h1>
                  <p>{{ props.row.nombre }}</p>
                </div>
              </div>
              <q-item-section side class="h-[50px] w-[65px]">
                <q-img
                  :src="props.row.imagen"
                  class="object-cover h-[50px] w-[65px]"
                />
              </q-item-section>
            </template>
            <q-card
              style="border-radius: 30px;!important"
              class="pb-3 mt-[-9px] flex justify-center"
            >
              <div
                class="flex flex-col gap-2 [&>span]:flex [&>span>h1]:w-[65px] [&>span>h1]:font-bold"
              >
                <span>
                  <h1>Precio</h1>
                  <p>{{ props.row.precio }}</p>
                  8
                </span>
                <span>
                  <h1>cantidad</h1>
                  <p>{{ props.row.cantidad }}</p>
                </span>
                <span>
                  <h1>Accion</h1>
                  <span class="flex gap-1">
                    <q-btn
                      color="primary"
                      icon="edit"
                      round
                      dense
                      padding="5px"
                      size="9px"
                    />
                    <q-btn
                      color="red"
                      icon="delete"
                      round
                      dense
                      padding="5px"
                      size="9px"
                    />
                  </span>
                </span>
              </div>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
    </template>
  </TableExpand>
</template>
<script setup lang="ts">
import { ref } from 'vue';
//@ts-ignore
definePageMeta({
  layout: 'cathering',
});

import productos from '@/mocks/productos.json';

console.log(productos);

const filter = ref('');
</script>

<style lang="scss">
.cardComp {
  border-radius: 0;
  width: 200px;
  // background-image: linear-gradient(
  //   76.3deg,
  //   rgba(44, 62, 78, 1) 10.6%,
  //   rgba(69, 103, 131, 1) 82.8%
  // );
  background-position: center;
  background-repeat: no-repeat;
}
.point-details {
  color: #999999;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.textDesc {
  text-align: justify;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.25rem;
  height: 4rem;
}
.textDesc::first-letter {
  text-transform: capitalize;
}
// TABLAAAAA EXPANSIVA
.q-item {
  min-height: 48px;
  padding: 0px 10px;
  // border: 1px solid red;
  // display: flex;
  // justify-content: space-between;
}
.q-item__section--avatar {
  color: inherit;
  min-width: 0px;
  // width: 100px;

  // margin-right: 10px;
  // background: red;

  // .q-icon {
  //   border: 1px solid red;
  //   border-radius: 100%;
  //   background-color: orange;
  //   color: white;
  // }
}
.q-item__section--side {
  color: #757575;
  align-items: flex-start;
  padding-right: 0px;
  width: auto;
  min-width: 0;
  // max-width: 100%;
  // border: 2px solid green;
}

.q-table__grid-content {
  // border: 1px solid blue;
  padding: 0 1rem;
  // display: flex;
  // gap: 15px;
  // justify-content: center;
  // flex-wrap: wrap;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(255px, 1fr));
}
.q-table__grid-content .row > div {
  // border-radius: 30px;
}
.w-expansion > div > div > div:nth-child(2) {
  // background: red;
  width: 65px;
}

// .q-table__grid-content > div {
//   background: red;
//   grid-column: span 1 / span 1;
// }
</style>
