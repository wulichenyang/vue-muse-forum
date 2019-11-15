<template>
  <section class="post-view-wrapper">
    <Post
      v-for="postId in categoryPostIds(categoryIdNow)"
      :key="postId"
      :postBrief="postBriefMap(categoryIdNow)[postId]"
      @emitTogglePostLike="onTogglePostLike"
    />
  </section>
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
import Post from "@/components/Post/Post.vue";
import { Getter, Action } from "vuex-class";
import { UserBrief, PostBrief } from "@/assets/js/dataType";
import { PostLikePayload } from "@/components/Post/Post.vue";

@Component({
  components: {
    Post
  }
})
export default class PostListView extends Vue {
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
  // searchValue: string = "";
  // ifFocusSearch: boolean = false;

  // Computed
  // get computedData() {
  //   return ' cc' + this.searchValue;
  // }

  // Lifecycle
  private mounted() {
    this.getPostsIfNoCache();
  }

  // Methods
  get categoryIdNow(): string {
    return this.$route.params.id;
  }

  async getPostListData() {
    await this.getPostList({
      categoryId: this.categoryIdNow,
      userId: this.userDetail && this.userDetail._id
    });
  }
  // selectSong(song: Song, index: number): void {
  //   this.select(song, index);
  // }
  onTogglePostLike(payload: PostLikePayload) {
    const { targetId, type, authorId } = payload;
    this.toggleBriefPostLike({
      targetId,
      type,
      authorId
    });
  }

  getPostsIfNoCache() {
    if (
      !this.categoryPostIds(this.categoryIdNow) ||
      this.categoryPostIds(this.categoryIdNow).length === 0
    ) {
      // Vuex里没有当前文章列表ids，请求数据
      this.getPostListData();
    }
  }

  @Getter("userDetail") userDetail!: any;
  @Getter("postBriefMap") postBriefMap!: any;
  @Getter("categoryPostIds") categoryPostIds!: any;

  @Action("getPostList") getPostList: any;
  // @Emit("select")
  // select(listItem: Song, index: number) {}
  @Action("toggleBriefPostLike") toggleBriefPostLike: any;

  // 监听路由变化，请求文章列表
  @Watch("$route", { immediate: true, deep: true })
  onRouterChanged(to: any, from: any) {
    if (to) {
      let toPath = to.fullPath;
      if (toPath.includes("/categories")) {
        this.getPostsIfNoCache();
      }
    }
  }
}
</script>

<style lang="scss">
@import "../assets/css/var.scss";
.post-view-wrapper {
}

// @media screen and (min-width: 576px) {
//   .post-view-wrapper {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .post-view-wrapper {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .post-view-wrapper {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .post-view-wrapper {
//     max-width: 1024px;
//   }
// }
</style>
