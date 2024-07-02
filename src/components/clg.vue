<template>
  <pre class="border-2 border-black bg-blue-200 mb-5 mt-5 p-5"
    >{{ t }} = {{ d(v) }}
</pre
  >
</template>

<script setup>
defineProps({
  t: { type: String, default: 'valor' },
  v: Object,
});

const d = (v) => {
  switch (v) {
    case undefined:
      return '(undefined)';
    case null:
      return '(null)';
    case '':
      return '(empty string)';
    default:
      return v;
  }
};
</script>

<style lang="scss" scoped></style>
