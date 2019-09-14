
<template>
  <header class="home-top">
    <section class="logo-left">
      <Logo />
    </section>
    <section class="home-top-right">
      <SearchBar
        placeholder="搜索"
        @emitOnSearch="onSearchPost"
      />
      <SignPortal
        :ifShow="ifShowSignPortal"
        @emitAlertSignIn="onAlertSignIn"
        @emitAlertSignUp="onAlertSignUp"
      />
      <UserOption :ifShow="ifShowUserOption" />
    </section>

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
import UserOption from "@/components/HomeTop/UserOption.vue";
import { UserDetail } from "@/assets/js/dataType";
@Component({
  components: {
    Logo,
    SearchBar,
    SignPortal,
    UserOption
  }
})
export default class HomeTop extends Vue {
  @Getter("userDetail") userDetail!: UserDetail | null;
  @Getter("isLogin") isLogin!: boolean;

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

  onAlertSignUp() {
    console.log("signup");
  }

  onAlertSignIn() {
    console.log("signin");
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