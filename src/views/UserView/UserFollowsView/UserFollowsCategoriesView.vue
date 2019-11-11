<template>
  <section class="user-follows-categories">
    categories
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

@Component({
  components: {}
})
export default class UserFollowsCategoriesView extends Vue {
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
@import "../../../assets/css/var.scss";

.user-follows-categories {
}

// @media screen and (min-width: 576px) {
//   .user-follows-categories {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .user-follows-categories {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .user-follows-categories {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .user-follows-categories {
//     max-width: 1024px;
//   }
// }
</style>
