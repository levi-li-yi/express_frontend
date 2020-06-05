<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <!-- <Openlayers/> -->
    <!-- <Openlayers1/> -->
    <!-- <Openlayers2/> -->
    <Animation/>
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
// import Openlayers from './components/Openlayers.vue'
// import Openlayers1 from './components/Openlayers1.vue'
// import Openlayers2 from './components/Openlayers2.vue'
import Animation from './components/Animation.vue'


export default {
  name: 'App',
  components: {
    //HelloWorld,
    // Openlayers,
    // Openlayers1
    // Openlayers2
    Animation
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
