<template>
  <header class="category-detail-header">
    <!-- 分类图标 -->
    <section class="category-avatar">
      <mu-button
        class="avatar-btn"
        fab
      >
        <mu-avatar :size="size">
          <img :src="categoryHeaderDetail.avatar">
        </mu-avatar>
      </mu-button>
    </section>

    <!-- 分类简介 -->
    <section class="category-brief">
      <h2>{{categoryHeaderDetail.name}}</h2>
      <p>{{categoryHeaderDetail.brief}}</p>
      <span class="post-count">{{categoryHeaderDetail.postCount}} 文章</span>
      <span>{{categoryHeaderDetail.followCount}} 人关注</span>
    </section>

    <section class="category-follow-btn">
      <!-- 关注/私信 按钮 -->
      <mu-button
        small
        color="primary"
        class="follow-btn"
        @click="onToggleFollowCategory(
            categoryHeaderDetail._id,
            'category'
          )"
      >{{categoryHeaderDetail.ifFollow ? '已关注':'关注'}}</mu-button>
    </section>

  </header>
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
import { CategoryHeaderDetail } from "@/assets/js/dataType";
import { UserDetail } from "@/assets/js/dataType";
import { FollowTargetType } from "@/api/follow";

@Component({
  components: {}
})
export default class CategoryDetailHeader extends Vue {
  // Props
  @Prop({
    type: Object,
    default: () => {},
    required: true
  })
  categoryHeaderDetail!: CategoryHeaderDetail;

  // @Model("onChange", {
  //   type: String
  // })
  // searchKey!: string;

  // Data
  // searchValue: string = "";
  // ifFocusSearch: boolean = false;
  size: number = 80;
  // Computed
  // get computedData() {
  //   return ' cc' + this.searchValue;
  // }

  // Lifecycle
  private mounted() {}

  // Methods
  onToggleFollowCategory(targetId: string, type: FollowTargetType) {
    if (!this.isLogin) {
      this.openLoginDialog();
      return;
    }
    this.toggleCategoryFollow({
      targetId,
      type
    });
  }
  @Getter("userDetail") userDetail!: UserDetail | null;
  @Getter("isLogin") isLogin!: boolean | null;
  @Action("openLoginDialog") openLoginDialog: any;
  @Action("toggleCategoryFollow") toggleCategoryFollow: any;


  // @Emit("select")
  // select(listItem: Song, index: number) {}

  // @Watch("child", { immediate: true, deep: true })
  // onChildChanged(val: string, oldVal: string) {}
}
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.category-detail-header {
  display: flex;

  // Phone
  padding: 16px 24px;

  border-bottom: $postBottomBorder;

  .category-avatar {
    display: flex;
    align-items: center;
    margin-right: 20px;
  }
  .category-brief {
    margin-right: 20px;
    flex: 1;
    h2 {
      margin: 10px 0;
    }
    p {
      margin: 8px 0;
    }
    .post-count {
      margin-right: 16px;
    }
  }
  .category-follow-btn {
    display: flex;
    align-items: center;
  }
}

@media screen and (min-width: 576px) {
  .category-detail-header {
    padding: 24px 36px;
  }
}
// @media screen and (min-width: 768px) {
//   .category-detail-header {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .category-detail-header {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .category-detail-header {
//     max-width: 1024px;
//   }
// }
</style>
