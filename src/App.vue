<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Countries</router-link>
      <router-link to="/map">Map</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color:rgb(238,238,238);
  /* position:fixed; */
  width:100%;
  height:100%;
  top:0px;
  left:0px;
}

#nav {
  padding: 30px;
  display:flex;
  justify-content: space-around;
  background-color: rgb(34,34,34);
  border-bottom: 1px solid rgb(64,64,64);
}

#nav a {
  font-weight: bold;
  color: #fff;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: #0bba6b;
  font-family: 'Comic Neue', cursive;
/* font-family: 'Spicy Rice', cursive; */
/* font-family: 'Hind Siliguri', sans-serif; */
/* font-family: 'Fredoka One', cursive; */
}
</style>
