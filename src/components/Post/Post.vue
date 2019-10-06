<template>
  <!-- 文章简单信息 -->
  <router-link
    class="post-link"
    :to="`/posts/${postBrief._id}`"
  >
    <article class="post-wrapper">
      <!-- 用户信息 -->
      <router-link
        class="user-brief"
        :to="`/users/${postBrief.author._id}`"
      >
        <!-- 头像 -->
        <mu-button
          class="user-avatar"
          fab
        >
          <mu-avatar
            v-if="postBrief && postBrief.author && postBrief.author.avatar"
            text-color="#fff"
            color="pink400"
            size="36"
          >
            <img :src="postBrief && postBrief.author && postBrief.author.avatar">
          </mu-avatar>
          <mu-avatar
            v-else
            text-color="#fff"
            color="pink400"
            size="36"
          >{{firstLetter}}
          </mu-avatar>
        </mu-button>

        <!-- 作者昵称 -->
        <span>{{postBrief.author.nickname}}</span>

      </router-link>

      <!-- 右边主要信息部分 -->
      <section class="right-wrapper">
        <!-- 标题 -->
        <router-link :to="`/posts/${postBrief._id}`">
          <h2>{{postBrief.title}}</h2>
        </router-link>

        <!-- 底部信息 -->
        <div class="bottom-wrapper">

          <!-- 底部左部分信息 -->
          <div class="bottom-left">
            <!-- 文章分类 -->
            <router-link :to="`/categories/${postBrief.category._id}`">
              <span class="category-name">{{postBrief.category.name}}</span>
            </router-link>

            <!-- 发表时间 -->
            <span class="time">{{dateDiff((new Date(postBrief.createdAt)).getTime())}}</span>
            <!-- 阅读数 -->
            <span class="view-count">{{formatNumber(postBrief.viewCount)}}次阅读</span>
          </div>

          <!-- 底部右部分信息 -->
          <div class="bottom-right">

            <!-- 点赞/点赞数 -->
            <mu-button
              flat
              color="primary"
              class="like-btn"
              @click.prevent="onLike()"
            >
              <mu-icon
                right
                value="thumb_up"
              ></mu-icon>
              {{formatNumber(postBrief.likeCount)}}
            </mu-button>

            <!-- 评论/评论数 -->
            <mu-button
              flat
              class="comment-btn"
              @click.prevent="onComment()"
            >
              <mu-icon
                right
                color="secondary"
                value="textsms"
              ></mu-icon>
              {{formatNumber(postBrief.commentCount)}}
            </mu-button>

          </div>
        </div>
      </section>

    </article>
  </router-link>
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
import { dateDiff } from "@/utils/time";
import { formatNumber } from "@/utils/format";
import getPy from "@/utils/nameToPinyin";
import { Getter, Action } from "vuex-class";
import { PostBrief } from "@/assets/js/dataType";

@Component({
  components: {}
})
export default class Post extends Vue {
  // Props
  @Prop({
    type: Object,
    default: {},
    required: true
  })
  postBrief!: PostBrief;

  // @Model("onChange", {
  //   type: String
  // })
  // searchKey!: string;

  // Data
  // 时间转换函数
  // localDate: any = localDate;
  // 时间差函数
  dateDiff: any = dateDiff;
  // 数字格式化单位函数 单位k
  formatNumber: any = formatNumber;
  // searchValue: string = "";
  // ifFocusSearch: boolean = false;

  // Computed
  get firstLetter(): string {
    return getPy(this.postBrief.author.nickname.substring(0, 1))[0];
  }

  // Lifecycle
  mounted() {}

  // Methods
  onLike() {
    if (!this.isLogin) {
      this.openLoginDialog();
      return;
    }

    console.log("like");
    return;
  }

  onComment() {
    if (!this.isLogin) {
      this.openLoginDialog();
      return;
    }

    console.log("comment");
    return;
  }

  @Getter("isLogin") isLogin!: boolean | null;
  @Action("openLoginDialog") openLoginDialog: any;

  // @Emit("select")
  // select(listItem: Song, index: number) {}

  // @Watch("child", { immediate: true, deep: true })
  // onChildChanged(val: string, oldVal: string) {}
}
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.post-link {
  display: block;
  &:not(:last-child) {
    border-bottom: $postBottomBorder;
  }

  .post-wrapper {
    background: $mainContainerBgColor;
    transition: 0.3s all;
    // Phone
    padding: $postPhonePadding;
    border-radius: $phoneMainWrapperBorderRadius;
    &:hover {
      transform: scale(1.01);
      box-shadow: $postBoxShadowColor;
      transition: 0.3s all;
    }
    // 用户信息
    .mu-button {
      width: $postAvatarSize;
      height: $postAvatarSize;
      background: transparent;
    }
    .user-brief {
      .user-avatar {
        position: absolute;
      }
      span {
        padding-left: 50px;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    // 右部分主要信息
    .right-wrapper {
      padding-left: 50px;

      h2 {
        &:hover {
          text-decoration: underline;
        }
      }
      // 底部信息
      .bottom-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .mu-button {
          height: 27px;
        }
        .like-btn,
        .comment-btn {
          min-width: 64px;
          min-height: 30px;
          i {
            margin-right: 5px;
          }
        }
      }
      .time,
      .category-name {
        color: $linkFontColor;
        &:after {
          content: "·";
          margin: 0 0.4em;
          color: $linkFontColor;
        }
      }
      .view-count {
        color: $linkFontColor;
      }
    }
  }
}

@media screen and (min-width: 576px) {
  .post-link {
    .post-wrapper {
      border-radius: $mainWrapperBorderRadius;
    }
  }
}
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
