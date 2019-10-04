<template>
  <div id="app">
    <HomeTop />
    <main class="main-wrapper">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import HomeTop from "@/components/HomeTop/HomeTop.vue";
import { Component, Vue } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import { UserDetail } from "@/assets/js/dataType";
import cookie from "@/utils/cookie";
import { access_token } from "@/config";
import { museThemeConfig } from "@/config/index";

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
@import "./assets/css/common.scss";
/*icon字体路径变量*/
$--font-path: "~element-ui/lib/theme-chalk/fonts";
/*按需引入用到的element-ui组件的scss文件和基础scss文件*/
@import "~element-ui/packages/theme-chalk/src/base.scss";
@import "~element-ui/packages/theme-chalk/src/upload.scss";

#app {
  // 知乎字体
  font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC,
    Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  .main-wrapper {
    background: linear-gradient(transparent, $mainWrapperBlurPink);
    box-sizing: border-box;
    // Phone
    padding: 10px 0;
    margin-top: $homeTopHeight;
    min-height: calc(100vh - #{$homeTopHeight});
  }

  @media screen and (min-width: 576px) {
    .main-wrapper {
    background: $mainBodyBgColor;

      padding: 18px 10px;
    }
  }

  @media screen and (min-width: 768px) {
    .main-wrapper {
      padding: $mainPadding;
    }
  }
}
</style>
