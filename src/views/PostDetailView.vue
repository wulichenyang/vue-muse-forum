<template>
  <mu-container>
    <ContainerInner class="post-detail-wrapper">
      <!-- 作者信息 -->
      <section class="user-info">

        <!-- 左侧头像部分 -->
        <router-link
          class="left-avatar-wrapper"
          :to="`/users/${postData.author._id}`"
        >
          <!-- 头像 -->
          <mu-button
            class="user-avatar"
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
          <span>{{postData.author.nickname}}</span>
          <p>
            <!-- 发表时间 -->
            <span>{{dateDiff((new Date(postData.createdAt)).getTime())}}</span>
            <!-- 阅读次数 -->
            <span>{{formatNumber(postData.viewCount)}}次阅读</span>
          </p>
        </div>

        <!-- 右侧关注按钮 -->
        <mu-button
          class="right-btn"
          :small="true"
        >关注</mu-button>
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

      <!-- 评论 -->
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
import { Getter, Action } from "vuex-class";
import {} from "@/assets/js/dataType";

@Component({
  components: {
    ContainerInner
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
    console.log(123);
    this.getPostDetail(this.postIdNow);
  }
  // selectSong(song: Song, index: number): void {
  //   this.select(song, index);
  // }

  @Getter("postDetail") postDetail!: any;

  @Action("getPostDetail") getPostDetail: any;

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
  .mu-button {
    width: $postAvatarSize;
    height: $postAvatarSize;
    background: transparent;
  }
  .user-info {
    display: flex;
    // 左侧
    .left-avatar-wrapper {
      width: $postAvatarSize;
    }

    // 中间
    .center-wrapper {
      flex: 1;
      p {
        color: $linkFontColor;
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
    .right-btn {
      width: 100px;
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