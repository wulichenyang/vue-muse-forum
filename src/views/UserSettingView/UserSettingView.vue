<template>
    <mu-container>
    <ContainerInner class="user-setting-view">
      <!-- TABS -->
      <mu-tabs
        :value.sync="activeTabIndex"
        inverse
        color="secondary"
        text-color="rgba(0, 0, 0, .54)"
        center
      >
        <mu-tab
          @click="toPage(tab.route)"
          v-for="tab in tabs"
          :key="tab.route"
        >
          {{tab.name}}
        </mu-tab>

      </mu-tabs>

      <!-- 用户资料、修改密码等信息 -->
      <router-view></router-view>

    </ContainerInner>
  </mu-container>
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
import { UserDetail } from "@/assets/js/dataType";
import ContainerInner from "@/components/ContainerInner.vue";
import To from "@/utils/to";

@Component({
  components: {
    ContainerInner,
  }
})
export default class UserSettingView extends Vue {
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

  activeTabIndex: number = 0;
  tabs: Array<any> = [
    {
      route: "userSettingProfile",
      name: "个人资料"
    },
    {
      route: "userSettingPassword",
      name: "修改密码"
    }
  ];

  tabIndexMap: any = {
    profile: 0,
    password: 1,
  };

  // Computed
  // get computedData() {
  //   return ' cc' + this.searchValue;
  // }

  // Lifecycle
  private mounted() {
    // 更新 tab 样式
    this.updateTabIndex();

    // // 获取查看任意用户信息
    // this.getUserInfoWhenNotSaved();
  }

  // Methods
  updateTabIndex() {
    this.activeTabIndex = this.tabIndexMap[
      (this.$route.path.split("/") as Array<any>).pop()
    ];
  }
  
  toPage(route: string) {
    console.log(route)
    this.$router.push({
      name: route
    });
  }

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

.user-setting-view {
}

// @media screen and (min-width: 576px) {
//   .user-setting-view {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .user-setting-view {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .user-setting-view {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .user-setting-view {
//     max-width: 1024px;
//   }
// }
</style>
