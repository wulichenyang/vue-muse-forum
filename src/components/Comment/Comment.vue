<template>
  <article class="comment-wrapper">
    {{commentDetail}}
  </article>
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
import { CommentDetail } from "@/assets/js/dataType";

@Component({
  components: {}
})
export default class Comment extends Vue {
  // Props
  @Prop({
    type: Object,
    default: {},
    required: true
  })
  commentDetail!: CommentDetail;

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
  mounted() {}

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
.comment-wrapper {
  
}

// @media screen and (min-width: 576px) {
//   .comment-wrapper {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .comment-wrapper {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .comment-wrapper {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .comment-wrapper {
//     max-width: 1024px;
//   }
// }
</style>
