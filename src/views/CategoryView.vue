<template>
  <mu-container>
    <ContainerInner class="category-view-wrapper">

      <!-- 分类简介头部 -->
      <CategoryDetailHeader :categoryHeaderDetail="categoryHeaderDetail(this.categoryIdNow)" />
      <!-- 分类下的所有文章列表 -->
      <Post
        v-for="postId in categoryPostIds(categoryIdNow)"
        :key="postId"
        :postBrief="postBriefMap(categoryIdNow)[postId]"
        @emitTogglePostLike="onTogglePostLike"
      />
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
import { UserDetail } from "@/assets/js/dataType";
import CategoryDetailHeader from "@/components/CategoryDetail/CategoryDetailHeader.vue";
import Post from "@/components/Post/Post.vue";
import ContainerInner from "@/components/ContainerInner.vue";
import { PostLikePayload } from "@/components/Post/Post.vue";
@Component({
  components: {
    CategoryDetailHeader,
    Post,
    ContainerInner
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

  // Computed
  get categoryIdNow(): string {
    return this.$route.params.id;
  }

  // Lifecycle
  private mounted() {
    this.getCategoryHeaderDetailIfNoCache();
    this.getPostsIfNoCache();
  }

  // Methods
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
      userId: this.userDetail && this.userDetail._id
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

  @Action("getPostList") getPostList: any;
  @Action("toggleBriefPostLike") toggleBriefPostLike: any;
  @Action("getCategoryHeaderDetail") getCategoryHeaderDetail!: any;

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
