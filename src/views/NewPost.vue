<template>
  <mu-container>
    <ContainerInner class="new-post">

      <section class="chip-wrapper">
        <mu-chip
          class="chip"
          v-for="(chip, index) in categoryIds"
          :key="categoryDetail(chip)._id"
          :color="colorArray[index % (colorArray.length + 1)]"
          @click="selectCategory(categoryDetail(chip))"
        >{{categoryDetail(chip).name}}</mu-chip>
      </section>

      <section class="editor-wrapper">
        <h2>
          选择文章分类：{{categoryNow && categoryNow.name}}
        </h2>
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
import { CategoryDetail } from "@/assets/js/dataType";
import { colorArray } from "@/config/index";
import { CategoryMap } from "@/store/modules/category";
import ContainerInner from "@/components/ContainerInner.vue"

@Component({
  components: {
    ContainerInner,
  }
})
export default class NewPost extends Vue {
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
  colorArray: string[] = colorArray;
  categoryNow: CategoryDetail | {} = {};
  // searchValue: string = "";
  // ifFocusSearch: boolean = false;

  // Computed
  // get computedData() {
  //   return ' cc' + this.searchValue;
  // }

  // Lifecycle
  mounted() {
    // Vuex为空，重新请求数据
    if (this.categoryIds.length === 0) {
      this.getCategories();
    }
  }

  // Methods
  async getCategories() {
    await this.getCategoryList();
  }

  selectCategory(categoryDetail: CategoryDetail) {
    this.categoryNow = {
      ...categoryDetail
    };
  }

  // selectSong(song: Song, index: number): void {
  //   this.select(song, index);
  // }
  @Getter("categoryMap") categoryMap!: CategoryMap | {};
  @Getter("categoryIds") categoryIds!: string[] | [];
  @Getter("categoryDetail") categoryDetail: any;

  @Action("getCategoryList") getCategoryList: any;

  // @Getter("userDetail") userDetail!: UserDetail | null;

  // @Action("getUser") getUser: any;

  // @Emit("select")
  // select(listItem: Song, index: number) {}

  // @Watch("child", { immediate: true, deep: true })
  // onChildChanged(val: string, oldVal: string) {}
}
</script>

<style lang="scss">
@import "../assets/css/var.scss";
.new-post {
  .chip {
    margin: 8px;
    vertical-align: middle;
  }
}

</style>
