<template>
  <mu-container>
    <ContainerInner class="post-detail-wrapper">
      <!-- 作者信息 -->
      <section class="user-info">

        <!-- 左侧头像部分 -->
        <router-link
          class="left-avatar-wrapper"
          :to="`/users/${postData && postData.author && postData.author._id}`"
        >
          <!-- 头像 -->
          <mu-button
            class="avatar-btn"
            fab
          >
            <mu-avatar
              v-if="postData && postData.author && postData.author.avatar"
              text-color="#fff"
              color="pink400"
              size="36"
            >
              <img :src="postData && postData.author && postData.author.avatar">
            </mu-avatar>
            <mu-avatar
              v-else
              text-color="#fff"
              color="pink400"
              size="36"
            >{{firstLetter}}
            </mu-avatar>
          </mu-button>
        </router-link>

        <!-- 中间部分 -->
        <div class="center-wrapper">
          <!-- 作者昵称 -->
          <router-link :to="`/users/${postData && postData.author && postData.author._id}`">
            <span>{{postData && postData.author && postData.author.nickname}}</span>
          </router-link>

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
      />

      <!-- 评论列表 -->
      <!-- <Comment /> -->

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
import Comment from "@/components/Comment/Comment.vue";
import { Getter, Action } from "vuex-class";
import { CommentPayload, addComment, CommentState } from "@/api/comment";
import Toast from "muse-ui-toast";
import To from "@/utils/to";
import {} from "@/assets/js/dataType";
import getPy from "@/utils/nameToPinyin";

@Component({
  components: {
    ContainerInner,
    TextEditor,
    Comment
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

  get firstLetter(): string {
    return this.postData &&
      this.postData.author &&
      this.postData.author.nickname
      ? getPy(this.postData.author.nickname.substring(0, 1))[0]
      : "";
  }

  // Lifecycle
  mounted() {
    if (!this.postData || !this.postData._id) {
      this.initPostDetail();
    }
  }

  // Methods
  initPostDetail() {
    console.log(123);
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

      // TODO：更新comment列表
      this.addComment();
    }
    return true;
  }
  // selectSong(song: Song, index: number): void {
  //   this.select(song, index);
  // }

  @Getter("postDetail") postDetail!: any;

  @Action("getPostDetail") getPostDetail: any;
  @Action("addComment") addComment: any;

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
  .avatar-btn {
    width: $postAvatarSize;
    height: $postAvatarSize;
    background: transparent;
  }
  .user-info {
    display: flex;
    // 左侧
    .left-avatar-wrapper {
      width: $postAvatarSize;
      margin-top: 3px;
    }

    // 中间
    .center-wrapper {
      margin-left: 14px;
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