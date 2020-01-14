<template>
  <section class="user-setting-password">
    <h2>修改密码</h2>
    <!-- 修改密码表单 -->
    <mu-form
      ref="form"
      :model="form"
      class="mu-demo-form"
      label-position="top"
      label-width="100"
    >

      <!-- 旧密码 -->
      <mu-form-item
        prop="oldPassword"
        label="旧密码"
        :rules="passwordRules"
      >
        <mu-text-field
          type="password"
          prop="oldPassword"
          v-model="form.oldPassword"
          :min-length="4"
          :max-length="17"
        ></mu-text-field>
      </mu-form-item>

      <!-- 新密码 -->
      <mu-form-item
        prop="newPassword"
        label="新密码"
        :rules="passwordRules"
      >
        <mu-text-field
          type="password"
          prop="newPassword"
          v-model="form.newPassword"
          :min-length="4"
          :max-length="17"
        ></mu-text-field>
      </mu-form-item>

      <!-- 确认新密码 -->
      <mu-form-item
        prop="confirmPassword"
        label="确认新密码"
        :rules="passwordRules"
      >
        <mu-text-field
          type="password"
          prop="confirmPassword"
          v-model="form.confirmPassword"
          :min-length="4"
          :max-length="17"
        ></mu-text-field>
      </mu-form-item>

      <!-- 修改按钮 -->
      <mu-button
        class="save-setting"
        v-loading="submitting"
        @click="modifyPwd"
        color="primary"
      >修改密码</mu-button>
    </mu-form>
  </section>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Emit,
  Model,
  Watch
} from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import {} from "@/assets/js/dataType";
import { passwordRules } from "@/utils/validate";
import Toast from "muse-ui-toast";
import { UpdateUserPwdPayload, updateUserPassword } from "@/api/user";
import To from "@/utils/to";
import { encryptPwd } from "@/utils/rsa";
import { fetchPublicKey } from "@/api/user";
@Component({
  components: {}
})
export default class UserSettingPassword extends Vue {
  // Props
  // @Prop({
  //   type: String,
  //   default: "",
  //   required: true,
  // })
  // list!: string;

  // @Model("onChange", {
  //   type: String
  // })
  // searchKey!: string;

  // Data
  // 验证表单正则
  passwordRules: any = passwordRules;

  // 提交状态标志
  submitting: boolean = false;

  // 表单数据
  form: any = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  };
  // Computed
  // get computedData() {
  //   return ' cc' + this.searchValue;
  // }

  // Lifecycle
  private mounted() {}

  // Methods
  // Methods
  clearForm() {
    this.form = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    };
  }
  async modifyPwd() {
    // 已经提交了请求就不继续发送
    if (this.submitting) {
      return;
    }

    let isCheckOk = await (this.$refs.form as any).validate();

    let isEqualPwd: boolean =
      this.form.newPassword === this.form.confirmPassword;

    if (!isEqualPwd) {
      Toast.message("两次输入的新密码不同");
      return;
    }

    if (isCheckOk && isEqualPwd) {
      // 开启提交中标志，设置暂时已提交状态
      this.submitting = true;

      // 获取公钥
      let keyErr, pubKeyRes;
      [keyErr, pubKeyRes] = await To(fetchPublicKey());

      // 获取失败
      if (keyErr) {
        // 关闭提交标志
        this.submitting = false;
        return;
      }

      // 获取pubKey成功，开始注册、登录
      if (pubKeyRes && pubKeyRes.code === 0) {
        // 用公钥加密密码
        let userPwdPayload: UpdateUserPwdPayload;
        userPwdPayload = {
          oldPassword: encryptPwd(
            this.form.oldPassword,
            pubKeyRes.data.publicKey
          ),
          newPassword: encryptPwd(
            this.form.newPassword,
            pubKeyRes.data.publicKey
          )
        };

        // 修改分类
        let err, res;
        [err, res] = await To(updateUserPassword(userPwdPayload));

        // 修改失败
        if (err) {
          // 关闭提交中标志，设置未提交标志
          this.submitting = false;
          return;
        }

        // 修改成功，设置已提交显示成功信息，关闭提交中标志
        if (res && res.code === 0) {
          this.submitting = false;
          this.clearForm();
          Toast.message("修改成功");
        }
      }
    }
  }

  // // // @Getter("userDetail") userDetail!: UserDetail | null;

  // @Action("getUser") getUser: any;

  // @Emit("select")
  // select(listItem: Song, index: number) {}

  // @Watch("child", { immediate: true, deep: true })
  // onChildChanged(val: string, oldVal: string) {}
}
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.user-setting-password {
}

// @media screen and (min-width: 576px) {
//   .user-setting-password {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .user-setting-password {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .user-setting-password {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .user-setting-password {
//     max-width: 1024px;
//   }
// }
</style>
