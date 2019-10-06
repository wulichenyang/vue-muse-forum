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
import { Component, Vue, Prop, Emit, Model } from "vue-property-decorator";
import { quillEditor } from "vue-quill-editor";
import { Getter, Action } from "vuex-class";
import {} from "@/assets/js/dataType";
import Quill from "quill";
import { fetchQiniuToken, uploadPhoto } from "@/api/upload";
import { qiniuConfig } from "@/config/index";
import To from "@/utils/to";
@Component({
  components: {
    quillEditor
  }
})
export default class RichTextEditor extends Vue {
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
  // 七牛云的上传地址，根据自己所在地区选择，我这里是华南区
  domain: string = qiniuConfig.domain;
  // 这是七牛云空间的外链默认域名
  qiniuaddr: string = qiniuConfig.qiniuAddr;

  // vue-quill-editor 富文本内容变化区域，用于图片上传
  addRange: any;

  // Lifecycle
  mounted() {
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
      this.prefix +
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
