<template>
  <div></div>
</template>

<script setup>
const productos = await postDataGql(
  GqlBuscarProductos({
    opciones: {
      populate: true,
      sort: '-_modificado -_creado',
    },
  }),
);
console.log(productos);
</script>

<style lang="scss" scoped></style>
