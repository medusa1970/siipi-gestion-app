<template>
  <q-table
    :rows="rows"
    :columns="columns"
    bordered
    style="box-shadow: none; border-radius: 0"
    :filter="filter"
    grid
    flat
    :rows-per-page-options="[24, 48]"
  >
    <!-- HEADER -->
    <template v-slot:top="props">
      <div class="w-full grid grid-cols-8 mb-3">
        <div class="col-span-2">
          <slot name="slot-header1" />
        </div>
        <div class="col-span-4 max-sm:col-span-8">
          <q-input
            v-if="$q.platform.is.desktop"
            borderless
            dense
            debounce="300"
            color="secondary"
            v-model="filter"
            style="padding: 0 10px"
            placeholder="Buscar"
            clearable
            class="w-search border-[1px] rounded-sm border-[#010f1a] hover:shadow-[0_0_5px_#010f1a]"
          >
            <template v-slot:prepend>
              <q-icon name="search" size="22px" class="text-[#010f1a]" />
            </template>
          </q-input>
        </div>
        <div class="col-span-2 flex justify-center">
          <slot name="slot-header2" />
        </div>
        <div class="col-span-8 mt-3">
          <slot name="slot-footer" />
        </div>
      </div>
    </template>

    <!-- Search -->
    <!-- <template v-slot:top-right="props">
      <q-input
        v-if="$q.platform.is.desktop"
        borderless
        dense
        debounce="300"
        color="secondary"
        v-model="filter"
        style="
          margin: 10px 0;
          border: 0.5px solid #757575;
          padding: 0 10px;
          width: 220px;
        "
        placeholder="Buscar"
        clearable
      >
        <template v-slot:prepend>
          <q-icon name="search" size="22px" />
        </template>
      </q-input>

      <q-btn
        flat
        round
        dense
        :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
        @click="props.toggleFullscreen"
      />
    </template> -->
    <!-- Add -->
    <!-- <template v-slot:top-left>
      <q-btn
        color="orange"
        label="nueva tablaaaa"
        no-caps
        style="padding: 9px 18px"
      />
    </template> -->
    <!-- Actions -->
    <template v-slot:item="props">
      <slot name="body-data" :props="props"></slot>
    </template>
  </q-table>
</template>
<script setup>
import { ref } from 'vue';
//@ts-ignore
definePageMeta({
  layout: 'cathering',
});

import productos from '@/mocks/productos.json';

// console.log(productos);

const filter = ref('');
defineProps({
  rows: {
    type: Array,
    required: true,
  },
  columns: Array,
});
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
  padding-right: 8px;
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
// .q-table__grid-content .row > div {
//   // border-radius: 30px;
// }
.w-expansion > div > div > div:nth-child(2) {
  // background: red;
  width: 65px;
  // border: 1px solid black;
}
// .w-expansion > div > div > div:nth-child(4) {
//   // background: red;
//   // width: 70px;
//   // border: 1px solid black;
// }
.w-expansion > div > div {
  // background: green;
  display: grid;
  grid-template-columns: 50px 1fr 60px;
}
// .w-expansion > div > div > div:nth-child(3) {
//   // background: red;
//   width: auto;
//   border: 1px solid black;
// }

// .q-table__grid-content > div {
//   background: red;
//   grid-column: span 1 / span 1;
// }
.q-badge {
  border-radius: 0px;
}

.w-search:hover {
  // box-shadow: 0 0 10px rgb(0 153 255/0.3);
  border: 1px solid transparent;
}
</style>
