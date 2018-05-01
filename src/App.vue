<template>
  <div id="app">
    <NavBar/>
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from './components/NavBar'

export default {
  name: 'app',
  components: {
    NavBar
  },
  data () {
    return {
      store: { // dummy store
        residences: [],
        jsons: require('./entities/files.json')
      }
    }
  }
}
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
/* .header {
  margin: 0;
  padding: 0 16px 0 24px;
  border-bottom:1px solid #999;
  justify-content: space-between;
  display: flex;
} */
</style>
