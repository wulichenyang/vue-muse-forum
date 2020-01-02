<template>
  <!-- 用户关注分类 -->
  <section class="user-follows-categories">
    <!-- 骨架屏 -->
    <Skeleton :ifShow="userFollowCategoryIds(otherUserId) && userFollowCategoryIds(otherUserId).length === 0 && this.ifLoading"></Skeleton>

    <!-- 空白内容提示条 -->
    <TipBar
      :ifShow="userFollowCategoryIds(otherUserId) && userFollowCategoryIds(otherUserId).length === 0 && !this.ifLoading"
      text="还没有关注分类哟"
    ></TipBar>
    <CategoryDetailHeader
      v-for="categoryId in userFollowCategoryIds(otherUserId)"
      :key="categoryId"
      :categoryHeaderDetail="categoryHeaderDetail(categoryId)"
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
import { Getter, Action } from "vuex-class";
import {} from "@/assets/js/dataType";
import UserAvatar from "@/components/UserAvatar.vue";
import ContainerInner from "@/components/ContainerInner.vue";
import Toast from "muse-ui-toast";
import To from "@/utils/to";
import { UserDetail } from "@/assets/js/dataType";
import { CategoryHeaderDetail } from "@/assets/js/dataType";
import CategoryDetailHeader from "@/components/CategoryDetail/CategoryDetailHeader.vue";
import TipBar from "@/components/TipBar.vue";
import Skeleton from "@/components/Skeleton.vue";

@Component({
  components: { CategoryDetailHeader, TipBar, Skeleton }
})
export default class UserFollowsCategoriesView extends Vue {
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

  // Computed
  get otherUserId() {
    return this.$route.params.id;
  }

  // Lifecycle
  private mounted() {
    this.getCategoryListIfNoCache();
  }

  // Methods
  getCategoryListIfNoCache() {
    if ((this.userFollowCategoryIds(this.otherUserId) as any).length === 0) {
      this.getFollowCategories();
    }
  }

  async getFollowCategories() {
    // Vuex里没有当前用户的关注用户列表，请求数据
    await this.getFollowCategoryList({
      userId: this.otherUserId,
      loginUserId: this.userDetail && this.userDetail._id
    });
  }

  // selectSong(song: Song, index: number): void {
  //   this.select(song, index);
  // }

  @Getter("userDetail") userDetail!: UserDetail | null;
  @Getter("categoryHeaderDetail") categoryHeaderDetail!: Promise<
    CategoryHeaderDetail
  >;
  @Getter("userFollowCategoryIds") userFollowCategoryIds!: (
    userId: string
  ) => Promise<string[]>;
  @Getter("ifLoading") ifLoading!: any;

  @Action("getFollowCategoryList") getFollowCategoryList: any;

  // @Emit("select")
  // select(listItem: Song, index: number) {}

  // @Watch("child", { immediate: true, deep: true })
  // onChildChanged(val: string, oldVal: string) {}
}
</script>

<style lang="scss">
@import "../../../assets/css/var.scss";

.user-follows-categories {
}

// @media screen and (min-width: 576px) {
//   .user-follows-categories {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .user-follows-categories {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .user-follows-categories {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .user-follows-categories {
//     max-width: 1024px;
//   }
// }
</style>
