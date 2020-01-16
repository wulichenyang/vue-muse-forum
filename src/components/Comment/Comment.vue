<template>
  <article class="comment-wrapper">

    <!-- 左侧头像 -->
    <UserAvatar :user="commentDetail && commentDetail.author" />

    <!-- 右部分主要评论内容 -->
    <div class="right-comment-content">

      <!-- 作者昵称 -->
      <UserName :user="commentDetail && commentDetail.author" />

      <!-- 回复的文章标题 -->
      <span v-if="commentDetail && commentDetail.postId">
        评论了文章
        <router-link :to="`/posts/${commentDetail.postId._id}`">
          <br><strong class="title">{{commentDetail.postId.title}}</strong>
        </router-link>
      </span>

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
            color="gray"
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
              color="gray"
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
  Watch,
  Mixins
} from "vue-property-decorator";
import { ReplyLikePayload } from "@/components/Comment/Reply/Reply.vue";
import { Getter, Action } from "vuex-class";
import UserAvatar from "@/components/UserAvatar.vue";
import TextEditor from "@/components/TextEditor.vue";
import Reply from "@/components/Comment/Reply/Reply.vue";
import {
  CommentDetail,
  ReplyDetail,
  PostInfoInComment
} from "@/assets/js/dataType";
import UserName from "@/components/UserName.vue";
import { ReplyPayload, addReply } from "@/api/reply";
import To from "@/utils/to";
import Toast from "muse-ui-toast";
import { showEmoji } from "@/utils/emoji";
import { LikeTargetType } from "@/api/like";
import CheckLoginMixin from "@/mixins/CheckLoginMixin.vue";
import FormatMixin from '@/mixins/FormatMixin.vue';

export interface CommentLikePayload {
  targetId: string;
  type: LikeTargetType;
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
export default class Comment extends Mixins(CheckLoginMixin, FormatMixin) {
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

  // emoji转换为html
  showEmoji: any = showEmoji;

  // 是否展示回复框
  ifShowThis: boolean = false;

  // Lifecycle
  private mounted() {}

  // Methods
  onLike(targetId: string, type: LikeTargetType, authorId: string) {
    if (this.ifLogin()) {
      this.emitToggleCommentLike({
        targetId,
        type,
        authorId
      });
      return;
    }
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
    if (this.ifLogin()) {
      this.showReplyInput();
    }
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

  @Action("toggleReplyLike") toggleReplyLike: any;
  @Action("addReplyToCommentMap") addReplyToCommentMap: any;
  @Getter("replyDetail") replyDetail!: any;
}
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.comment-wrapper {
  overflow: hidden;
  text-align: left;
  margin-bottom: 14px;
  display: flex;
  .right-comment-content {
    overflow: hidden;
    strong.title {
      color: $primary;
      &:hover {
        text-decoration: underline;
      }
    }
    flex: 1;
    p {
      overflow: hidden;
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
