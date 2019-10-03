<template>
  <section class="home-wrapper">
    <mu-container>
      <!-- 文章分类列表 -->
      <section class="category-tab-wrapper">
        <mu-button
          round
          class="chip"
          v-for="(chipId) in categoryIds"
          :key="categoryDetail(chipId)._id"
          :color="categoryDetail(chipId)._id === categoryNow._id ? colorArray[0] : colorArray[1]"
          @click="onSelectCategory(categoryDetail(chipId))"
        >{{categoryDetail(chipId).name}}</mu-button>
      </section>
      <ContainerInner class="main-content">
        <router-view></router-view>
      </ContainerInner>
    </mu-container>
  </section>
</template>

<script lang="ts">
import { Getter, Action } from "vuex-class";
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { colorArray } from "@/config/index";
import ContainerInner from "@/components/ContainerInner.vue";
import { CategoryMap } from "@/store/modules/category";
import To from "@/utils/to";
import { CategoryDetail } from "../assets/js/dataType";
@Component({
  components: {
    ContainerInner
  }
})
export default class Home extends Vue {
  // Props
  // @Prop({
  //   type: String,
  //   default: [],
  //   required: true,
  // })
  // list!: string;
  categoryNow: CategoryDetail = <CategoryDetail>{};
  colorArray: string[] = colorArray;
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
  async mounted() {
    // Vuex CategoryList为空，重新请求数据
    if (this.categoryIds.length === 0) {
      await this.getCategories();
    }

    // 如果是在/home目录，则初始化选择跳转默认category
    if (!this.$route.path.includes("categories")) {
      this.redirectCategory();
    }

    // 设置当前文章分类
    this.setCategoryNow();
  }

  // Methods

  setCategoryNow() {
    this.categoryNow = (this.categoryMap as CategoryMap)[this.$route.params.id];
  }

  redirectCategory() {
    let id = (this.categoryMap as CategoryMap)[this.categoryIds[0]]._id;
    this.$router.push({ name: "PostListView", params: { id } });
  }

  onSelectCategory(categoryDetail: CategoryDetail) {
    this.categoryNow = categoryDetail;
    let id = this.categoryNow._id;
    this.$router.push({ name: "PostListView", params: { id } });
  }

  async getCategories() {
    await this.getCategoryList();
  }
  // selectSong(song: Song, index: number): void {
  //   this.select(song, index);
  // }

  // @Getter("userDetail") userDetail!: UserDetail | null;

  // @Action("getUser") getUser: any;

  @Getter("categoryMap") categoryMap!: CategoryMap | {};
  @Getter("categoryIds") categoryIds!: string[] | [];
  @Getter("categoryDetail") categoryDetail: any;

  @Action("getCategoryList") getCategoryList: any;

  // @Emit("select")
  // select(listItem: Song, index: number) {}

  // @Watch("child", { immediate: true, deep: true })
  // onChildChanged(val: string, oldVal: string) {}
}
</script>

<style lang="scss">
@import "../assets/css/var.scss";
.home-wrapper {
  .category-tab-wrapper {
    margin-bottom: 20px;
  }
}

// @media screen and (min-width: 576px) {
//   .home-wrapper {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .home-wrapper {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .home-wrapper {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .home-wrapper {
//     max-width: 1024px;
//   }
// }
</style>

