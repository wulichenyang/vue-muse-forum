<template>
  <section class="admin-category-add">
    <FormWrapper title="添加分类">
      <mu-form
        ref="form"
        :model="form"
        class="mu-demo-form"
        :label-position="labelPosition"
        label-width="100"
      >

        <!-- 头像上传 -->
        <mu-form-item label="上传分类图片">
          <UploadPhoto
            v-model="form.avatar"
            :ifSubmit="ifSubmit"
            prefix="category"
          />
        </mu-form-item>

        <!-- 分类名 -->
        <mu-form-item
          prop="categoryName"
          label="分类名"
          :rules="categoryNameRules"
        >
          <mu-text-field
            prop="categoryName"
            :max-length="5"
            v-model="form.categoryName"
          ></mu-text-field>
        </mu-form-item>

        <!-- 简介 -->
        <mu-form-item
          prop="brief"
          label="分类简介"
          :rules="categoryBriefRules"
        >
          <mu-text-field
            prop="brief"
            :max-length="300"
            multi-line
            v-model="form.brief"
          ></mu-text-field>
        </mu-form-item>

        <!-- 分类排序权重 -->
        <mu-form-item
          prop="sort"
          label="分类排序权重"
        >
          <mu-slider
            :step="1"
            :max="10"
            color="primary"
            v-model="form.sort"
          ></mu-slider>
        </mu-form-item>

      </mu-form>

      <mu-button
        v-loading="submitting"
        @click="saveCategory"
        color="primary"
      >提交</mu-button>
    </FormWrapper>
  </section>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Emit,
} from "vue-property-decorator";
import FormWrapper from "@/components/FormWrapper.vue";
import UploadPhoto from "@/components/Upload/UploadPhoto.vue";
import { Getter, Action } from "vuex-class";
import {} from "@/assets/js/dataType";
import To from "@/utils/to";
import Toast from "muse-ui-toast";
import { addCategory } from "@/api/category";
import { CategoryPayload } from "@/api/category";
import { categoryNameRules, categoryBriefRules } from "@/utils/validate";

@Component({
  components: {
    FormWrapper,
    UploadPhoto
  }
})
// TODO: copper
export default class AdminCategoryAdd extends Vue {
  // Data
  labelPosition: string = "top";
  form: any = {
    categoryName: "",
    sort: 1,
    brief: "",
    // 图片路径
    avatar: ""
  };

  // 是否已提交过表单
  ifSubmit: boolean = false;
  // 提交状态标志
  submitting: boolean = false;

  // 正则验证
  categoryNameRules: any = categoryNameRules;
  categoryBriefRules: any = categoryBriefRules;

  // Lifecycle
  private mounted() {}

  // 更新当前avatarUrl
  onAvatarChange(avatarUrl: string) {
    this.form.avatar = avatarUrl;
  }

  // Methods
  clearForm() {
    this.form = {
      categoryName: "",
      sort: 1,
      brief: "",
      avatar: ""
    };
  }

  async saveCategory() {
    // 已经提交了请求就不继续发送
    if (this.submitting) {
      return;
    }

    let isCheckOk = await (this.$refs.form as any).validate();
    if (isCheckOk) {
      // 开启提交中标志，设置暂时已提交状态
      this.submitting = true;
      this.ifSubmit = true;

      let categoryPayload: CategoryPayload;
      categoryPayload = {
        avatar: this.form.avatar,
        name: this.form.categoryName,
        brief: this.form.brief,
        sort: this.form.sort
      };

      // 添加分类
      let err, res;
      [err, res] = await To(addCategory(categoryPayload));

      // 添加失败
      if (err) {
        // 关闭提交中标志，设置未提交标志
        this.submitting = false;
        this.ifSubmit = false;
        return;
      }

      // 添加成功，设置已提交显示成功信息，关闭提交中标志
      if (res && res.code === 0) {
        this.submitting = false;
        this.ifSubmit = true;
        Toast.message("添加成功");

        // 更新category列表
        this.getCategoryList();
        // 清除表单
        this.clearForm();
      }
    }
  }

  // @Getter("userDetail") userDetail!: UserDetail | null;
  @Action("getCategoryList") getCategoryList: any;

  // @Action("getUser") getUser: any;

}
</script>

<style lang="scss">
@import "../../../assets/css/var.scss";
.admin-category-add {

}
</style>
