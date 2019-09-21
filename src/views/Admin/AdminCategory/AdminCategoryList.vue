<template>
  <section class="admin-category-list">
    <FormWrapper title="分类列表">
      <div class="btn-wrapper">
        <!-- 添加分类按钮 -->
        <mu-button
          @click="toAdd"
          fab
          color="primary"
        >
          <mu-icon value="add"></mu-icon>
        </mu-button>
      </div>
      <mu-chip
        class="chip"
        v-for="(chip, index) in categoryIds"
        :key="categoryDetail(chip)._id"
        :color="colorArray[index % 7]"
        @click="toEdit"
        @delete="removeCategory(categoryDetail(chip)._id)"
        delete
      >{{categoryDetail(chip).name}}</mu-chip>
    </FormWrapper>
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
import FormWrapper from "@/components/FormWrapper.vue";
import { Getter, Action } from "vuex-class";
import {} from "@/assets/js/dataType";
import To from "@/utils/to";
import Toast from "muse-ui-toast";
import { CategoryMap } from "@/store/modules/category";
import { addCategory } from "@/api/category";
import AdminCategoryUpdate from "./AdminCategoryUpdate.vue";
@Component({
  components: {
    FormWrapper
  }
})
// TODO: copper
export default class AdminCategoryList extends Vue {
  // Props
  // @Prop({
  //   default: [],
  //   required: true,
  // })
  // list!: any;

  // @Model("onChange", {
  //   type: String
  // })
  // searchKey!: string;

  // Data
  // categoryList: Array<>
  colorArray: string[] = [
    "primary",
    "secondary",
    "success",
    "warning",
    "info",
    "error"
  ];
  // Computed
  // get computedData() {
  //   return ' cc' + this.searchValue;
  // }

  // Lifecycle
  mounted() {
    if(this.categoryIds.length === 0) {
      this.getCategories();
    }
  }

  // Methods
  async getCategories() {
    await this.getCategoryList();
  }

  toAdd() {
    this.$router.push("/admin/categories/add");
    // 更新面包屑导航
    this.$emit("toAdd");
    // this.breadcrumbs.splice(2, 1, {
    //   text: "添加分类"
    // });
  }

  toEdit() {
    this.$router.push("/admin/categories/edit");
    // 更新面包屑导航
    this.$emit("toEdit");
    // this.breadcrumbs.splice(2, 1, {
    //   text: "编辑分类"
    // });
  }

  removeCategory(categoryId: string) {
    console.log("remove category: _id:  ", categoryId);
  }

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
@import "../../../assets/css/var.scss";
.admin-category-list {
  .btn-wrapper {
    position: absolute;
    top: 36px;
    right: 36px;
  }

  .chip {
    margin: 8px;
    vertical-align: middle;
  }
}
</style>
