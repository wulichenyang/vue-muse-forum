<template>
  <section class="rich-text-editor">
    <!-- vue-quill-editor 富文本编辑器 -->
    <quill-editor
      ref="myTextEditor"
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
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Emit,
  Model,
  Mixins
} from "vue-property-decorator";
import { quillEditor } from "vue-quill-editor";
import { Getter, Action } from "vuex-class";
import {} from "@/assets/js/dataType";
import Quill from "quill";
import To from "@/utils/to";
import UploadQiniuMixin from "@/mixins/UploadQiniuMixin.vue";

@Component({
  components: {
    quillEditor
  }
})
export default class RichTextEditor extends Mixins(UploadQiniuMixin) {
  @Prop({
    type: String,
    default: "photo",
    required: false
  })
  prefix!: string;

  @Prop()
  @Model("onHtmlContentChange")
  htmlContent!: string;
  content: string = "";
  token: string = "";

  // vue-quill-editor 富文本内容变化区域，用于图片上传
  addRange: any;

  // Lifecycle
  private mounted() {
    // 监听富文本上传图片动作
    this.listenInsertPhoto();
  }

  // Methods
  // 富文本编辑器
  onEditorChange({ editor, html, text }: any) {
    // console.log('editor change!', editor, html, text)
    this.onHtmlContentChange(html);
  }

  listenInsertPhoto() {
    // 为图片ICON绑定事件  getModule 为编辑器的内部属性
    (this.$refs.myTextEditor as any).quill
      .getModule("toolbar")
      .addHandler("image", this.imgHandler);
  }

  // 选择图片时自动上传七牛云
  imgHandler(state: any) {
    this.addRange = (this.$refs.myTextEditor as any).quill.getSelection();
    if (state) {
      // 选择并上传一张图片
      let fileInput = this.$refs.imgInput;
      (fileInput as any).click(); // 加一个触发事件
    }
  }

  async uploadQiniu(req: any) {
    let uploadRes = await this.uploadPhotoToQiniu(req, this.prefix);

    // 上传图片至七牛云错误
    if (uploadRes === false) {
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

  @Emit("onHtmlContentChange")
  onHtmlContentChange(htmlContent: string) {}
}
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.rich-text-editor {
}

// @media screen and (min-width: 576px) {
//   .rich-text-editor {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .rich-text-editor {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .rich-text-editor {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .rich-text-editor {
//     max-width: 1024px;
//   }
// }
</style>
