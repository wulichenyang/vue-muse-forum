<template>
  <mu-container>
    <!-- 文章详细内容 -->
    <ContainerInner class="post-detail-wrapper">
      <!-- 作者信息 -->
      <section class="user-info">

        <!-- 左侧头像部分 -->
        <!-- 头像 -->
        <UserAvatar :user="postData && postData.author" />

        <!-- 中间部分 -->
        <div class="center-wrapper">
          <!-- 作者昵称 -->
          <UserName :user="postData && postData.author" />

          <p>
            <!-- 发表时间 -->
            <span>{{dateDiff((new Date(postData.createdAt)).getTime())}}</span>
            <!-- 阅读次数 -->
            <span>{{formatNumber(postData.viewCount)}}次阅读</span>
            <!-- 关注数 -->
            <span>{{formatNumber(postData.followCount)}}人关注</span>
          </p>
        </div>

        <!-- 右侧关注按钮 -->
        <!-- <div class="right-wrapper">
          <mu-button
            :flat="ifFollowUser ? false : true"
            small
            class="right-btn empty-btn"
            color="pink400"
            @click="followUser"
          >
            关注
          </mu-button>
        </div> -->
      </section>

      <!-- 文章内容 -->
      <article class="post-wrapper">
        <h2 class="post-title">{{postData.title}}</h2>
        <main
          class="article-content"
          v-html="postData.content"
        >
        </main>

      </article>

      <!-- 固定操作栏 -->
      <section class="tool-bar">

        <!-- 点赞/点赞数 -->
        <mu-button
          flat
          small
          color="gray"
          :class="postData.ifLike ? 'like-btn active' : 'like-btn'"
          @click.prevent="onLike(
                postData._id,
                'post',
                postData.author._id)"
        >
          <mu-icon
            right
            value="thumb_up"
          ></mu-icon>
          {{formatNumber(postData.likeCount)}}
        </mu-button>

        <!-- 关注 -->

        <mu-button
          flat
          small
          color="gray"
          :class="postData.ifFollow ? 'follow-btn active' : 'follow-btn'"
          @click.prevent="onToggleFollowPost(
            postData._id,
            'post',
            userDetail && userDetail._id
            )"
          v-if="postData.ifFollow"
        >

          <mu-icon value="done"></mu-icon>
          已关注
        </mu-button>
        <mu-button
          flat
          small
          color="gray"
          :class="postData.ifFollow ? 'follow-btn active' : 'follow-btn'"
          @click.prevent="onToggleFollowPost(
            postData._id,
            'post',
            userDetail && userDetail._id
            )"
          v-else
        >
          <mu-icon value="add_box"></mu-icon>关注
        </mu-button>

        <!-- 收藏 -->
        <mu-button
          flat
          small
          color="gray"
        >
          <mu-icon value="grade"></mu-icon>
          收藏
        </mu-button>

        <!-- 评论 -->
        <mu-button
          flat
          small
          color="gray"
          class="comment-btn"
          @click.prevent="toComment()"
        >
          <mu-icon
            right
            color="gray"
            value="textsms"
          ></mu-icon>
          评论
        </mu-button>

      </section>

      <!-- 相关分类标签 -->
      <section>
        <blockquote>相关文章分类标签</blockquote>
        <router-link :to="postData && postData.category && `/categories/${postData.category._id}` || ''">
          <mu-button
            flat
            small
            class="right-btn empty-btn"
            color="pink400"
          >
            {{postData && postData.category && postData.category.name}}
          </mu-button>
        </router-link>
      </section>

      <!-- 纯文字编辑框（评论） -->
      <TextEditor
        id="comment-editor"
        title="评论"
        :submitCallback="onSubmitComment"
        :user="userDetail"
      />

      <!-- 评论列表 -->
      <section class="comment-list-wrapper">
        <Comment
          :key="commentId"
          v-for="commentId in postData.comment"
          :commentDetail="commentDetail(commentId)"
          @emitToggleCommentLike="onToggleCommentLike"
        ></Comment>
      </section>

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
import { localDate, dateDiff } from "@/utils/time";
import { formatNumber } from "@/utils/format";
import ContainerInner from "@/components/ContainerInner.vue";
import TextEditor from "@/components/TextEditor.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import UserName from "@/components/UserName.vue";
import Comment from "@/components/Comment/Comment.vue";
import { LikePayload } from "@/api/like";
import { Getter, Action } from "vuex-class";
import { CommentPayload, addComment, CommentState } from "@/api/comment";
import Toast from "muse-ui-toast";
import To from "@/utils/to";
import { CommentRawDetail } from "@/assets/js/dataType";
import { CommentLikePayload } from "@/components/Comment/Comment.vue";
import { LikeTargetType } from "@/api/like";
import { FollowTargetType } from "@/api/follow";

@Component({
  components: {
    ContainerInner,
    TextEditor,
    UserAvatar,
    Comment,
    UserName
  }
})
export default class PostDetailView extends Vue {
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
  // 是否关注该用户
  ifFollowUser: boolean = false;
  // 时间差函数
  dateDiff: any = dateDiff;
  // 数字格式化单位函数 单位k
  formatNumber: any = formatNumber;
  // Computed
  get postIdNow() {
    return this.$route.params.id;
  }

  get postData() {
    return this.postDetail(this.postIdNow);
  }

  // Lifecycle
  // private async mounted() {
  //   if (!this.postData || !this.postData._id) {
  //     await this.initPostDetail();
  //   }

  //   // 如果是进入评论，滚动至评论
  //   // !!必须同步等到数据获取完毕后在执行this.$nextTick
  //   if (this.$route.hash === "#comment-editor") {
  //     this.$nextTick(() => {
  //       this.toComment();
  //     });
  //   }
  // }

  private async activated() {
    if (!this.postData || !this.postData._id) {
      await this.initPostDetail();
    }

    // 如果是进入评论，滚动至评论
    // !!必须同步等到数据获取完毕后在执行this.$nextTick
    if (this.$route.hash === "#comment-editor") {
      this.$nextTick(() => {
        this.toComment();
      });
    }
  }

  // Methods
  onToggleFollowPost(
    targetId: string,
    type: FollowTargetType,
    userId?: string
  ) {
    if (!this.isLogin) {
      this.openLoginDialog();
      return;
    }
    this.togglePostDetailFollow({
      targetId,
      type,
      userId
    });
  }

  onToggleCommentLike(payload: CommentLikePayload) {
    const { targetId, type, authorId } = payload;
    this.toggleCommentLike({
      targetId,
      type,
      authorId
    });
  }

  async initPostDetail(): Promise<boolean> {
    return await this.getPostDetail({
      postId: this.postIdNow,
      userId: this.userDetail && this.userDetail._id
    });
  }

  // 提交comment回调
  async onSubmitComment(content: string): Promise<boolean> {
    let commentPayload: CommentPayload;
    commentPayload = {
      postId: this.postIdNow,
      content: content,
      state: "published"
    };

    // 添加评论
    let err, res;
    [err, res] = await To(addComment(commentPayload));

    // 添加失败
    if (err) {
      return false;
    }

    // 添加成功，设置已提交显示成功信息，关闭提交中标志
    if (res && res.code === 0) {
      Toast.message("评论成功");

      // 更新 Vuex 里 comment 列表
      this.addCommentToPostDetail(res.data as CommentRawDetail);
    }
    return true;
  }

  // 关注该用户
  followUser() {
    if (!this.isLogin) {
      this.openLoginDialog();
      return;
    }
  }

  onLike(targetId: string, type: LikeTargetType, authorId: string) {
    if (!this.isLogin) {
      this.openLoginDialog();
      return;
    }

    this.toggleDetailPostLike({
      targetId,
      type,
      authorId
    });

    console.log("like");
    return;
  }
  toComment() {
    (document.getElementById("comment-editor") as any).scrollIntoView({
      behavior: "smooth"
    });
  }

  @Getter("postDetail") postDetail!: any;
  @Getter("userDetail") userDetail!: any;
  @Getter("commentDetail") commentDetail!: any;
  @Getter("isLogin") isLogin!: boolean | null;

  @Action("togglePostDetailFollow") togglePostDetailFollow: any;
  @Action("toggleDetailPostLike") toggleDetailPostLike: any;
  @Action("toggleCommentLike") toggleCommentLike!: (
    payload: LikePayload
  ) => Promise<boolean>;
  @Action("openLoginDialog") openLoginDialog: any;
  @Action("getPostDetail") getPostDetail: any;
  @Action("addCommentToPostDetail") addCommentToPostDetail: any;

  // @Emit("select")
  // select(listItem: Song, index: number) {}

  // @Watch("child", { immediate: true, deep: true })
  // onChildChanged(val: string, oldVal: string) {}
}
</script>

<style lang="scss">
@import "../assets/css/var.scss";
.post-detail-wrapper {
  position: relative;
  // 用户信息
  .user-info {
    display: flex;

    // 中间
    .center-wrapper {
      flex: 1;
      p {
        color: $linkFontColor;
        margin-top: 0;
        span:not(:last-child) {
          &:after {
            content: "·";
            margin: 0 0.4em;
            color: $linkFontColor;
          }
        }
      }
    }

    // 右边
    .right-wrapper {
      .mu-button {
        margin-top: 5px;
      }
    }
  }
  .post-title {
    border-bottom: $postBottomBorder;
    margin-top: 0;
    padding-bottom: 10px;
  }
  main.article-content {
    min-height: 560px;
  }

  .tool-bar {
    width: 100%;
    bottom: 0;
    position: sticky;
    // box-shadow: $toolBarTopShadowColor;
    border-top: $toolBarTopBorder;
    background-color: $mainContainerBgColor;
    padding: 8px 0;
    button {
      margin-right: 6px;
    }
    .mu-button-wrapper {
      i {
        margin-right: 4px;
        opacity: 0.8;
      }
    }
  }
}

@media screen and (min-width: 576px) {
  .post-detail-wrapper {
  }
}
// @media screen and (min-width: 768px) {
//   .post-detail-wrapper {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .post-detail-wrapper {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .post-detail-wrapper {
//     max-width: 1024px;
//   }
// }
</style>