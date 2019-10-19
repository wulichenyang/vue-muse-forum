<template>
  <mu-container>
    <ContainerInner class="user-detail-wrapper">

      <!-- 用户头部信息 -->
      <header class="user-header">
        <UserAvatar />
        <h3>你的昵称
          <mu-icon value="man"></mu-icon>
        </h3>
        <p>你的个人简介哦</p>
        <mu-button
          small
          color="primary"
          class="follow-btn"
        >关注</mu-button>
        <mu-button
          small
          color="secondary"
        >私信</mu-button>
      </header>

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

      <!-- 用户关注、文章等信息 -->
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
import UserAvatar from "@/components/UserAvatar.vue";
import ContainerInner from "@/components/ContainerInner.vue";
import Toast from "muse-ui-toast";
import To from "@/utils/to";

@Component({
  components: {
    ContainerInner,
    UserAvatar
  }
})
export default class UserView extends Vue {
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
  activeTabIndex: number = 0;
  tabs: Array<any> = [
    {
      route: "userPosts",
      name: "文章"
    },
    {
      route: "userComments",
      name: "评论"
    },
    {
      route: "userFans",
      name: "粉丝"
    },
    {
      route: "userFollows",
      name: "关注"
    },
    {
      route: "userCollections",
      name: "收藏"
    }
  ];
  tabIndexMap: any = {
    posts: 0,
    comments: 1,
    fans: 2,
    follows: 3,
    collections: 4
  };
  // Computed
  // get computedData() {
  //   return ' cc' + this.searchValue;
  // }

  // Lifecycle
  mounted() {
    this.activeTabIndex = this.tabIndexMap[(this.$route.path.split("/") as Array<any>).pop()];
  }

  // Methods
  toPage(route: string) {
    this.$router.push({
      name: route
    });
  }

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

.user-detail-wrapper {
  padding: 0;
  margin-top: 60px;
  text-align: center;
  .user-header {
    background: url("/img/user-header-bg.jpg");
    background-size: cover;
    background-position-y: center;
    padding-bottom: 28px;
    h3 {
    }
    p {
    }
    .follow-btn {
      margin-right: 12px;
    }
  }
}

// @media screen and (min-width: 576px) {
//   .user-wrapper {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .user-wrapper {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .user-wrapper {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .user-wrapper {
//     max-width: 1024px;
//   }
// }
</style>
