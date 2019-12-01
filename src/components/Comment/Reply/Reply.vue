<template>
  <article class="reply-wrapper">

    <!-- 左侧头像 -->
    <UserAvatar :user="replyDetail && replyDetail.from" />

    <!-- 右部分主要回复内容 -->
    <div class="right-reply-content">

      <!-- 作者昵称 -->
      <UserName :user="replyDetail && replyDetail.from" />
      ›
      <!-- 回复对象 -->
      <UserName :user="replyDetail && replyDetail.to" />

      <!-- 回复内容 -->
      <p v-html="replyDetail && replyDetail.content && showEmoji(replyDetail.content)"></p>

      <div class="bottom-wrapper">
        <!-- 发表时间 -->
        <span class="time">{{dateDiff((new Date(replyDetail.createdAt)).getTime())}}</span>

        <!-- 底部右部分信息 -->
        <div class="bottom-right">

          <!-- 点赞/点赞数 -->
          <mu-button
            small
            flat
            color="gray"
            :class="replyDetail.ifLike ? 'like-btn active' : 'like-btn'"
            @click.prevent="onLike(
                replyDetail._id,
                'reply',
                replyDetail.from._id
                )"
          >
            <mu-icon
              right
              value="thumb_up"
            ></mu-icon>
            {{formatNumber(replyDetail.likeCount)}}
          </mu-button>

          <!-- 回复 -->
          <mu-button
            small
            flat
            class="reply-btn"
            @click.stop="onReply()"
          >
            <mu-icon
              right
              color="gray"
              value="textsms"
            ></mu-icon>
          </mu-button>

        </div>
      </div>

      <!-- 回复框 -->
      <TextEditor
        v-model="ifShowThis"
        title="回复"
        :toName="replyDetail.from && replyDetail.from.nickname"
        :submitCallback="onSubmitReply"
        :showTitle="false"
        :hiddenWhenOutClick="true"
      />
    </div>

  </article>
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
import { formatNumber } from "@/utils/format";
import { dateDiff } from "@/utils/time";
import { Getter, Action } from "vuex-class";
import UserAvatar from "@/components/UserAvatar.vue";
import TextEditor from "@/components/TextEditor.vue";
import { ReplyDetail } from "@/assets/js/dataType";
import UserName from "@/components/UserName.vue";
import { ReplyPayload, addReply } from "@/api/reply";
import To from "@/utils/to";
import Toast from "muse-ui-toast";
import { showEmoji } from "@/utils/emoji";
import { LikeTargetType } from "@/api/like";

export interface ReplyLikePayload {
  targetId: string;
  type: string;
  authorId: string;
}

@Component({
  components: {
    UserAvatar,
    UserName,
    TextEditor
  }
})
export default class Reply extends Vue {
  // Props
  @Prop({
    type: Object,
    default: {},
    required: true
  })
  replyDetail!: ReplyDetail;

  // @Model("onChange", {
  //   type: String
  // })
  // searchKey!: string;

  // Data

  // 时间差函数
  dateDiff: any = dateDiff;

  // 数字格式化单位函数 单位k
  formatNumber: any = formatNumber;

  // 是否展示回复框
  ifShowThis: boolean = false;

  // emoji转换为html
  showEmoji: any = showEmoji;

  // Lifecycle
  private mounted() {}

  // Methods
  onLike(targetId: string, type: LikeTargetType, authorId: string) {
    if (!this.isLogin) {
      this.openLoginDialog();
      return;
    }

    this.emitToggleReplyLike({
      targetId,
      type,
      authorId
    });
    
    console.log("like");
    return;
  }

  showReplyInput() {
    this.ifShowThis = !this.ifShowThis;
  }

  onReply() {
    if (!this.isLogin) {
      this.openLoginDialog();
      return;
    }

    this.showReplyInput();
  }

  async onSubmitReply(content: string): Promise<boolean> {
    let replyPayload: ReplyPayload;
    replyPayload = {
      to: this.replyDetail.from._id,
      commentId: this.replyDetail.commentId,
      content: content,
      state: "published"
    };

    // 添加回复
    let err, res;
    [err, res] = await To(addReply(replyPayload));

    // 添加失败
    if (err) {
      return false;
    }

    // 添加成功，设置已提交显示成功信息，关闭提交中标志
    if (res && res.code === 0) {
      Toast.message("回复成功");

      // 更新一条回复到 Vuex 里 reply 列表
      this.addReplyToCommentMap(res.data as ReplyDetail);
    }
    return true;
  }
  @Emit("emitToggleReplyLike")
  emitToggleReplyLike(payload: ReplyLikePayload) {}

  @Getter("isLogin") isLogin!: boolean | null;
  @Action("openLoginDialog") openLoginDialog: any;
  @Action("addReplyToCommentMap") addReplyToCommentMap: any;
}
</script>

<style lang="scss">
@import "../../../assets/css/var.scss";
.reply-wrapper {
  display: flex;
  padding: 10px 10px 0 10px;
  background: $mainBodyBgColor;
  &:not(:last-child) {
    .right-reply-content {
      border-bottom: $postBottomBorder;
    }
  }
  .right-reply-content {
    flex: 1;
    p {
      margin: 5px 0;
    }
    .bottom-wrapper {
      display: flex;
      justify-content: space-between;

      span.time {
        color: $linkFontColor;
      }
      .bottom-right {
        .mu-button {
          height: 27px;
        }
        .like-btn,
        .reply-btn {
          min-width: 64px;
          min-height: 30px;
          i {
            margin-right: 5px;
          }
        }
      }
    }
  }
}

// @media screen and (min-width: 576px) {
//   .reply-wrapper {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .reply-wrapper {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .reply-wrapper {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .reply-wrapper {
//     max-width: 1024px;
//   }
// }
</style>
