<template>
  <section class="user-follows">
    <!-- sub tab -->
    <section class="follows-tab">
      <router-link :to="{name: 'userFollowsPosts'}">
        文章
      </router-link>
      |
      <router-link :to="{name: 'userFollowsCategories'}">
        分类
      </router-link>
      |
      <router-link :to="{name: 'userFollowsUsers'}">
        用户
      </router-link>
    </section>
    <router-view></router-view>
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
export default class UserFollowsView extends Vue {
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

.user-follows {
  .follows-tab {
    text-align: right;
    margin-right: 20px;
    color: $linkFontColor;
    padding: 10px;
    a {
      color: $tabNotActiveColor;
      margin-right: 10px;
      margin-left: 10px;
    }
    .router-link-active {
      color: $primary;
    }
  }
}

// @media screen and (min-width: 576px) {
//   .user-follows {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .user-follows {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .user-follows {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .user-follows {
//     max-width: 1024px;
//   }
// }
</style>
