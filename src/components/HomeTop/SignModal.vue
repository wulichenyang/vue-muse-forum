<template>
  <div class="sign-modal">
    <!-- 模态框 -->
    <mu-dialog
      :title="isSignUp? '注册' : '登录'"
      width="600"
      max-width="80%"
      :open.sync="openFlag"
    >
      <!-- 邮箱或手机 -->
      <mu-tabs
        :value.sync="signInBy"
        inverse
        color="primary"
        text-color="rgba(0, 0, 0, .54)"
      >
        <mu-tab>手机</mu-tab>
        <mu-tab>邮箱</mu-tab>
      </mu-tabs>
      <!-- 登录注册表单 -->
      <mu-form
        ref="form"
        :model="validateForm"
        class="mu-demo-form"
        @keydown.enter="onSubmitKeyDown"
      >
        <!-- 昵称 -->
        <mu-form-item
          v-if="isSignUp"
          label="昵称"
          prop="nickname"
          :rules="nicknameRules"
          icon="account_circle"
        >
          <mu-text-field
            v-model="validateForm.nickname"
            prop="nickname"
          ></mu-text-field>
        </mu-form-item>
        <!-- 账号 -->
        <mu-form-item
          v-if="signInBy === 0"
          label="手机"
          prop="phone"
          :rules="phoneRules"
          icon="stay_current_portrait"
        >
          <mu-text-field
            v-model="validateForm.phone"
            prop="phone"
          ></mu-text-field>
        </mu-form-item>
        <mu-form-item
          v-if="signInBy === 1"
          label="邮箱"
          prop="email"
          :rules="emailRules"
          icon="mail_outline"
        >
          <mu-text-field
            v-model="validateForm.email"
            prop="email"
          ></mu-text-field>
        </mu-form-item>
        <!-- 密码 -->
        <mu-form-item
          label="密码"
          icon="lock"
          prop="password"
          :rules="passwordRules"
        >
          <mu-text-field
            type="password"
            v-model="validateForm.password"
            prop="password"
          ></mu-text-field>
        </mu-form-item>
        <!-- 提交按钮 -->
        <mu-form-item class="submit-button-wrapper">
          <mu-button
            color="secondary"
            @click="closeAlertDialog"
          >取消</mu-button>
          <mu-button
            v-loading="submitting"
            color="primary"
            @click="submitSignForm"
          >{{isSignUp? '注册' : '登录'}}</mu-button>
        </mu-form-item>
      </mu-form>

    </mu-dialog>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Watch,
  Emit,
  Model
} from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import { SignType } from "@/assets/js/dataType";
import { ByType, SignInUser, SignUpUser } from "@/api/user";
import {
  nicknameRules,
  phoneRules,
  emailRules,
  passwordRules
} from "@/utils/validate";

@Component({
  components: {}
})
export default class SignModal extends Vue {
  // Props
  @Prop({
    type: Boolean,
    default: false,
    required: true
  })
  openAlert!: boolean;

  // 提交中标志
  @Prop({
    type: Boolean,
    default: false,
    required: true
  })
  submitting!: boolean;

  @Model("onIsSignUpChange", {
    type: Boolean
  })
  isSignUp!: boolean;

  @Model("onIsSignInChange", {
    type: Boolean
  })
  isSignIn!: boolean;

  // Data
  openFlag: boolean = false;
  signInBy: number = 0; // 0: phone，1: email

  // 验证表单正则
  nicknameRules: any = nicknameRules;
  phoneRules: any = phoneRules;
  emailRules: any = emailRules;
  passwordRules: any = passwordRules;

  // 表单数据
  validateForm: any = {
    nickname: "",
    phone: "",
    email: "",
    password: "",
    isAgree: false
  };

  // Computed
  // get computedData() {
  //   return ' cc' + this.searchValue;
  // }

  // Lifecycle
  private mounted() {}

  // Methods

  closeAlertDialog() {
    this.onOpenAlertChange();
    this.onIsSignUpChange();
    this.onIsSignInChange();
  }

  onOpenAlertChange() {
    this.$emit("onOpenAlertChange", false);
  }

  onIsSignUpChange() {
    this.$emit("onIsSignUpChange", false);
  }

  onIsSignInChange() {
    this.$emit("onIsSignInChange", false);
  }

  onSubmitKeyDown(e: any): void {
    // Enter键按下
    this.submitSignForm();
  }

  clearForm() {
    (this.$refs.form as any).clear();
    this.validateForm = {
      nickname: "",
      phone: "",
      email: "",
      password: "",
      isAgree: false
    };
  }
  // 确认模态框
  async submitSignForm() {
    // 已经提交了请求就不继续发送
    if (this.submitting) {
      return;
    }
    let isCheckOk = await (this.$refs.form as any).validate();
    console.log("form valid: ", isCheckOk);
    // 通过字段格式检验
    let by: ByType = this.signInBy === 0 ? ByType.PHONE : ByType.EMAIL;
    if (isCheckOk) {
      if (this.isSignUp) {
        // 注册
        this.emitSign(SignType.SIGNUP, by, {
          phone: this.validateForm.phone,
          email: this.validateForm.email,
          nickname: this.validateForm.nickname,
          password: this.validateForm.password
        });
      } else {
        // 登录
        this.emitSign(SignType.SIGNIN, by, {
          phone: this.validateForm.phone,
          email: this.validateForm.email,
          password: this.validateForm.password
        });
      }
    }
  }

  // @Getter("userDetail") userDetail!: UserDetail | null;

  // @Action("getUser") getUser: any;

  @Emit("emitSign")
  emitSign(
    signType: SignType,
    signBy: ByType,
    formData: SignUpUser | SignInUser
  ) {}

  // 子组件
  @Watch("openFlag", { immediate: true })
  onOpenFlagChanged(val: boolean, oldVal: boolean) {
    // 更新父组件
    if (val === false) {
      this.onOpenAlertChange();
      this.closeAlertDialog();
    }
  }

  // 父组件
  @Watch("openAlert", { immediate: true })
  onOpenAlertChanged(val: boolean, oldVal: boolean) {
    // 更新子组件
    this.openFlag = val;
  }
}
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.sign-modal {
  display: none;
}
.mu-tabs-inverse {
  display: flex;
  background: transparent !important;
  .mu-tab {
    flex: 1;
  }
}
</style>
