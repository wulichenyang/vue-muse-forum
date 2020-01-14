<template>
  <!-- 分类下的文章列表 -->
  <section
    class="post-view-wrapper"
    ref="container"
  >
    <!-- 骨架屏 -->
    <Skeleton :ifShow="categoryPostIds(categoryIdNow) && categoryPostIds(categoryIdNow).length === 0 && this.ifLoading"></Skeleton>

    <!-- 空白内容提示条 -->
    <TipBar
      :ifShow="categoryPostIds(categoryIdNow) && categoryPostIds(categoryIdNow).length === 0 && !this.ifLoading"
      text="还没有文章哟"
    ></TipBar>
    <!-- 无限滚动动态请求 -->
    <mu-load-more
      :class="this.loading ? '' : 'hid-scroll'"
      color="primary"
      @refresh="refresh"
      :refreshing="refreshing"
      :loading="loading"
      @load="load"
    >
      <Post
        v-for="postId in categoryPostIds(categoryIdNow)"
        :key="postId"
        :postBrief="postBriefMap(categoryIdNow)[postId]"
        @emitTogglePostLike="onTogglePostLike"
      />
    </mu-load-more>
    <!-- 加载完毕提示栏 -->
    <TipBar
      :ifShow="this.categoryToPageRequestPayloadMap(this.categoryIdNow) && this.categoryToPageRequestPayloadMap(this.categoryIdNow).noMore"
      text="已经到底啦"
    ></TipBar>
  </section>
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
import Post from "@/components/Post/Post.vue";
import { Getter, Action } from "vuex-class";
import {
  UserBrief,
  PostBrief,
  PageRequestPayload,
  CategoryToPageRequestPayloadMap
} from "@/assets/js/dataType";
import { PostLikePayload } from "@/components/Post/Post.vue";
import TipBar from "@/components/TipBar.vue";
import Skeleton from "@/components/Skeleton.vue";
import LoadingMixin from '@/mixins/LoadingMixin.vue'
import UserDetailMixin from '@/mixins/UserDetailMixin.vue'

@Component({
  components: {
    Post,
    TipBar,
    Skeleton
  }
})
export default class PostListView extends Mixins(LoadingMixin, UserDetailMixin) {
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
  // 对应分类下每次请求的页数

  // categoryToPageRequestPayloadMap: CategoryToPageRequestPayloadMap = <    CategoryToPageRequestPayloadMap
  // >{};
  // PageRequestPayload = {
  //   page: 0,
  //   noMore: false
  // };

  // 请求时的标志
  refreshing: boolean = false;
  loading: boolean = false;

  // ifFocusSearch: boolean = false;

  // Computed
  // get computedData() {
  //   return ' cc' + this.searchValue;
  // }

  // Lifecycle
  private mounted() {
    this.getPostsIfNoCache();
  }

  // private activated() {
  //   console.log('activated')
  //   this.getPostsIfNoCache();
  // }

  // Methods
  private async refresh() {
    this.refreshing = true;
    (this.$refs.container as Element).scrollTop = 0;
    this.resetCategoryToListPage({
      categoryId: this.categoryIdNow
    });
    await this.refreshPostList({
      categoryId: this.categoryIdNow,
      userId: this.userDetail && this.userDetail._id,
      pageRequestPayload: this.categoryToPageRequestPayloadMap(
        this.categoryIdNow
      )
    });

    this.refreshing = false;
  }

  private async load() {
    // 还有更多的数据，可以请求
    if (
      !this.categoryToPageRequestPayloadMap(this.categoryIdNow).noMore &&
      !this.refreshing
    ) {
      this.loading = true;

      this.addCategoryToListPage({ categoryId: this.categoryIdNow });
      let res = await this.getPostList({
        categoryId: this.categoryIdNow,
        userId: this.userDetail && this.userDetail._id,
        pageRequestPayload: this.categoryToPageRequestPayloadMap(
          this.categoryIdNow
        )
      });

      this.loading = false;

      // 没有更多数据
      // if (res === "noMore") {
      //   this.noMoreDataCategoryToListPage({ categoryId: this.categoryIdNow });
      // }
    }
  }

  get categoryIdNow(): string {
    return this.$route.params.id;
  }

  async getPostListData() {
    await this.getPostList({
      categoryId: this.categoryIdNow,
      userId: this.userDetail && this.userDetail._id,
      pageRequestPayload: this.categoryToPageRequestPayloadMap(
        this.categoryIdNow
      )
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

  @Getter("postBriefMap") postBriefMap!: any;
  @Getter("categoryToPageRequestPayloadMap")
  categoryToPageRequestPayloadMap!: any;
  @Getter("categoryPostIds") categoryPostIds!: any;

  @Action("addCategoryToListPage") addCategoryToListPage: any;
  @Action("noMoreDataCategoryToListPage") noMoreDataCategoryToListPage: any;
  @Action("resetCategoryToListPage") resetCategoryToListPage: any;
  @Action("getPostList") getPostList: any;
  @Action("refreshPostList") refreshPostList: any;
  // @Emit("select")
  // select(listItem: Song, index: number) {}
  @Action("toggleBriefPostLike") toggleBriefPostLike: any;

  // 监听categoryId的路由变化，请求文章列表
  @Watch("$route", { immediate: true, deep: true })
  onRouterChanged(to: any, from: any) {
    if (to) {
      if (!from) {
        // 首次不用加载，防止首次和mounted同时请求
        return;
      }
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
