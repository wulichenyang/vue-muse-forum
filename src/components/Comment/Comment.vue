<template>
  <article class="comment-wrapper">

    <!-- 左侧头像 -->
    <UserAvatar :user="commentDetail && commentDetail.author" />

    <!-- 右部分主要评论内容 -->
    <div class="right-comment-content">

      <!-- 作者昵称 -->
      <UserName :user="commentDetail && commentDetail.author" />

      <!-- 评论内容 -->
      <p v-html="commentDetail && commentDetail.content && showEmoji(commentDetail.content)"></p>

      <div class="bottom-wrapper">
        <!-- 发表时间 -->
        <span class="time">{{dateDiff((new Date(commentDetail.createdAt)).getTime())}}</span>

        <!-- 底部右部分信息 -->
        <div class="bottom-right">

          <!-- 点赞/点赞数 -->
          <mu-button
            small
            flat
            color="primary"
            @click.prevent="onLike(
                commentDetail._id,
                'comment',
                commentDetail.author._id
                )"
            :class="commentDetail.ifLike ? 'like-btn active' : 'like-btn'"
          >
            <mu-icon
              right
              value="thumb_up"
            ></mu-icon>
            {{formatNumber(commentDetail.likeCount)}}
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
              color="secondary"
              value="textsms"
            ></mu-icon>
            <!-- {{formatNumber(commentDetail.commentCount)}} -->
          </mu-button>

        </div>
      </div>

      <!-- 回复框 -->
      <TextEditor
        v-model="ifShowThis"
        title="回复"
        :toName="commentDetail.author.nickname"
        :submitCallback="onSubmitReply"
        :showTitle="false"
        :hiddenWhenOutClick="true"
      />

      <!-- 回复列表 -->
      <section
        class="reply-list-wrapper"
        v-if="commentDetail && commentDetail.reply"
      >
        <Reply
          :key="replyId"
          v-for="replyId in commentDetail.reply"
          :replyDetail="replyDetail(replyId)"
          @emitToggleReplyLike="onToggleReplyLike"
        ></Reply>
      </section>

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
import { ReplyLikePayload } from "@/components/Comment/Reply/Reply.vue";
import { formatNumber } from "@/utils/format";
import { dateDiff } from "@/utils/time";
import { Getter, Action } from "vuex-class";
import UserAvatar from "@/components/UserAvatar.vue";
import TextEditor from "@/components/TextEditor.vue";
import Reply from "@/components/Comment/Reply/Reply.vue";
import { CommentDetail, ReplyDetail } from "@/assets/js/dataType";
import UserName from "@/components/UserName.vue";
import { ReplyPayload, addReply } from "@/api/reply";
import To from "@/utils/to";
import Toast from "muse-ui-toast";
import { showEmoji } from "@/utils/emoji";
import { LikeTargetType } from "@/api/like";
export interface CommentLikePayload {
  targetId: string;
  type: string;
  authorId: string;
}
@Component({
  components: {
    UserAvatar,
    UserName,
    TextEditor,
    Reply
  }
})
export default class Comment extends Vue {
  // Props
  @Prop({
    type: Object,
    default: {},
    required: true
  })
  commentDetail!: CommentDetail;

  // @Model("onChange", {
  //   type: String
  // })
  // searchKey!: string;

  // Data

  // 时间差函数
  dateDiff: any = dateDiff;

  // emoji转换为html
  showEmoji: any = showEmoji;

  // 数字格式化单位函数 单位k
  formatNumber: any = formatNumber;

  // 是否展示回复框
  ifShowThis: boolean = false;

  // Lifecycle
  mounted() {}

  // Methods
  onLike(targetId: string, type: LikeTargetType, authorId: string) {
    if (!this.isLogin) {
      this.openLoginDialog();
      return;
    }
    this.emitToggleCommentLike({
      targetId,
      type,
      authorId
    });
    console.log("like");
    return;
  }

  onToggleReplyLike(payload: ReplyLikePayload) {
    const { targetId, type, authorId } = payload;
    this.toggleReplyLike({
      targetId,
      type,
      authorId
    });
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
      to: this.commentDetail.author._id,
      commentId: this.commentDetail._id,
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
  @Emit("emitToggleCommentLike")
  emitToggleCommentLike(payload: CommentLikePayload) {}

  @Getter("isLogin") isLogin!: boolean | null;
  @Action("openLoginDialog") openLoginDialog: any;
  @Action("toggleReplyLike") toggleReplyLike: any;
  @Action("addReplyToCommentMap") addReplyToCommentMap: any;
  @Getter("replyDetail") replyDetail!: any;
}
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.comment-wrapper {
  text-align: left;
  margin-bottom: 14px;
  display: flex;
  .right-comment-content {
    flex: 1;
    p {
      margin: 5px 5px 5px 0;
    }
    .bottom-wrapper {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      span.time {
        color: $linkFontColor;
      }
      .bottom-right {
        .mu-button {
          height: 27px;
        }
        .like-btn,
        .reply-btn {
          // Phone
          min-width: 48px;
          min-height: 30px;
          i {
            margin-right: 5px;
          }
        }
      }
    }
    .reply-list-wrapper {
    }
  }
}

@media screen and (min-width: 576px) {
  .comment-wrapper {
    .right-comment-content {
      .bottom-wrapper {
        .bottom-right {
          .like-btn,
          .reply-btn {
            min-width: 64px;
          }
        }
      }
      .reply-list-wrapper {
      }
    }
  }
}
// @media screen and (min-width: 768px) {
//   .comment-wrapper {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .comment-wrapper {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .comment-wrapper {
//     max-width: 1024px;
//   }
// }
</style>
