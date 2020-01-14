<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import To from "@/utils/to";
import { qiniuConfig } from "@/config/index";
import { fetchQiniuToken, uploadPhoto } from "@/api/upload";
import Toast from "muse-ui-toast";

@Component
export default class UploadQiniuMixin extends Vue {
  // 七牛云的上传地址，根据自己所在地区选择，我这里是华南区
  domain: string = qiniuConfig.domain;
  // 这是七牛云空间的外链默认域名F
  qiniuaddr: string = qiniuConfig.qiniuAddr;

  // 验证文件合法性
  checkPhotoFormat(file: File): boolean {
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
      return true;
    }
    // 检测失败
    return false;
  }

  async uploadPhotoToQiniu(req: any, prefix: string): Promise<boolean | any> {
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
      prefix +
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
      return false;
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
        return false;
      }
      return uploadRes;
    }
  }
}
</script>
