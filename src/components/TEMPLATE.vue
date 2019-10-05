<template>
  <section class="xxxxx">
    template
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
import { Getter, Action } from "vuex-class";
import {} from "@/assets/js/dataType";

@Component({
  components: {}
})
export default class XXXXXX extends Vue {
  // Props
  // @Prop({
  //   type: String,
  //   default: "",
  //   required: true,
  // })
  // list!: string;

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
@import "../assets/css/var.scss";
.xxxxx {
}


// @media screen and (min-width: 576px) {
//   .xxxxx {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .xxxxx {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .xxxxx {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .xxxxx {
//     max-width: 1024px;
//   }
// }
</style>
