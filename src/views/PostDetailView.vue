<template>
  <mu-container>
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
          </p>
        </div>

        <!-- 右侧关注按钮 -->
        <div class="right-wrapper">
          <mu-button
            :flat="ifFollowUser ? false : true"
            small
            class="right-btn empty-btn"
            color="pink400"
            @click="followUser"
          >
            关注
          </mu-button>
        </div>
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

      <!-- 相关分类标签 -->
      <blockquote>相关文章分类标签</blockquote>
      <router-link :to="postData && postData.category && `/categories/${postData.category._id}` || ''">
        <mu-button
          flat
          small
          class="right-btn empty-btn"
          color="pink400"
        >
          {{postData&& postData.category && postData.category.name}}
        </mu-button>
      </router-link>

      <!-- 纯文字编辑框（评论） -->
      <TextEditor
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
import { Getter, Action } from "vuex-class";
import { CommentPayload, addComment, CommentState } from "@/api/comment";
import Toast from "muse-ui-toast";
import To from "@/utils/to";
import { CommentRawDetail } from "@/assets/js/dataType";

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
  mounted() {
    if (!this.postData || !this.postData._id) {
      this.initPostDetail();
    }
  }

  // Methods
  initPostDetail() {
    this.getPostDetail(this.postIdNow);
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

  @Getter("postDetail") postDetail!: any;
  @Getter("userDetail") userDetail!: any;
  @Getter("commentDetail") commentDetail!: any;

  @Getter("isLogin") isLogin!: boolean | null;

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
  }

  .comment-list-wrapper {
    margin-left: 20px;
    margin-top: 20px;
  }
}

// @media screen and (min-width: 576px) {
//   .post-wrapper {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .post-wrapper {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .post-wrapper {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .post-wrapper {
//     max-width: 1024px;
//   }
// }
</style>