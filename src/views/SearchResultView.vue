<template>
  <section class="search-result-wrapper">
    <mu-container>
      <ContainerInner class="post-main-content">
        <section
          v-if="searchPostList && searchPostList.length"
          class="post-view-wrapper"
        >
          <Post
            v-for="post in searchPostList"
            :key="post._id"
            :postBrief="post"
            :keyword="searchKeyNow"
            @emitTogglePostLike="onTogglePostLike"
          />
        </section>
        <section
          v-else
          class="no-search"
        >
          <p>没有找到啊 T.T</p>
        </section>
      </ContainerInner>
    </mu-container>
  </section>
</template>

<script lang="ts">
import { Getter, Action } from "vuex-class";
import {
  Component,
  Vue,
  Prop,
  Emit,
  Model,
  Watch
} from "vue-property-decorator";
import { searchPostListOrUserOrCategory } from "@/api/search";
import ContainerInner from "@/components/ContainerInner.vue";
import { CategoryMap } from "@/store/modules/category";
import To from "@/utils/to";
import { CategoryDetail } from "../assets/js/dataType";
import Post from "@/components/Post/Post.vue";
import { UserBrief, PostBrief } from "@/assets/js/dataType";
import { PostLikePayload } from "@/components/Post/Post.vue";

@Component({
  components: {
    ContainerInner,
    Post
  }
})
export default class SearchResultView extends Vue {
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
  searchPostList: Array<PostBrief> = [];
  // searchValue: string = "";
  // ifFocusSearch: boolean = false;

  // Computed
  // get computedData() {
  //   return ' cc' + this.searchValue;
  // }

  // Lifecycle
  private mounted() {
    this.getPostListData();
  }

  // Methods
  get searchKeyNow(): string | string[] {
    return this.$route.query.key;
  }

  async getPostListData() {
    let res = await searchPostListOrUserOrCategory({
      searchKey: this.searchKeyNow,
      userId: this.userDetail && this.userDetail._id
    });
    if (res && res.code === 0) {
      this.searchPostList = res.data;
    }
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

  @Getter("userDetail") userDetail!: any;
  @Action("toggleBriefPostLike") toggleBriefPostLike: any;
  @Watch("$route", { immediate: true, deep: true })
  onRouterChanged(to: any, from: any) {
    // 监听搜索值改变
    if (from && from.query.key !== to.query.key) {
      this.getPostListData();
    }
  }
}
</script>

<style lang="scss">
@import "../assets/css/var.scss";
.search-result-wrapper {
  .category-tab-wrapper {
    margin-bottom: 20px;
  }
  .post-main-content {
    padding: 0 !important;
  }
  .no-search {
    padding: 20px;
    text-align: center;
  }
}

// @media screen and (min-width: 576px) {
//   .search-result-wrapper {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .search-result-wrapper {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .search-result-wrapper {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .search-result-wrapper {
//     max-width: 1024px;
//   }
// }
</style>

