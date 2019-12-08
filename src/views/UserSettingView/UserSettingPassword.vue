<template>
  <section class="user-setting-password">
    <h2>修改密码</h2>

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
export default class UserSettingPassword extends Vue {
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
.user-setting-password {
}

// @media screen and (min-width: 576px) {
//   .user-setting-password {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .user-setting-password {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .user-setting-password {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .user-setting-password {
//     max-width: 1024px;
//   }
// }
</style>
