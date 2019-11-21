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
  // selectSong(song: Song, index: number): void {
  //   this.select(song, index);
  // }

  // @Getter("userDetail") userDetail!: UserDetail | null;

  // @Action("getUser") getUser: any;

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
