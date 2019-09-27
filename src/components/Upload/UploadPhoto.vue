<template>
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
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Emit,
  Prop,
  Model
} from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import {} from "@/assets/js/dataType";
import { qiniuConfig } from "@/config/index";
import { fetchQiniuToken, uploadPhoto, deletePrePhoto } from "@/api/upload";
import To from "@/utils/to";
import Toast from "muse-ui-toast";

@Component({
  components: {}
})
export default class UploadPhoto extends Vue {
  // Props
  @Prop({
    type: Boolean,
    default: false,
    required: true,
  })
  ifSubmit!: boolean;

  @Prop()
  @Model('onAvatarChange') 
  avatar!: string
  // Data
  // 图片url
  // avatar: string = "";
  // 提交表单时，图片是否已上传成功
  isUploadAvatarOk: boolean = false;
  // 图片纯key值，用于删除图片
  photoKey: string = "";
  // 七牛云的上传地址，根据自己所在地区选择，我这里是华南区
  domain: string = qiniuConfig.domain;
  // 这是七牛云空间的外链默认域名
  qiniuaddr: string = qiniuConfig.qiniuAddr;

  // Lifecycle
  mounted() {
    // 添加刷新页面监听
    window.addEventListener("beforeunload", e => this.beforeunloadFn(e));
  }

  // 如果该表单没提交，则删除缓存的图片
  beforeDestroy() {
    if (this.photoKey && !this.ifSubmit) {
      deletePrePhoto(this.photoKey);
    }
  }

  // 卸载页面监听事件
  destroyed() {
    window.removeEventListener("beforeunload", e => this.beforeunloadFn(e));
  }

  // Methods
  // 监听刷新或关闭时删除缓存图片
  beforeunloadFn(e: any) {
    console.log("刷新或关闭");
    if (this.photoKey && !this.ifSubmit) {
      deletePrePhoto(this.photoKey);
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
        let url = "http://" + this.qiniuaddr + "/" + uploadRes.key;
        // // 更新到父组件
        this.onAvatarChange(url)
        this.isUploadAvatarOk = true;
        console.log("avatar:    ", this.avatar);
      }
    }
  }

  @Emit("onAvatarChange")
  onAvatarChange(avatarUrl: string) {}

}
</script>

<style lang="scss" scoped>
@import "../../assets/css/var.scss";
.avatar-uploader {
  margin-top: 20px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader:hover {
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

// @media screen and (min-width: 576px) {
//   .upload- {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .upload- {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .upload- {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .upload- {
//     max-width: 1024px;
//   }
// }
</style>
