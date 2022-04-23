<template>
  <div id="app" class="capp">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
/*设置背景图片*/
.capp {
  background: url('./assets/BingWallpaper.png');
  width: 100%;
  position: fixed;
  background-size: 100% 100%;
}
</style>
