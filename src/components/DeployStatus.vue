<template>
  <div
    class="deploy"
    v-if="$config.public.DeployStatus !== 'MAIN'"
    :id="$config.public.DeployStatus"
  >
    {{ $config.public.DeployStatus }}, API = {{ $config.public.GQL_HOST }}
  </div>
</template>

<style scoped>
#LOCAL {
  background: darkmagenta;
}
#MAIN {
  display: none;
}
#DEV {
  background: darkblue;
}
.deploy {
  padding: 0;
  color: white;
  font-style: bold;
  font-size: 17px;
}
</style>
