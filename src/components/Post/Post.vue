<template>
  <!-- 文章简单信息 -->
  <router-link
    class="post-link"
    :to="`/posts/${postBrief._id}`"
  >
    <article class="post-wrapper larger-item-hover">

      <!-- 用户信息 -->
      <router-link
        class="user-brief"
        :to="`/users/${postBrief.author._id}`"
      >

        <!-- 头像 -->
        <UserAvatar
          class="user-avatar"
          :user="postBrief && postBrief.author"
        />

        <!-- 作者昵称 -->
        <span>{{postBrief.author.nickname}}</span>

      </router-link>

      <!-- 右边主要信息部分 -->
      <section class="right-wrapper">

        <!-- 标题 -->
        <router-link :to="`/posts/${postBrief._id}`">
          <h2 v-html="keyword === '' ? postBrief.title : replaceKeyword(postBrief.title)"></h2>
          <div class="right-center-wrapper">
            <div
              class="first-pic-wrapper"
              v-if="postBrief.firstPic"
            >
              <!-- <div
                class="first-pic-inner larger-on-hover"
                :style="`backgroundImage: url(https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574787624555&di=c2f513dd1d5b31519820fa170e6aefa3&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F40589d4825127ef89c43064f07e78f6dfb5bc6cc167f1-mkR4k8_fw658)`"
              >
                <img
                  :alt="postBrief.title"
                  src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574787624555&di=c2f513dd1d5b31519820fa170e6aefa3&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F40589d4825127ef89c43064f07e78f6dfb5bc6cc167f1-mkR4k8_fw658"
                >
            </div> -->
              <div
                class="first-pic-inner larger-on-hover"
                :style="`backgroundImage: url(${postBrief.firstPic && escape2Html(postBrief.firstPic)})`"
              >
                <img
                  :alt="postBrief.title"
                  :src="postBrief.firstPic && escape2Html(postBrief.firstPic)"
                >
              </div>
            </div>
            <p
              v-html="postBrief.content"
              class="content-brief"
            ></p>
          </div>
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
              color="gray"
              :class="postBrief.ifLike ? 'like-btn active' : 'like-btn'"
              @click.prevent="onLike(
                postBrief._id,
                'post',
                postBrief.author._id)"
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
                color="gray"
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
import UserAvatar from "@/components/UserAvatar.vue";
import { dateDiff } from "@/utils/time";
import { formatNumber } from "@/utils/format";
import getPy from "@/utils/nameToPinyin";
import { Getter, Action } from "vuex-class";
import { PostBrief } from "@/assets/js/dataType";
import { LikeTargetType } from "@/api/like";
import { hashId2DetaultAvatar } from "@/utils/hash";
import { escape2Html } from "@/utils/articleHtml.ts";

export interface PostLikePayload {
  targetId: string;
  type: string;
  authorId: string;
}

@Component({
  components: { UserAvatar }
})
export default class Post extends Vue {
  // Props
  @Prop({
    type: Object,
    default: {},
    required: true
  })
  postBrief!: PostBrief;

  // 搜索帖子返回高亮标题关键字
  @Prop({
    type: String,
    default: "",
    required: false
  })
  keyword!: string;

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
  // 将图片url的html转码反转义
  escape2Html: (rawString: string) => string = escape2Html;

  // searchValue: string = "";
  // ifFocusSearch: boolean = false;

  // Computed
  // 默认头像名为avatar-n.jpg，n为id的哈希数值（1-64）
  get defaultAvatarNum(): number {
    return this.postBrief.author && this.postBrief.author._id
      ? hashId2DetaultAvatar(this.postBrief.author._id, 64)
      : 1;
  }

  // Lifecycle
  private mounted() {}

  // Methods
  onLike(targetId: string, type: LikeTargetType, authorId: string) {
    if (!this.isLogin) {
      this.openLoginDialog();
      return;
    }

    this.emitTogglePostLike({
      targetId,
      type,
      authorId
    });

    console.log("like");
    return;
  }

  onComment() {
    if (!this.isLogin) {
      this.openLoginDialog();
      return;
    }

    this.$router.push({
      name: "post",
      params: {
        id: this.postBrief._id
      },
      hash: '#comment-editor'
    });

    return;
  }

  // 搜索返回高亮关键字
  replaceKeyword(title: string) {
    return title.replace(
      new RegExp(this.keyword, "g"),
      `<span>${this.keyword}</span>`
    );
  }

  @Emit("emitTogglePostLike")
  emitTogglePostLike(payload: PostLikePayload) {}

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
  text-align: left;
  display: block;
  &:not(:last-child) {
    border-bottom: $postBottomBorder;
  }

  .post-wrapper {
    background: $mainContainerBgColor;
    // Phone
    padding: $postPhonePadding;
    border-radius: $phoneMainWrapperBorderRadius;

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
      // Phone
      padding-left: 10px;

      .right-center-wrapper {
        // Phone
        display: block;

        .first-pic-wrapper {
          // Phone
          width: 100%;
          margin-right: 0;
          height: auto;
          margin-bottom: 10px;

          .first-pic-inner {
            width: 100%;
            height: 100%;
            border-radius: 4px;
            overflow: hidden;
            background-size: cover;
            img {
              // Phone
              display: block;
              width: 100%;
            }
          }
        }

        .content-brief {
          flex: 1;
        }
      }

      h2 {
        // Phone
        margin: 24px 0 10px 0;
        &:hover {
          text-decoration: underline;
        }

        span {
          // 搜索时高亮字体
          color: $primary;
        }
      }
      .content-brief {
        margin-top: 0;
        font-size: $contentBriefFontSize;
      }

      // 底部信息
      .bottom-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .bottom-left {
          // // Phone
          // max-width: 210px;
        }
        .bottom-right {
          // Phone
          display: none;

          .mu-button {
            height: 27px;
          }
          .like-btn,
          .comment-btn {
            // Phone
            min-width: 48px;
            min-height: 30px;
            i {
              margin-right: 5px;
            }
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
      // 右部分主要信息
      .right-wrapper {
        padding-left: 50px;
        .right-center-wrapper {
          display: flex;
          .first-pic-wrapper {
            margin-right: 18px;
            width: 190px;
            height: 105px;
            .first-pic-inner {
              img {
                display: none;
              }
            }
          }
        }
        h2 {
          margin: 16px 0;
        }
        .bottom-wrapper {
          .bottom-left {
            // max-width: initial;
          }
          .bottom-right {
            display: block;
            .like-btn,
            .comment-btn {
              min-width: 64px;
            }
          }
        }
      }
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
