<template>
  <div class="deploy" :id="$config.public.DeployStatus">
    {{ $config.public.DeployStatus }}
  </div>
</template>

<style scoped>
#LOCAL {
  background: green;
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
