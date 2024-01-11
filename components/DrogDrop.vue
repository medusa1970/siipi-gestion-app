<template>
  <draggable
    tag="ul"
    :list="lista"
    class="flex gap-4 mt-4"
    handle=".handle"
    :item-key="itemKey"
  >
    <template #item="{ element }">
      <li class="flex items-center">
        <q-icon
          name="drag_indicator"
          class="handle cursor-move text-gray-600"
          size="20px"
        />

        <div
          class="bg-[#1976D2] px-2 py-[1px] rounded-sm text-white flex items-center justify-center gap-1"
        >
          <span class="mr-1">{{ element[itemKey] }}</span>

          <!-- <q-icon name="edit" round /> -->
          <!-- <template v-slot:body-actions="props">
            <slot name="actions" :props="element"></slot>
          </template> -->
          <q-btn
            color="white"
            icon="edit"
            round
            dense
            text-color="primary"
            size="8px"
            @click="editar(element)"
          />
          <q-btn
            color="white"
            icon="delete"
            round
            dense
            text-color="primary"
            size="8px"
            @click="eliminar(element)"
          />
        </div>
      </li>
    </template>
  </draggable>
</template>

<script setup>
import draggable from 'vuedraggable';

defineProps({
  lista: {
    type: Array,
    required: true,
  },
  eliminar: Function,
  editar: Function,
  itemKey: String,
});

const emit = defineEmits(['delete', 'edit']);

const eliminar = (element) => {
  emit('delete', element);
};

const editar = (element) => {
  emit('edit', element);
};
</script>
