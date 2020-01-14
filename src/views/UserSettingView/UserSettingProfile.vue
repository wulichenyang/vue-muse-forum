<template>
  <section class="user-setting-profile">
    <h2>个人资料</h2>

    <!-- 个人资料表单 -->
    <mu-form
      ref="form"
      :model="form"
      class="mu-demo-form"
      label-position="top"
      label-width="100"
    >

      <!-- 头像上传 -->
      <mu-form-item :label="form.avatar === '' ? '上传头像' : '更新头像'">
        <UploadPhoto
          v-model="form.avatar"
          :ifSubmit="ifSubmit"
          prefix="avatar"
        />
      </mu-form-item>

      <!-- 昵称 -->
      <mu-form-item
        prop="nickname"
        label="昵称"
        :rules="nicknameRules"
      >
        <mu-text-field
          prop="nickname"
          v-model="form.nickname"
          :max-length="7"
        ></mu-text-field>
      </mu-form-item>

      <!-- 个性签名 -->
      <mu-form-item
        prop="brief"
        label="个性签名"
        :rules="userBriefRules"
      >
        <mu-text-field
          prop="brief"
          multi-line
          :max-length="70"
          v-model="form.brief"
        ></mu-text-field>
      </mu-form-item>

      <!-- 生日 -->
      <mu-date-input
        color="primary"
        v-model="form.birth"
        label="出生日期"
        label-float
        full-width
        container="dialog"
      ></mu-date-input>

      <!-- 性别 -->
      <div class="select-control-group">
        <mu-flex
          class="select-control-row"
          :key="'radio ' + (i-1)"
          v-for="i in 3"
        >
          <mu-radio
            color="primary"
            :value="i-1"
            v-model="form.gender"
            :label="(i-1) === 1 ? '男' : (i-1) === 0 ? '女': '保密'"
          ></mu-radio>
        </mu-flex>
      </div>

      <!-- 保存按钮 -->
      <mu-button
        class="save-setting"
        v-loading="submitting"
        @click="saveUserSetting"
        color="primary"
      >保存</mu-button>
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
  Watch,
  Mixins
} from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import { UserSettingInfo } from "@/assets/js/dataType";
import { nicknameRules, userBriefRules } from "@/utils/validate";
import { UpdateUserSettingPayload } from "@/api/user";
import Toast from "muse-ui-toast";
import { updateUserSetting } from "@/api/user";
import To from "@/utils/to";
import UploadPhoto from "@/components/Upload/UploadPhoto.vue";
import UserDetailMixin from '@/mixins/UserDetailMixin.vue'

@Component({
  components: {
    UploadPhoto
  }
})
export default class UserSettingProfile extends Mixins(UserDetailMixin) {
  // Props
  // Props
  // @Prop({
  //   type: Object,
  //   default: {},
  //   required: true,
  // })
  // userSettingInfo!: UserSettingInfo;

  // @Model("onChange", {
  //   type: String
  // })
  // searchKey!: string;

  // Data
  // 验证表单正则
  nicknameRules: any = nicknameRules;
  userBriefRules: any = userBriefRules;

  // 是否已提交过表单
  ifSubmit: boolean = false;
  // 提交状态标志
  submitting: boolean = false;

  // 表单数据
  form: any = {
    avatar: "",
    nickname: "",
    brief: "",
    birth: undefined,
    gender: 2
  };
  // Computed
  // get computedData() {
  //   return ' cc' + this.searchValue;
  // }

  userSettingInfo: UserSettingInfo = <UserSettingInfo>{};

  // Lifecycle
  private mounted() {
    this.userSettingInfo = this.userDetail as UserSettingInfo;
    this.setForm(this.userSettingInfo);
  }

  // Methods
  setForm(userSettingInfo: UserSettingInfo) {
    console.log(userSettingInfo);
    this.form = {
      avatar: userSettingInfo.avatar,
      nickname: userSettingInfo.nickname,
      brief: userSettingInfo.brief,
      birth: userSettingInfo.birth,
      gender: userSettingInfo.gender
    };
  }

  async saveUserSetting() {
    // 已经提交了请求就不继续发送
    if (this.submitting) {
      return;
    }

    let isCheckOk = await (this.$refs.form as any).validate();
    if (isCheckOk) {
      // 开启提交中标志，设置暂时已提交状态
      this.submitting = true;
      this.ifSubmit = true;

      let userSettingPayload: UpdateUserSettingPayload;
      userSettingPayload = {
        avatar: this.form.avatar,
        nickname: this.form.nickname,
        brief: this.form.brief,
        birth: this.form.birth,
        gender: this.form.gender
      };

      // 修改用户信息
      let err, res;
      [err, res] = await To(updateUserSetting(userSettingPayload));

      // 修改失败
      if (err) {
        // 关闭提交中标志，设置未提交标志
        this.submitting = false;
        this.ifSubmit = false;
        return;
      }

      // 修改成功，设置已提交显示成功信息，关闭提交中标志
      if (res && res.code === 0) {
        this.submitting = false;
        this.ifSubmit = true;
        Toast.message("修改成功");

        // 更新 user 信息
        this.getUser();
      }
    }
  }

  // selectSong(song: Song, index: number): void {
  //   this.select(song, index);
  // }

  // @Action("getUser") getUser: any;
  @Action("getUser") getUser: any;

  // @Emit("select")
  // select(listItem: Song, index: number) {}

  // @Watch("child", { immediate: true, deep: true })
  // onChildChanged(val: string, oldVal: string) {}
}
</script>

<style lang="scss">
@import "../../assets/css/var.scss";

.user-setting-profile {
  .select-control-group {
    display: flex;
    .d-flex {
      margin: 8px;
    }
  }

  .save-setting {
    margin-top: 18px;
  }
}

// @media screen and (min-width: 576px) {
//   .user-setting-profile {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .user-setting-profile {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .user-setting-profile {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .user-setting-profile {
//     max-width: 1024px;
//   }
// }
</style>
