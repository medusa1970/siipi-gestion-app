<template>
  <div
    class="deploy"
    v-if="$config.public.DeployStatus !== 'PROD'"
    :id="$config.public.DeployStatus"
  >
    !!! --- {{ $config.public.DeployStatus }} --- API =
    {{ $config.public.GQL_HOST }} --- !!!
  </div>
</template>

<style scoped>
#LOCAL {
  background: darkmagenta;
}
#PROD {
  display: none;
}
#DEV {
  background: darkblue;
}
.deploy {
  color: white;
  font-style: bold;
  font-size: 17px;
  text-align: center;
}
</style>
