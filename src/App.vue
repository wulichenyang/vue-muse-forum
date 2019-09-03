<template>
  <div id="app">
    <HomeTop />
    <router-view />
  </div>
</template>


<script lang="ts">
import HomeTop from "@/components/HomeTop.vue";
import { Component, Vue } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";

@Component({
  components: { HomeTop }
})
export default class App extends Vue {
  @Action("getUser") getUser: any;
  mounted() {
    this.getUser();
  }
}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
