<template>
  <!-- 文章详细信息 -->
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

              <span></span>
            </router-link>

            <!-- 发表时间 -->
            <span class="time">{{dateDiff((new Date(postBrief.createdAt)).getTime())}}</span>
          </div>

          <!-- 底部右部分信息 -->
          <div class="bottom-right">
            <!-- 阅读数 -->
            <span>{{postBrief.viewCount}}次浏览</span>

            <!-- 点赞/点赞数 -->
            <span>{{postBrief.likeCount}}点赞</span>

            <!-- 评论 -->
            <span>{{postBrief.commentCount}}评论</span>
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
import { localDate, dateDiff } from "@/utils/time";
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
  localDate: any = localDate;
  // 时间差函数
  dateDiff: any = dateDiff;
  // searchValue: string = "";
  // ifFocusSearch: boolean = false;

  // Computed
  get firstLetter(): string {
    return getPy(this.postBrief.author.nickname.substring(0, 1))[0];
  }

  // Lifecycle
  mounted() {}

  // Methods
  // selectSong(song: Song, index: number): void {
  //   this.select(song, index);
  // }

  // @Getter("userDetail") userDetail!: UserDetail | null;

  // @Action("getUser") getUser: any;

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
    padding: 27px 36px;
    border-radius: $mainWrapperBorderRadius;
    transition: 0.3s all;
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
      }
      span.time {
        color: $linkFontColor;
      }
    }
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
