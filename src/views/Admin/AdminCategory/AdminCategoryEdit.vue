<template>
  <section class="admin-category-edit">
    <FormWrapper title="编辑分类">
      <mu-form
        ref="form"
        :model="form"
        class="mu-demo-form"
        :label-position="labelPosition"
        label-width="100"
      >
        <!-- 头像上传 -->
        <mu-form-item label="上传分类图片">

          <el-upload
            class="avatar-uploader"
            :action="domain"
            :http-request="uploadQiniu"
            :show-file-list="false"
            :before-upload="beforeUpload"
          >
            <img
              v-if="avatar"
              :src="avatar"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            ></i>
          </el-upload>
        </mu-form-item>

        <!-- 分类名 -->
        <mu-form-item
          prop="categoryName"
          label="分类名"
          :rules="nameRules"
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
          :rules="briefRules"
        >
          <mu-text-field
            prop="brief"
            :max-length="100"
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
  Model,
  Watch
} from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import {} from "@/assets/js/dataType";

@Component({
  components: {}
})
export default class AdminCategoryEdit extends Vue {
  // Props
  @Prop({
    default: [],
    required: true,
  })
  list!: any;

  // @Model("onChange", {
  //   type: String
  // })
  // searchKey!: string;

  // Data

  // Computed
  // get computedData() {
  //   return ' cc' + this.searchValue;
  // }

  // Lifecycle
  mounted() {}

  // Methods
  // selectSong(song: Song, index: number): void {
  //   this.select(song, index);
  // }

  // @Getter("userDetail") userDetail!: UserDetail | null;

  // @Action("getUser") getUser: any;

  // @Emit("select")
  // select(listItem: Song, index: number) {}

  // @Watch("child", { immediate: true, deep: true })
  // onChildChanged(val: string, oldVal: string) {}
}
</script>

<style lang="scss">
@import "../../../assets/css/var.scss";
.admin-category-edit {
}
</style>
