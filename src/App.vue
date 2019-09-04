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
import { UserDetail } from "@/assets/js/dataType";
import cookie from "@/utils/cookie";
import { access_token } from "@/config";

@Component({
  components: { HomeTop }
})
export default class App extends Vue {
  @Getter("userDetail") userDetail!: UserDetail | null;
  @Action("getUser") getUser: any;
  mounted() {
    // 已登录，请求用户数据
    if (!this.userDetail && cookie.getCookie(access_token)) {
      this.getUser();
    }
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
