<template>
  <router-link :to="`/categories/${categoryHeaderDetail._id}`">
    <header class="category-detail-header larger-item-hover ">
      <!-- 分类图标 -->
      <section class="category-avatar">
        <mu-button
          class="avatar-btn"
          fab
        >
          <mu-avatar>
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
        <!-- 关注按钮 -->
        <mu-button
          v-if="categoryHeaderDetail.ifFollow"
          small
          color="primary"
          class="follow-btn"
          @click.prevent="onToggleFollowCategory(
            categoryHeaderDetail._id,
            'category'
          )"
        >
          <mu-icon value="done"></mu-icon>
          已关注
        </mu-button>
        <mu-button
          v-else
          small
          color="primary"
          class="follow-btn"
          @click.prevent="onToggleFollowCategory(
            categoryHeaderDetail._id,
            'category'
          )"
        >
          <mu-icon value="add"></mu-icon>
          关注
        </mu-button>
      </section>

    </header>
  </router-link>

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
import { Getter, Action } from "vuex-class";
import { CategoryHeaderDetail } from "@/assets/js/dataType";
import { FollowTargetType } from "@/api/follow";
import UserDetailMixin from '@/mixins/UserDetailMixin.vue'
import CheckLoginMixin from '@/mixins/CheckLoginMixin.vue'

@Component({
  components: {}
})
export default class CategoryDetailHeader extends Mixins(UserDetailMixin, CheckLoginMixin) {
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
  // size: number = 80;
  // Computed
  // get computedData() {
  //   return ' cc' + this.searchValue;
  // }

  // Lifecycle
  private mounted() {}

  // Methods
  onToggleFollowCategory(targetId: string, type: FollowTargetType) {
    if(this.ifLogin()) {
      this.toggleCategoryFollow({
        targetId,
        type
      });
    }
  }

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
  position: relative;
  z-index: 200;
  display: flex;
  background-color: $mainContainerBgColor;

  // Phone
  padding: 16px 24px;

  border-bottom: $postBottomBorder;

  .category-avatar {
    display: flex;
    align-items: center;
    margin-right: 20px;
    .mu-avatar {
      // Phone
      width: 48px !important;
      height: 48px !important;
    }
  }
  .category-brief {
    flex: 1;
    margin-right: 20px;
    text-align: left;
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
    .category-avatar {
      .mu-avatar {
        width: 80px !important;
        height: 80px !important;
      }
    }
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
