<template>
  <header class="category-detail-header">
    {{categoryHeaderDetail}}
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
}

// @media screen and (min-width: 576px) {
//   .category-detail-header {
//     max-width: 540px;
//   }
// }
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
