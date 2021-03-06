
<template>
  <header :class="blur ? 'home-top blur' : 'home-top'">
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
      <UserOption
        :userDetail="userDetail"
        :ifShow="ifShowUserOption"
      />
    </section>
    <!-- 登录注册模态框 -->
    <SignModal
      ref="signModalRef"
      :openAlert="openAlert"
      :isSignIn="isSignIn"
      :isSignUp="isSignUp"
      :submitting="submitting"
      @onOpenAlertChange="(val)=>{this.openAlert = val}"
      @onIsSignUpChange="(val)=>{this.isSignUp = val}"
      @onIsSignInChange="(val)=>{this.isSignIn = val}"
      @emitSign="onSign"
    />
  </header>
</template>


<script lang="ts">
import { Component, Vue, Model, Watch, Mixins } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import Logo from "@/components/HomeTop/Logo.vue";
import SearchBar from "@/components/HomeTop/SearchBar.vue";
import SignPortal from "@/components/HomeTop/SignPortal.vue";
import SignModal from "@/components/HomeTop/SignModal.vue";
import UserOption from "@/components/HomeTop/UserOption.vue";
import { getScrollTop } from "@/utils/scroll";
import {
  signUp,
  signIn,
  fetchPublicKey,
  SignUpUser,
  SignInUser
} from "@/api/user";
import { encryptPwd } from "@/utils/rsa";
import To from "@/utils/to";
import { SignType } from "@/assets/js/dataType";
import Toast from "muse-ui-toast";
import { ByType } from "@/api/user";
import cookie from "@/utils/cookie";
import { access_token } from "@/config";
import UserDetailMixin from '@/mixins/UserDetailMixin.vue'

@Component({
  components: {
    Logo,
    SearchBar,
    SignPortal,
    SignModal,
    UserOption
  }
})
export default class HomeTop extends Mixins(UserDetailMixin) {
  @Getter("isLogin") isLogin!: boolean;
  @Getter("openLoginDialog") openLoginDialog!: boolean;

  @Action("closeLoginDialog") closeLoginDialog: any;

  // 监听全局Vuex提示登录框
  @Watch("openLoginDialog", { immediate: true })
  onLoginDialogOpen(val: boolean, oldVal: boolean) {
    if (val === true) {
      this.onAlertSignIn();
    }
  }

  // 监听关闭提示登录框，更新到Vuex
  @Watch("openAlert", { immediate: true })
  onLoginDialogClose(val: boolean, oldVal: boolean) {
    if (val === false) {
      this.closeLoginDialog();
    }
  }

  // Data
  // 模态框
  openAlert: boolean = false;
  // 注册标志
  isSignUp: boolean = false;
  // 登录标志
  isSignIn: boolean = false;
  // 提交状态标志
  submitting: boolean = false;
  // header是否透明
  blur: boolean = false;

  // Computed
  get ifShowSignPortal(): boolean {
    if (this.isLogin) {
      return false;
    } else if (this.isLogin === null) {
      return false;
    }
    return true;
  }

  get ifShowUserOption(): boolean {
    if (this.isLogin) {
      return true;
    } else if (this.isLogin === null) {
      return false;
    }
    return false;
  }
  // Lifecycle
  private mounted() {
    window.addEventListener("scroll", this.scrollFn);
  }

  destroyed() {
    window.removeEventListener("scroll", this.scrollFn);
  }

  // Methods
  // 监听滚动，设置header透明
  scrollFn() {
    if (getScrollTop() > 150) {
      this.blur = true;
    } else {
      this.blur = false;
    }
  }

  setCookie(token: string) {
    // TODO: 修改为：多账号同时登录token保存
    // 移除之前的账号token信息
    if (cookie.getCookie(access_token) !== "") {
      cookie.removeCookie(access_token);
    }
    cookie.setCookie(access_token, token, 24 * 30); // 30 天
  }

  onSearchPost(key: string) {
    console.log(key);
    this.$router.push({
      name: 'search',
      query: {
        key : key
      }
    })
  }

  openAlertDialog() {
    this.openAlert = true;
  }

  closeAlertDialog() {
    this.openAlert = false;
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

  clearForm() {
    (this.$refs.signModalRef as any).clearForm();
  }

  // 提交注册、登录表单
  async onSign(
    signType: SignType,
    by: ByType,
    formData: SignUpUser | SignInUser
  ) {
    // 开启提交标志
    this.submitting = true;

    let err, pubKeyRes;
    // 获取公钥
    [err, pubKeyRes] = await To(fetchPublicKey());

    // 获取失败
    if (err) {
      // 关闭提交标志
      this.submitting = false;
      return;
    }

    // 获取pubKey成功，开始注册、登录
    if (pubKeyRes && pubKeyRes.code === 0) {
      // 用公钥加密密码
      let encryptedPwd = encryptPwd(
        formData.password,
        pubKeyRes.data.publicKey
      );
      formData.password = encryptedPwd;

      if (signType === SignType.SIGNUP) {
        console.log("注册中" + by);

        // 注册
        let signUpRes;
        [err, signUpRes] = await To(
          signUp(by, {
            [by]: formData[by],
            nickname: (formData as SignUpUser).nickname,
            password: formData.password
          })
        );

        // 注册错误
        if (err) {
          // 关闭提交标志
          this.submitting = false;
          return;
        }

        // 注册成功，显示成功信息
        if (signUpRes && signUpRes.code === 0) {
          // 关闭提交标志
          this.submitting = false;
          // 清除表单
          this.clearForm();
          this.closeAlertDialog();
          Toast.message("注册成功，请登录");
          return;
        }
      } else if (signType === SignType.SIGNIN) {
        console.log("登录中" + by);

        // 登录
        let signInRes;
        [err, signInRes] = await To(
          signIn(by, {
            [by]: formData[by],
            password: formData.password
          })
        );

        // 登录错误
        if (err) {
          // 关闭提交标志
          this.submitting = false;
          return;
        }

        // 登录成功，设置cookie保存token，请求用户信息？TODO:
        if (signInRes && signInRes.code === 0) {
          // 关闭提交标志
          this.submitting = false;
          // 清除表单
          this.clearForm();
          // 设置token到cookie中
          this.setCookie(signInRes.data.token);
          this.closeAlertDialog();
          // 重新刷新
          window.location.reload();
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/css/var.scss";

.home-top {
  top: 0;
  position: fixed;
  width: 100%;
  height: $homeTopHeight;
  background-color: $mainContainerBgColor;
  display: flex;
  justify-content: space-between;
  box-shadow: $topHeaderShadowColor;
  z-index: 999;
  transition: ease 0.4s background-color;
  &.blur {
    transition: ease 0.4s background-color;
    background: transparent;
    .search-bar {
      background: transparent;
    }
  }
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