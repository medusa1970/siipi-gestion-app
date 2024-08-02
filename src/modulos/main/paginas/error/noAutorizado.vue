<template>
  <NuxtLayout name="error">
    <div>
      <div class="text-4xl">No tiene el permiso</div>
      <button class="font-bold button" @click="goBack">Back</button>
    </div>
  </NuxtLayout>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.go(-2);
    },
  },
};
</script>

<style scoped>
.button {
  padding: 4px 6px;
  margin: 10px 0px;
  background: black;
  color: white;
}
</style>
