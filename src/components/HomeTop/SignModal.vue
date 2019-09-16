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
        <mu-form-item
          @keydown="onSubmitKeyDown($event)"
          class="submit-button-wrapper"
        >
          <mu-button
            color="secondary"
            @click="closeAlertDialog"
          >取消</mu-button>
          <mu-button
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
  nicknameRules: any = [
    { validate: (val: string) => !!val, message: "必须填写昵称" },
    {
      validate: (val: string) => {
        return val.trim().length < 8;
      },
      message: "昵称长度不超过七个字符"
    }
  ];
  phoneRules: any = [
    { validate: (val: string) => !!val, message: "必须填写手机号" },
    {
      validate: (val: string) => {
        const phoneTest = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        return phoneTest.test(val.trim());
      },
      message: "手机号格式不正确"
    }
  ];
  emailRules: any = [
    { validate: (val: string) => !!val, message: "必须填写邮箱号" },
    {
      validate: (val: string) => {
        const emailTest = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        return emailTest.test(val.trim());
      },
      message: "邮箱号格式不正确"
    }
  ];
  passwordRules: any = [
    { validate: (val: string) => !!val, message: "必须填写密码" },
    {
      validate: (val: string) => val.length > 3 && val.length < 18,
      message: "密码长度大于3小于18"
    }
  ];

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
  mounted() {}

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
    if (e.keyCode === 13) {
      this.submitSignForm()
    }
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
