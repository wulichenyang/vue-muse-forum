<template>
  <mu-container>
    <ContainerInner class="new-post">
      <mu-form
        ref="form"
        :model="form"
        class="mu-demo-form"
        label-width="100"
      >
        <section class="chip-wrapper">
          <mu-chip
            class="chip"
            v-for="(chip, index) in categoryIds"
            :key="categoryDetail(chip)._id"
            :color="colorArray[index % (colorArray.length + 1)]"
            @click="selectCategory(categoryDetail(chip))"
          >{{categoryDetail(chip).name}}</mu-chip>
        </section>

        <section class="editor-wrapper">

          <!-- 文章分类 -->
          <mu-form-item
            prop="category"
            label="选择文章分类"
            :rules="categoryNameRules"
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

          <!-- vue-quill-editor 富文本编辑器 -->
          <quill-editor
            ref="myTextEditor"
            v-model="form.htmlContent"
            @change="onEditorChange($event)"
          >
          </quill-editor>

        </section>
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
import ContainerInner from "@/components/ContainerInner.vue";
import { quillEditor } from "vue-quill-editor";
import { postTitleRules, categoryNameRules } from "@/utils/validate";

@Component({
  components: {
    ContainerInner,
    quillEditor
  }
})
export default class NewPost extends Vue {
  // Props
  // @Prop({
  //   type: String,
  //   default: [],
  //   required: true,
  // })
  // list!: string;

  // @Model("onChange", {
  //   type: String
  // })
  // searchKey!: string;

  // Data
  form: any = {
    // 文章分类
    categoryNow: {},
    // 文章标题
    postTitle: "",
    // 文章HTML内容
    htmlContent: ""
  };
  colorArray: string[] = colorArray;
  // categoryNow: CategoryDetail | {} = {};
  // 正则验证
  postTitleRules: any = postTitleRules;
  categoryNameRules: any = categoryNameRules;
  // Computed
  // get computedData() {
  //   return ' cc' + this.searchValue;
  // }

  // Lifecycle
  mounted() {
    // Vuex为空，重新请求数据
    if (this.categoryIds.length === 0) {
      this.getCategories();
    }
  }

  // Methods
  // 富文本编辑器
  onEditorChange({ editor, html, text }: any) {
    // console.log('editor change!', editor, html, text)
    this.form.htmlContent = html;
  }

  async getCategories() {
    await this.getCategoryList();
  }

  selectCategory(categoryDetail: CategoryDetail) {
    this.form.categoryNow = {
      ...categoryDetail
    };
  }

  // selectSong(song: Song, index: number): void {
  //   this.select(song, index);
  // }
  @Getter("categoryMap") categoryMap!: CategoryMap | {};
  @Getter("categoryIds") categoryIds!: string[] | [];
  @Getter("categoryDetail") categoryDetail: any;

  @Action("getCategoryList") getCategoryList: any;

  // @Getter("userDetail") userDetail!: UserDetail | null;

  // @Action("getUser") getUser: any;

  // @Emit("select")
  // select(listItem: Song, index: number) {}

  // @Watch("child", { immediate: true, deep: true })
  // onChildChanged(val: string, oldVal: string) {}
}
</script>

<style lang="scss">
@import "../assets/css/var.scss";
.new-post {
  .chip {
    margin: 8px;
    vertical-align: middle;
  }
  .editor-wrapper {
    margin-top: 10px;
    margin-bottom: 20px;
  }
}
</style>
