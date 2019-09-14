<template>
  <div id="app">
    <HomeTop />
    <router-view />
  </div>
</template>

<script lang="ts">
import HomeTop from "@/components/HomeTop/HomeTop.vue";
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
@import "./assets/css/normalize.css";
@import "./assets/css/var.scss";
// 解决移动端无法正常显示icon问题


body, html {
  min-height: 100%;
  background: $mainBodyBgColor;
}
#app {
  // 知乎字体
  font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: $mainBodyBgColor;
  a {
    color: $linkFontColor;
  }
}
</style>
