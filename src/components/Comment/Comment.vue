<template>
  <article class="comment-wrapper">

    <!-- 左侧头像 -->
    <UserAvatar :user="commentDetail && commentDetail.author" />

    <!-- 右部分主要评论内容 -->
    <div class="right-comment-content">

      <!-- 作者昵称 -->
      <UserName :user="commentDetail && commentDetail.author" />

      <!-- 评论内容 -->
      <p>{{commentDetail && commentDetail.content}}</p>

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
            class="like-btn"
            @click.prevent="onLike()"
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
      <!-- TODO: 未登录权限限制 -->
      <!-- 回复框 -->
      <TextEditor
        v-model="ifShowThis"
        title="回复"
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
import { CommentDetail } from "@/assets/js/dataType";
import UserName from "@/components/UserName.vue";

@Component({
  components: {
    UserAvatar,
    UserName,
    TextEditor
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

  // 数字格式化单位函数 单位k
  formatNumber: any = formatNumber;

  // 是否展示回复框
  ifShowThis: boolean = false;

  // Lifecycle
  mounted() {}

  // Methods
  onLike() {
    if (!this.isLogin) {
      this.openLoginDialog();
      return;
    }
    
  }

  showReplyInput() {
    this.ifShowThis = true;
  }
  onReply() {
    if (!this.isLogin) {
      this.openLoginDialog();
      return;
    }

    this.showReplyInput();
  }
  onSubmitReply() {}

  @Getter("isLogin") isLogin!: boolean | null;
  @Action("openLoginDialog") openLoginDialog: any;
}

</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.comment-wrapper {
  margin-bottom: 14px;
  display: flex;
  .right-comment-content {
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
//   .comment-wrapper {
//     max-width: 540px;
//   }
// }
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
