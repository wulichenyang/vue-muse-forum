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

          <!-- vue-quill-editor 富文本编辑器 -->
          <quill-editor
            ref="myTextEditor"
            v-model="form.htmlContent"
            @change="onEditorChange($event)"
          >
          </quill-editor>

          <!--饿了么上传组件，也可以用input代替，都是隐藏起来手动监听图片事件，上传七牛云-->
          <el-upload
            class="avatar-uploader"
            :action="domain"
            :http-request="uploadQiniu"
            :show-file-list="false"
            style="display: none"
          >
            <i
              class="el-icon-plus avatar-uploader-icon"
              ref="imgInput"
            ></i>
          </el-upload>

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
import ContainerInner from "@/components/ContainerInner.vue";
import { quillEditor } from "vue-quill-editor";
import { postTitleRules, categoryNameRules } from "@/utils/validate";
import { PostState, PostPayload, addPost } from "@/api/post";
import { fetchQiniuToken, uploadPhoto } from "@/api/upload";
import { qiniuConfig } from "@/config/index";
import Toast from "muse-ui-toast";
import To from "@/utils/to";
import Quill from 'quill'

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
  // 表单提交中
  submitting: boolean = false;
  colorArray: string[] = colorArray;
  token: string = "";
  // 七牛云的上传地址，根据自己所在地区选择，我这里是华南区
  domain: string = qiniuConfig.domain;
  // 这是七牛云空间的外链默认域名
  qiniuaddr: string = qiniuConfig.qiniuAddr;

  // categoryNow: CategoryDetail | {} = {};
  // 正则验证
  postTitleRules: any = postTitleRules;
  categoryNameRules: any = categoryNameRules;
  // vue-quill-editor 富文本内容变化区域，用于图片上传
  addRange: any;

  // Computed
  // get computedData() {
  //   return ' cc' + this.searchValue;
  // }

  // Lifecycle
  async mounted() {
    // Vuex为空，重新请求数据
    if (this.categoryIds.length === 0) {
      this.getCategories();
    }
    // 监听富文本上传图片动作
    this.listenInsertPhoto();
  }

  // Methods
  listenInsertPhoto() {
    // 为图片ICON绑定事件  getModule 为编辑器的内部属性
    (this.$refs.myTextEditor as any).quill
      .getModule("toolbar")
      .addHandler("image", this.imgHandler);
  }

  // 选择图片时自动上传七牛云
  imgHandler(state: any) {
    console.log(state);
    this.addRange = (this.$refs.myTextEditor as any).quill.getSelection();
    if (state) {
      // let fileInput = document.getElementById('imgInput')
      // fileInput.click() // 加一个触发事件
      // 选择并上传一张图片
      let fileInput = this.$refs.imgInput;
      (fileInput as any).click(); // 加一个触发事件
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
      "post" +
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

        // 图片的远程路径
        let photoUrl = "http://" + this.qiniuaddr + "/" + uploadRes.key;
        // 将图片添加到富文本内容区域
        this.addRange = (this.$refs.myTextEditor as any).quill.getSelection();
        // 调用编辑器的 insertEmbed 方法，插入URL
        (this.$refs.myTextEditor as any).quill.insertEmbed(
          this.addRange !== null ? this.addRange.index : 0,
          "image",
          photoUrl,
          Quill.sources.USER
        );
      }
    }
  }

  async getToken() {
    // 从后端获取上传凭证token
    let err, token;
    [err, token] = await To(fetchQiniuToken());
    // 获取token错误
    if (err) {
      return;
    }
    if (token && token.code === 0) {
      this.token = token.data;
    }
  }

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
  // selectSong(song: Song, index: number): void {
  //   this.select(song, index);
  // }
  @Getter("categoryMap") categoryMap!: CategoryMap | {};
  @Getter("categoryIds") categoryIds!: string[] | [];
  @Getter("categoryDetail") categoryDetail: any;

  @Action("getCategoryList") getCategoryList: any;
  @Action("setPost") setPost: any;
  @Action("addCategoryPostCount") addCategoryPostCount: any;
  @Action("addUserPostCount") addUserPostCount: any;

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
