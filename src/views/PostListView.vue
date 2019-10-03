<template>
  <section class="post-view-wrapper">
    <Post
      v-for="postId in postIds(categoryIdNow)"
      :key="postId"
      :postBrief="postBriefMap(categoryIdNow)[postId]"
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
  mounted() {
    if (true) {
      // Vuex里没有当前文章列表，请求数据
      this.getPostListData();
    }
  }

  // Methods
  get categoryIdNow(): string {
    return this.$route.params.id;
  }

  async getPostListData() {
    await this.getPostList(this.categoryIdNow);
  }
  // selectSong(song: Song, index: number): void {
  //   this.select(song, index);
  // }

  @Getter("postBriefMap") postBriefMap!: PostBrief;
  @Getter("postIds") postIds!: any;

  @Action("getPostList") getPostList: any;
  // @Emit("select")
  // select(listItem: Song, index: number) {}

  // @Watch("child", { immediate: true, deep: true })
  // onChildChanged(val: string, oldVal: string) {}
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
