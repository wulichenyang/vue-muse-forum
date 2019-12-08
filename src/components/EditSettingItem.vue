<template>
  <div class="edit-setting-item">

  </div>
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
import { UserSettingInfo } from "@/assets/js/dataType";

export interface UserSettingItem {
  key: string,
  value: string,
  placeholder: string,
  inputRules: any,
}

@Component({
  components: {}
})
export default class EditSettingItem extends Vue {
  // Props
  @Prop({
    type: Object,
    default: {},
    required: true
  })
  userSettingItem!: UserSettingItem;

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
.edit-setting-item {
}

// @media screen and (min-width: 576px) {
//   .edit-setting-item {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .edit-setting-item {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .edit-setting-item {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .edit-setting-item {
//     max-width: 1024px;
//   }
// }
</style>
