<template>
  <mu-container>
    <ContainerInner class="main-content">
      <mu-form
        ref="form"
        :model="form"
        class="mu-demo-form"
        label-width="100"
      >
        <!-- 文章分类列表 -->
        <section class="chip-wrapper">
          <mu-chip
            class="chip"
            v-for="(chip, index) in categoryIds"
            :key="categoryDetail(chip)._id"
            :color="colorArray[index % (colorArray.length + 1)]"
            @click="selectCategory(categoryDetail(chip))"
          >{{categoryDetail(chip).name}} {{categoryDetail(chip).postCount}}</mu-chip>
        </section>

        <section class="editor-wrapper">

          <!-- 文章分类 -->
          <mu-form-item
            prop="category"
            label="选择文章分类"
          >
            <mu-text-field
              disabled
              prop="category"
              v-model="form.categoryNow.name"
            ></mu-text-field>
          </mu-form-item>

          <!-- 文章标题 -->
          <mu-form-item
            prop="postTitle"
            label="标题"
            :rules="postTitleRules"
          >
            <mu-text-field
              prop="postTitle"
              :max-length="30"
              v-model="form.postTitle"
            ></mu-text-field>
          </mu-form-item>

          <!-- 富文本编辑器 -->
          <RichTextEditor
            prefix="post"
            v-model="form.htmlContent"
          />

        </section>
        <mu-button
          v-loading="submitting"
          @click="savePost"
          color="primary"
        >发表</mu-button>
      </mu-form>

    </ContainerInner>

  </mu-container>
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
import { CategoryDetail } from "@/assets/js/dataType";
import { colorArray } from "@/config/index";
import { CategoryMap } from "@/store/modules/category";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor.vue";
import ContainerInner from "@/components/ContainerInner.vue";
import { postTitleRules, categoryNameRules } from "@/utils/validate";
import { PostState, PostPayload, addPost } from "@/api/post";
import Toast from "muse-ui-toast";
import To from "@/utils/to";

@Component({
  components: {
    ContainerInner,
    RichTextEditor
  }
})
export default class NewPostView extends Vue {
  // Data
  form: any = {
    // 文章分类
    categoryNow: {},
    // 文章标题
    postTitle: "",
    // 文章HTML内容
    htmlContent: ""
  };
  // 表单提交中
  submitting: boolean = false;
  colorArray: string[] = colorArray;

  // 正则验证
  postTitleRules: any = postTitleRules;
  categoryNameRules: any = categoryNameRules;

  // Lifecycle
  async mounted() {
    // Vuex为空，重新请求数据
    if (this.categoryIds.length === 0) {
      this.getCategories();
    }
  }

  // Methods
  async getCategories() {
    await this.getCategoryList();
  }

  selectCategory(categoryDetail: CategoryDetail) {
    this.form.categoryNow = {
      ...categoryDetail
    };
  }

  clearForm() {
    this.form = {
      // 文章分类
      categoryNow: {},
      // 文章标题
      postTitle: "",
      // 文章HTML内容
      htmlContent: ""
    };
  }

  // 跳转刚发表的文章页面
  goToPost(postId: string) {
    this.$router.push({ path: `/posts/${postId}` });
  }

  async savePost() {
    // 已经提交了请求就不继续发送
    if (this.submitting) {
      return;
    }

    let isCheckOk = await (this.$refs.form as any).validate();
    if (this.form.categoryNow._id === undefined) {
      Toast.error("请选择文章分类");
      return;
    }
    if (isCheckOk && this.form.htmlContent.length > 20) {
      // 开启提交中标志，设置暂时已提交状态
      this.submitting = true;

      let postPayload: PostPayload;
      postPayload = {
        categoryId: this.form.categoryNow._id,
        title: this.form.postTitle,
        content: this.form.htmlContent,
        state: "published"
      };

      // 发表文章
      let err, res;
      [err, res] = await To(addPost(postPayload));

      // 发表失败
      if (err) {
        // 关闭提交中标志，设置未提交标志
        this.submitting = false;
        return;
      }

      // 发表成功，设置已提交显示成功信息，关闭提交中标志
      if (res && res.code === 0) {
        this.submitting = false;
        Toast.message("发表成功");

        // 更新 post
        this.setPost(res.data);
        // 更新 category postCount
        this.addCategoryPostCount(res.data.category);
        // 更新 user postCount
        this.addUserPostCount();
        this.goToPost(res.data._id);
        // 清除表单
        this.clearForm();
      }
    } else if (this.form.htmlContent.length <= 20) {
      Toast.error("文章内容太少");
    }
  }

  @Getter("categoryMap") categoryMap!: CategoryMap | {};
  @Getter("categoryIds") categoryIds!: string[] | [];
  @Getter("categoryDetail") categoryDetail: any;

  @Action("getCategoryList") getCategoryList: any;
  @Action("setPost") setPost: any;
  @Action("addCategoryPostCount") addCategoryPostCount: any;
  @Action("addUserPostCount") addUserPostCount: any;
}
</script>

<style lang="scss">
@import "../assets/css/var.scss";
.main-content {
  .editor-wrapper {
    margin-top: 10px;
    margin-bottom: 20px;
  }
}
</style>
