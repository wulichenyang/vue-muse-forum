
<template>
  <header class="home-top">
    <section class="logo-left">
      <!-- logo图标 -->
      <Logo />
    </section>
    <section class="home-top-right">
      <!-- 搜索框 -->
      <SearchBar
        placeholder="搜索"
        @emitOnSearch="onSearchPost"
      />
      <!-- 登录注册 -->
      <SignPortal
        :ifShow="ifShowSignPortal"
        @emitAlertSignIn="onAlertSignIn"
        @emitAlertSignUp="onAlertSignUp"
      />
      <!-- 用户选项 -->
      <UserOption :ifShow="ifShowUserOption" />
    </section>
    <!-- 登录注册模态框 -->
    <SignModal
      :openAlert="openAlert"
      :isSignIn="isSignIn"
      :isSignUp="isSignUp"
      @onOpenAlertChange="(val)=>{this.openAlert = val}"
      @onIsSignUpChange="(val)=>{this.isSignUp = val}"
      @onIsSignInChange="(val)=>{this.isSignIn = val}"
      @emitSign="onSign"
    />
    <!-- {{userDetail}}
    {{isLogin}}-->
  </header>
</template>


<script lang="ts">
import { Component, Vue, Model } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import Logo from "@/components/HomeTop/Logo.vue";
import SearchBar from "@/components/HomeTop/SearchBar.vue";
import SignPortal from "@/components/HomeTop/SignPortal.vue";
import SignModal from "@/components/HomeTop/SignModal.vue";
import UserOption from "@/components/HomeTop/UserOption.vue";
import { UserDetail } from "@/assets/js/dataType";
@Component({
  components: {
    Logo,
    SearchBar,
    SignPortal,
    SignModal,
    UserOption
  }
})
export default class HomeTop extends Vue {
  @Getter("userDetail") userDetail!: UserDetail | null;
  @Getter("isLogin") isLogin!: boolean;

  // Data
  openAlert: boolean = false;
  isSignUp: boolean = false;
  isSignIn: boolean = false;

  // Computed
  get ifShowSignPortal(): boolean {
    if (this.isLogin) {
      return false;
    }
    return true;
  }

  get ifShowUserOption(): boolean {
    if (this.isLogin) {
      return true;
    }
    return false;
  }
  // Lifecycle
  mounted() {}

  // Methods // TODO
  onSearchPost(key: string) {
    console.log(key);
  }

  openAlertDialog() {
    this.openAlert = true;
  }

  onAlertSignUp() {
    console.log("signup");
    this.openAlertDialog();
    this.isSignUp = true;
  }

  onAlertSignIn() {
    console.log("signin");
    this.openAlertDialog();
    this.isSignIn = true;
  }

  // 提交注册、登录表单
  onSign(isSignUp: boolean) {
    if (isSignUp) {
      console.log("注册中");
    } else {
      console.log("登录中");
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/css/var.scss";

.home-top {
  height: $homeTopHeight;
  background-color: $mainContainerBgColor;
  display: flex;
  justify-content: space-between;
  box-shadow: $topHeaderShadowColor;
  .top-left {
    display: flex;
    align-items: center;
  }
  .home-top-right {
    display: flex;
    align-items: center;
  }
}
</style>