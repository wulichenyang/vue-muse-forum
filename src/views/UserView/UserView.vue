<template>
  <mu-container>
    <ContainerInner class="user-detail-wrapper">
      <!-- 用户头部信息 -->
      <header class="user-header">

        <!-- 头像 -->
        <UserAvatar
          :user="otherUser"
          :isLink="false"
          :size="120"
        />

        <!-- 昵称 -->
        <h3>
          {{otherUser && otherUser.nickname}}
          <mu-icon value=":mudocs-icon-action-boy"></mu-icon>
        </h3>

        <!-- 个人简介 -->
        <p v-if="otherUser && otherUser.brief">{{otherUser && otherUser.brief}}</p>
        <p v-else>TA还没有个人简介哦~</p>

        <!-- 关注/私信 按钮 -->
        <mu-button
          v-if="otherUser && userDetail && otherUser._id !== userDetail._id || otherUser && !userDetail"
          small
          color="primary"
          class="follow-btn"
          @click="onToggleFollowUser(
            otherUser._id,
            'user'
          )"
        >{{otherUser.ifFollow ? '已关注':'关注'}}</mu-button>

        <mu-button
          v-if="otherUser && userDetail && otherUser._id !== userDetail._id || otherUser && !userDetail"
          small
          color="secondary"
          @click="onMessageTo"
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
          {{tab.name}}{{thisTabCount(tab.name)}}
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
import { UserDetail, OtherUserDetail } from "@/assets/js/dataType";
import UserAvatar from "@/components/UserAvatar.vue";
import ContainerInner from "@/components/ContainerInner.vue";
import Toast from "muse-ui-toast";
import To from "@/utils/to";
import { FollowTargetType } from "@/api/follow";

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
  get otherUserId() {
    return this.$route.params.id;
  }

  get otherUser() {
    return this.otherUserDetail(this.otherUserId);
  }

  // Lifecycle
  private mounted() {
    // tab 样式
    this.activeTabIndex = this.tabIndexMap[
      (this.$route.path.split("/") as Array<any>).pop()
    ];

    // 获取查看任意用户信息
    this.getUserInfoWhenNotSaved();
  }

  // Methods
  toPage(route: string) {
    this.$router.push({
      name: route
    });
  }

  thisTabCount(tabName: string) {
    switch (tabName) {
      case "文章":
        return this.otherUser && this.otherUser.postCount;
        break;
      case "评论":
        return this.otherUser && this.otherUser.commentCount;
        break;
      case "粉丝":
        return this.otherUser && this.otherUser.fansCount;
      case "关注":
        return (
          this.otherUser &&
          this.otherUser.followPeopleCount +
            this.otherUser.followCategoryCount +
            this.otherUser.followPostCount
        );
        break;
      case "收藏":
        return this.otherUser && this.otherUser.collectPostCount;
        break;
      default:
        return "";
        break;
    }
  }

  onToggleFollowUser(targetId: string, type: FollowTargetType) {
    if (!this.isLogin) {
      this.openLoginDialog();
      return;
    }
    this.toggleUserFollow({
      targetId,
      type
    });
  }

  getUserInfoWhenNotSaved() {
    if (!this.otherUser) {
      this.getOtherUserDetail({
        targetUserId: this.otherUserId,
        fromUserId: this.userDetail && this.userDetail._id
      });
    }
  }

  onMessageTo() {
    if (!this.isLogin) {
      this.openLoginDialog();
      return;
    }
  }
  // selectSong(song: Song, index: number): void {
  //   this.select(song, index);
  // }

  @Getter("userDetail") userDetail!: UserDetail | null;
  @Getter("otherUserDetail") otherUserDetail!: any;
  @Getter("isLogin") isLogin!: boolean | null;
  @Action("openLoginDialog") openLoginDialog: any;
  @Action("getOtherUserDetail") getOtherUserDetail: any;
  @Action("toggleUserFollow") toggleUserFollow: any;
  // @Action("getUser") getUser: any;

  // @Emit("select")
  // select(listItem: Song, index: number) {}

  @Watch("$route", { immediate: true, deep: true })
  onRouteChange(val: string, oldVal: string) {
    if (oldVal !== val && (val as any).fullPath.endsWith("posts")) {
      // 重置tab
      this.activeTabIndex = 0;
    }
    // 获取查看任意用户信息
    this.getUserInfoWhenNotSaved();
  }
}
</script>

<style lang="scss">
@import "../../assets/css/var.scss";

.user-detail-wrapper {
  padding: 0;
  // Phone
  margin-top: 20px;

  text-align: center;
  .user-header {
    background: url("/img/user-header-bg.jpg");
    background-size: cover;
    background-position-y: center;
    padding-bottom: 28px;
    .avatar-btn {
      margin-top: -20px;
      border: 2px solid #fff;
    }
    h3 {
    }
    p {
    }
    .follow-btn {
      margin-right: 12px;
    }
  }
}

@media screen and (min-width: 576px) {
  .user-detail-wrapper {
    margin-top: 36px;
  }
}
// @media screen and (min-width: 768px) {
//   .user-detail-wrapper {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .user-detail-wrapper {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .user-detail-wrapper {
//     max-width: 1024px;
//   }
// }
</style>