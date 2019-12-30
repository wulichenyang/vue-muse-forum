<template>
  <mu-container>
    <ContainerInner class="category-view-wrapper">

      <!-- 分类简介头部 -->
      <CategoryDetailHeader :categoryHeaderDetail="categoryHeaderDetail(this.categoryIdNow)" />
      <!-- 分类下的所有文章列表 -->
      <section ref="container">
        <!-- 空白内容提示条 -->
        <TipBar
          :ifShow="categoryPostIds(categoryIdNow) && categoryPostIds(categoryIdNow).length === 0"
          text="还没有文章哟"
        ></TipBar>
        <!-- 无限滚动动态请求 -->
        <mu-load-more
          color="primary"
          :class="this.loading ? '' : 'hid-scroll'"
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
import { Getter, Action } from "vuex-class";
import {
  UserDetail,
  PageRequestPayload,
  CategoryToPageRequestPayloadMap
} from "@/assets/js/dataType";
import CategoryDetailHeader from "@/components/CategoryDetail/CategoryDetailHeader.vue";
import Post from "@/components/Post/Post.vue";
import ContainerInner from "@/components/ContainerInner.vue";
import { PostLikePayload } from "@/components/Post/Post.vue";
import TipBar from "@/components/TipBar.vue";

@Component({
  components: {
    CategoryDetailHeader,
    Post,
    ContainerInner,
    TipBar
  }
})
export default class CategoryView extends Vue {
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
  // 对应分类下每次请求的页数

  // 请求时的标志
  refreshing: boolean = false;
  loading: boolean = false;

  // Computed
  get categoryIdNow(): string {
    return this.$route.params.id;
  }

  // Lifecycle
  // private created() {
  //   this.getCategoryHeaderDetailIfNoCache();
  //   this.getPostsIfNoCache();
  // }

  private activated() {
    this.getCategoryHeaderDetailIfNoCache();
    this.getPostsIfNoCache();
  }

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

  // selectSong(song: Song, index: number): void {
  //   this.select(song, index);
  // }

  getPostsIfNoCache() {
    if (
      !this.categoryPostIds(this.categoryIdNow) ||
      this.categoryPostIds(this.categoryIdNow).length === 0
    ) {
      // Vuex里没有当前文章列表ids，请求数据
      this.getPostListData();
    }
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

  async getCategoryHeaderDetailData() {
    await this.getCategoryHeaderDetail({
      categoryId: this.categoryIdNow,
      userId: this.userDetail && this.userDetail._id
    });
  }

  getCategoryHeaderDetailIfNoCache() {
    if (
      this.categoryHeaderDetail(this.categoryIdNow) &&
      !this.categoryHeaderDetail(this.categoryIdNow)._id
    ) {
      // Vuex里没有当前分类详细信息缓存，请求数据
      this.getCategoryHeaderDetailData();
    }
  }

  onTogglePostLike(payload: PostLikePayload) {
    const { targetId, type, authorId } = payload;
    this.toggleBriefPostLike({
      targetId,
      type,
      authorId
    });
  }

  @Getter("userDetail") userDetail!: UserDetail | null;
  @Getter("categoryHeaderDetail") categoryHeaderDetail!: any;
  @Getter("postBriefMap") postBriefMap!: any;
  @Getter("categoryPostIds") categoryPostIds!: any;
  @Getter("categoryToPageRequestPayloadMap")
  categoryToPageRequestPayloadMap!: any;
  @Action("addCategoryToListPage")
  addCategoryToListPage: any;
  @Action("noMoreDataCategoryToListPage") noMoreDataCategoryToListPage: any;
  @Action("resetCategoryToListPage") resetCategoryToListPage: any;
  @Action("getPostList") getPostList: any;
  @Action("toggleBriefPostLike") toggleBriefPostLike: any;
  @Action("getCategoryHeaderDetail") getCategoryHeaderDetail!: any;
  @Action("refreshPostList") refreshPostList: any;

  // @Emit("select")
  // select(listItem: Song, index: number) {}

  // @Watch("child", { immediate: true, deep: true })
  // onChildChanged(val: string, oldVal: string) {}
}
</script>

<style lang="scss">
@import "../assets/css/var.scss";
.category-view-wrapper {
  padding: 0;
}

// @media screen and (min-width: 576px) {
//   .category-view-wrapper {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .category-view-wrapper {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .category-view-wrapper {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .category-view-wrapper {
//     max-width: 1024px;
//   }
// }
</style>
