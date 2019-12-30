<template>
  <section class="user-collections">
    <!-- 空白内容提示条 -->
    <TipBar
      :ifShow="true"
      text="该功能还在加急开发中"
    ></TipBar>
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
import UserAvatar from "@/components/UserAvatar.vue";
import ContainerInner from "@/components/ContainerInner.vue";
import Toast from "muse-ui-toast";
import To from "@/utils/to";
import TipBar from "@/components/TipBar.vue";

@Component({
  components: {
    TipBar
  }
})
export default class UserCollectionsView extends Vue {
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
.user-collections {
}

// @media screen and (min-width: 576px) {
//   .user-collections {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .user-collections {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .user-collections {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .user-collections {
//     max-width: 1024px;
//   }
// }
</style>
