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
              v-if="form.avatar"
              :src="form.avatar"
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
      >保存</mu-button>
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
import FormWrapper from "@/components/FormWrapper.vue";
import { Getter, Action } from "vuex-class";
import { CategoryDetail } from "@/assets/js/dataType";
import To from "@/utils/to";
import Toast from "muse-ui-toast";
import { qiniuConfig } from "@/config/index";
import { fetchQiniuToken, uploadPhoto, deletePrePhoto } from "@/api/upload";
import { updateCategory } from "@/api/category";
import { UpdateCategoryPayload } from "@/api/category";
import { categoryNameRules, categoryBriefRules } from "@/utils/validate";
import { CategoryMap } from "@/store/modules/category";

@Component({
  components: {
    FormWrapper
  }
})
export default class AdminCategoryEdit extends Vue {
  // Props
  // @Prop({
  //   default: [],
  //   required: true,
  // })
  // list!: any;

  // @Model("onChange", {
  //   type: String
  // })
  // searchKey!: string;

  // Data
  labelPosition: string = "top";
  categoryDetailNow: CategoryDetail | {} = {};
  form: any = {
    categoryName: "",
    sort: 1,
    brief: "",
    // 图片路径
    avatar: ""
  };
  // 当前分类id
  categoryId: string = "";
  // 提交表单时，图片是否已上传成功
  isUploadAvatarOk: boolean = false;

  // 图片纯key值，用于删除图片
  photoKey: string = "";
  token: any = {};
  // 七牛云的上传地址，根据自己所在地区选择，我这里是华南区
  domain: string = qiniuConfig.domain;
  // 这是七牛云空间的外链默认域名
  qiniuaddr: string = qiniuConfig.qiniuAddr;
  // 是否已提交过表单
  ifSubmit: boolean = false;
  // 提交状态标志
  submitting: boolean = false;

  // 验证表单正则
  categoryNameRules: any = categoryNameRules;
  categoryBriefRules: any = categoryBriefRules;

  // Computed
  // get computedData() {
  //   return ' cc' + this.searchValue;
  // }

  // Lifecycle
  mounted() {
    window.addEventListener("beforeunload", e => this.beforeunloadFn(e));
    // 获取该分类详细信息
    this.getCategoryItem();
  }

  // Methods
  // 如果该表单没提交，且图片路径与之前不同，则删除缓存的图片
  beforeDestroy() {
    if (
      this.photoKey &&
      !this.ifSubmit &&
      this.categoryDetailNow &&
      (this.categoryDetailNow as CategoryDetail).avatar &&
      this.form.avatar !== (this.categoryDetailNow as CategoryDetail).avatar
    ) {
      deletePrePhoto(this.photoKey);
    }
  }

  // 卸载页面监听事件
  destroyed() {
    window.removeEventListener("beforeunload", e => this.beforeunloadFn(e));
  }

  // Methods

  // 如果没提交，且图片路径与之前不同，则在刷新或关闭时删除缓存图片
  beforeunloadFn(e: any) {
    console.log("刷新或关闭");
    if (
      this.photoKey &&
      !this.ifSubmit &&
      this.categoryDetailNow &&
      (this.categoryDetailNow as CategoryDetail).avatar &&
      this.form.avatar !== (this.categoryDetailNow as CategoryDetail).avatar
    ) {
      deletePrePhoto(this.photoKey);
    }
  }

  setCategoryDetail(categoryDetail: CategoryDetail) {
    this.categoryId = categoryDetail._id;
    this.form.avatar = categoryDetail.avatar;
    this.form.categoryName = categoryDetail.name;
    this.form.brief = categoryDetail.brief;
    this.form.sort = categoryDetail.sort;
  }

  async getCategoryItem() {
    // 修改刷新页面监听
    this.categoryId = this.$route.params.id;

    // 如果vuex里没有该分类，则重新请求所有分类
    if (!this.categoryDetail(this.categoryId)) {
      let isOk = await this.getCategoryList();
      if (isOk) {
        this.categoryDetailNow = this.categoryDetail(this.categoryId);
        if (
          (this.categoryDetailNow as CategoryDetail)._id === this.categoryId
        ) {
          this.setCategoryDetail(this.categoryDetailNow as CategoryDetail);
        }
      }
    } else {
      // 有分类缓存，则直接设置详细信息
      this.categoryDetailNow = this.categoryDetail(this.categoryId);
      this.setCategoryDetail(this.categoryDetailNow as CategoryDetail);
    }
  }

  async uploadQiniu(req: any) {
    console.log(req);
    const uploadConfig = {
      headers: { "Content-Type": "multipart/form-data" }
    };

    let filetype = "";
    if (req.file.type === "image/png") {
      filetype = "png";
    } else {
      filetype = "jpg";
    }
    // 重命名要上传的文件
    const keyname =
      "category" +
      "-" +
      new Date().getTime() +
      "-" +
      Math.floor(Math.random() * 100) +
      "." +
      filetype;
    // 从后端获取上传凭证token
    let err, token;
    [err, token] = await To(fetchQiniuToken());
    // 获取token错误
    if (err) {
      return;
    }
    if (token && token.code === 0) {
      console.log(token);
      // 构建FormData图片对象
      const formdata = new FormData();
      formdata.append("file", req.file);
      formdata.append("token", token.data);
      formdata.append("key", keyname);
      // 获取到凭证之后再将文件上传到七牛云空间
      let uploadRes;
      // Attention！：跨域，需要配置代理
      [err, uploadRes] = await To(uploadPhoto(formdata, uploadConfig));
      if (err) {
        return;
      }
      // 上传七牛云成功，获取图片路径
      if (uploadRes && uploadRes.key) {
        console.log(uploadRes);
        if (this.photoKey) {
          // 多次上传，清除之前上传的图片
          deletePrePhoto(this.photoKey);
        }
        this.photoKey = uploadRes.key;
        this.form.avatar = "http://" + this.qiniuaddr + "/" + uploadRes.key;
        this.isUploadAvatarOk = true;
        console.log("avatar:    ", this.form.avatar);
      }
    }
  }

  // 验证文件合法性
  beforeUpload(file: File): boolean {
    const isJPG = file.type === "image/jpeg" || file.type === "image/png";
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJPG) {
      Toast.error("上传头像图片只能是 JPG 格式!");
    }
    if (!isLt2M) {
      Toast.error("上传头像图片大小不能超过 2MB!");
    }
    // 检测通过
    if (isJPG && isLt2M) {
      this.isUploadAvatarOk = false;
      return true;
    }
    // 检测失败
    return false;
  }

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

      let categoryPayload: UpdateCategoryPayload;
      categoryPayload = {
        id: (this.categoryDetailNow as CategoryDetail)._id,
        avatar: this.form.avatar,
        name: this.form.categoryName,
        brief: this.form.brief,
        sort: this.form.sort
      };

      // 修改分类
      let err, res;
      [err, res] = await To(updateCategory(categoryPayload));

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

        // 更新 category 列表
        this.getCategoryList();
        // 返回列表
        this.$router.push({
          name: 'adminCategoryList'
        })
      }
    }
  }
  // selectSong(song: Song, index: number): void {
  //   this.select(song, index);
  // }

  @Getter("categoryMap") categoryMap!: CategoryMap | {};
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
@import "../../../assets/css/var.scss";
.admin-category-edit {
  .avatar-uploader .el-upload {
    margin-top: 20px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: $primary;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: $avatarSize;
    height: $avatarSize;
    line-height: $avatarSize;
    text-align: center;
  }
  .avatar {
    width: $avatarSize;
    height: $avatarSize;
    display: block;
  }
}
</style>
