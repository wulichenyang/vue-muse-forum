<template>
  <!-- 骨架屏 -->
  <section class="skeleton-wrapper" v-if="this.ifShow">
    <ContentLoader
      :height="88"
      :key="i"
      v-for="i in [1,2,3,4,5,6,7,8]"
    >
      <circle cx="44" cy="40" r="20" />
      <rect x="80" y="20" rx="4" ry="4" width="220" height="13" />
      <rect x="80" y="44" rx="3" ry="3" width="260" height="10" />
      <rect x="80" y="68" rx="3" ry="3" width="180" height="10" />
    </ContentLoader>
  </section>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  // Emit,
  // Model,
  // Watch
} from "vue-property-decorator";
import {} from "@/assets/js/dataType";
import { ContentLoader } from "vue-content-loader";

@Component({
  components: {
    ContentLoader
  }
})
export default class Skeleton extends Vue {
  // Props
  @Prop({
    type: Boolean,
    default: false,
    required: true,
  })
  ifShow!: boolean;

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
@import "../assets/css/var.scss";
.skeleton-wrapper {

}


// @media screen and (min-width: 576px) {
//   .skeleton-wrapper {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .skeleton-wrapper {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .skeleton-wrapper {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .skeleton-wrapper {
//     max-width: 1024px;
//   }
// }
</style>
