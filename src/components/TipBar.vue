<template>
  <p v-if="this.ifShow" class="tip-bar">
    -- {{this.text}} --
  </p>
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

@Component({
  components: {}
})
export default class TipBar extends Vue {
  // Props
  @Prop({
    type: Boolean,
    default: true,
    required: false,
  })
  ifShow!: boolean;
  @Prop({
    type: String,
    default: "",
    required: true,
  })
  text!: string;

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
.tip-bar {
  margin: 0;
  padding: 20px;
  text-align: center;
  color:  $linkFontColor;
}


// @media screen and (min-width: 576px) {
//   .tip-bar {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .tip-bar {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .tip-bar {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .tip-bar {
//     max-width: 1024px;
//   }
// }
</style>
