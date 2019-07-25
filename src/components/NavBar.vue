<template>
  <div class="navbar">
    <ul>
      <li v-for="(json, index) in store.jsons" :key="index">
        <router-link :to="{ name: 'maps', params: { id: json.name }}" class="navbar navbar__button">
          {{ json.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  data () {
    return {
      store: this.$parent.store
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar {
  position:absolute;
  top:7px;
  right:30px;
  z-index:1000;
}
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
li {
  display: inline-block;
  padding: 0;
  margin: 0 5px;
}
.navbar__button {
  text-decoration:none;
  overflow: hidden;
  text-align: center;
  position: relative;
  color: rgb(86, 86, 86);
  font-family: Roboto, Arial, sans-serif;
  user-select: none;
  font-size: 11px;
  background-color: rgb(255, 255, 255);
  padding: 8px;
  border-bottom-right-radius: 2px;
  border-top-right-radius: 2px;
  background-clip: padding-box;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  min-width: 34px;
  border-left: 0px;
}

</style>
